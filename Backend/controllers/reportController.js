'use strict';
/**
 * controllers/reportController.js
 * Neighbourhood quality report endpoints.
 *
 * Geocoding fallback: when the Pincode collection document has no lat/lon,
 * we query the free Nominatim API (OpenStreetMap) to resolve coordinates.
 */

const axios             = require('axios');
const Pincode           = require('../models/Pincode');
const NeighborhoodScore = require('../models/NeighborhoodScore');
const SavedReport       = require('../models/SavedReport');
const orchestrator      = require('../services/scoringOrchestrator');
const logger            = require('../config/logger');
const { isValidPincode } = require('../utils/helpers');

// ─── Geocoding via Nominatim (free, no key) ───────────────────
const geocodePincode = async (pincode, district, state) => {
  try {
    const query    = encodeURIComponent(`${pincode}, ${district || ''}, ${state || ''}, India`);
    const url      = `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=1&countrycodes=in`;
    const response = await axios.get(url, {
      timeout: 10000,
      headers: { 'User-Agent': 'HomeTrust/1.0 (real-estate-platform)' }, // Nominatim requires a UA
    });
    const result = response.data?.[0];
    if (result) {
      return { lat: parseFloat(result.lat), lon: parseFloat(result.lon) };
    }
  } catch (err) {
    logger.warn(`Nominatim geocoding failed for pincode ${pincode}: ${err.message}`);
  }
  return null;
};

// ─── Helper: fetch or compute report ─────────────────────────
const getOrComputeReport = async (pincode) => {
  // 1. Try cache
  const cached = await NeighborhoodScore.findOne({ pincode }).sort({ createdAt: -1 });
  if (cached) return { report: cached, fromCache: true };

  // 2. Look up pincode from Atlas
  const pincodeDoc = await Pincode.findOne({ pincode });
  if (!pincodeDoc) return null;

  // 3. Resolve lat/lon – use stored coords or geocode
  let lat = pincodeDoc.lat;
  let lon = pincodeDoc.lon;

  if (!lat || !lon) {
    logger.info(`Pincode ${pincode} has no coordinates – geocoding via Nominatim…`);
    const coords = await geocodePincode(pincode, pincodeDoc.district, pincodeDoc.state);
    if (coords) {
      lat = coords.lat;
      lon = coords.lon;
      // Optionally persist back to Pincode doc for future requests
      await Pincode.updateOne({ pincode }, { $set: { lat, lon } });
    } else {
      // Ultimate fallback: geometric centre of India
      logger.warn(`No coordinates resolved for ${pincode}. Using default centre of India.`);
      lat = 20.5937;
      lon = 78.9629;
    }
  }

  // Attach resolved coords to pincodeDoc object (plain object for orchestrator)
  const enrichedDoc = {
    pincode       : pincodeDoc.pincode,
    lat,
    lon,
    district      : pincodeDoc.district || '',
    state         : pincodeDoc.state || '',
    officeName    : pincodeDoc.officeName || '',
    officeType    : pincodeDoc.officeType || '',
    divisionName  : pincodeDoc.divisionName || '',
    regionName    : pincodeDoc.regionName || '',
    taluk         : pincodeDoc.taluk || '',
  };

  // 4. Compute scores
  logger.info(`Computing neighborhood scores for pincode ${pincode} at (${lat.toFixed(4)}, ${lon.toFixed(4)})…`);
  const { scores, overallScore, grade } = await orchestrator.compute(enrichedDoc);

  // 5. Persist with 24h TTL
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
  const report    = await NeighborhoodScore.create({
    pincode,
    lat,
    lon,
    district : enrichedDoc.district,
    state    : enrichedDoc.state,
    scores,
    overallScore,
    grade,
    expiresAt,
  });

  return { report, fromCache: false };
};

// ─── GET /api/report/:pincode ─────────────────────────────────
const getReport = async (req, res) => {
  const { pincode } = req.params;

  if (!isValidPincode(pincode)) {
    return res.status(400).json({ error: 'Invalid pincode. Must be a 6-digit number.' });
  }

  const result = await getOrComputeReport(pincode);
  if (!result) {
    return res.status(404).json({ error: `Pincode ${pincode} not found in our database.` });
  }

  return res.json({
    fromCache: result.fromCache,
    report   : result.report,
  });
};

// ─── POST /api/report/save ────────────────────────────────────
const saveReport = async (req, res) => {
  const { pincode } = req.body;

  if (!isValidPincode(pincode)) {
    return res.status(400).json({ error: 'Invalid pincode.' });
  }

  const result = await getOrComputeReport(pincode);
  if (!result) {
    return res.status(404).json({ error: `Pincode ${pincode} not found.` });
  }

  const { report } = result;

  // Prevent duplicate saves
  const existing = await SavedReport.findOne({ userId: req.user._id, pincode });
  if (existing) {
    return res.status(409).json({ error: 'You have already saved a report for this pincode.' });
  }

  const saved = await SavedReport.create({
    userId : req.user._id,
    pincode,
    snapshot: {
      scores      : report.scores,
      overallScore: report.overallScore,
      district    : report.district,
      state       : report.state,
      lat         : report.lat,
      lon         : report.lon,
    },
  });

  return res.status(201).json({ savedReport: saved });
};

// ─── GET /api/report/saved ────────────────────────────────────
const getSavedReports = async (req, res) => {
  const reports = await SavedReport
    .find({ userId: req.user._id })
    .sort({ savedAt: -1 });

  return res.json({ savedReports: reports });
};

// ─── DELETE /api/report/saved/:id ────────────────────────────
const deleteSavedReport = async (req, res) => {
  const report = await SavedReport.findOne({ _id: req.params.id, userId: req.user._id });
  if (!report) {
    return res.status(404).json({ error: 'Saved report not found or does not belong to you.' });
  }
  await report.deleteOne();
  return res.json({ message: 'Saved report deleted.' });
};

// ─── POST /api/report/compare ────────────────────────────────
const compareReports = async (req, res) => {
  const { pincodes } = req.body;

  const results = await Promise.allSettled(
    pincodes.map(p =>
      isValidPincode(p)
        ? getOrComputeReport(p)
        : Promise.reject(new Error('Invalid pincode'))
    )
  );

  const reports = results.map((r, i) => {
    if (r.status === 'fulfilled' && r.value) {
      return { pincode: pincodes[i], ...r.value.report.toObject() };
    }
    return { pincode: pincodes[i], error: r.reason?.message || 'Not found' };
  });

  return res.json({ reports });
};

module.exports = { getReport, saveReport, getSavedReports, deleteSavedReport, compareReports };
