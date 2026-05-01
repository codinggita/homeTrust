'use strict';
/**
 * controllers/brokerController.js
 * Broker dashboard: stats, own listings, KYC document uploads,
 * and verification badge progression logic.
 */

const Listing          = require('../models/Listing');
const BrokerStat       = require('../models/BrokerStat');
const User             = require('../models/User');
const { uploadBuffer } = require('../config/cloudinary');
const { trustScoreFromLevel } = require('../utils/helpers');
const logger           = require('../config/logger');

// ─── Badge upgrade logic ──────────────────────────────────────
/**
 * Determine the highest badge the broker qualifies for based on
 * uploaded document types.
 * Rules:
 *   - kyc              → bronze
 *   - kyc + ownership  → silver
 *   - + live_photo     → gold
 *   - + video          → platinum
 * @param {Array} docs – verificationDocuments array
 * @returns {string} badge level
 */
const computeBadge = (docs) => {
  const types = new Set(docs.map(d => d.type));
  if (types.has('video') && types.has('live_photo') && types.has('ownership') && types.has('kyc')) return 'platinum';
  if (types.has('live_photo') && types.has('ownership') && types.has('kyc')) return 'gold';
  if (types.has('ownership') && types.has('kyc')) return 'silver';
  if (types.has('kyc')) return 'bronze';
  return 'none';
};

// ─── GET /api/broker/stats ────────────────────────────────────
const getBrokerStats = async (req, res) => {
  // Aggregate from source if denormalised doc doesn't exist
  let stat = await BrokerStat.findOne({ brokerId: req.user._id });

  if (!stat) {
    const [totalListings, activeListings, viewsAgg, contactsAgg] = await Promise.all([
      Listing.countDocuments({ brokerId: req.user._id }),
      Listing.countDocuments({ brokerId: req.user._id, status: 'active' }),
      Listing.aggregate([
        { $match: { brokerId: req.user._id } },
        { $group: { _id: null, total: { $sum: '$views' } } },
      ]),
      Listing.aggregate([
        { $match: { brokerId: req.user._id } },
        { $group: { _id: null, total: { $sum: '$contacts' } } },
      ]),
    ]);

    stat = await BrokerStat.findOneAndUpdate(
      { brokerId: req.user._id },
      {
        totalListings,
        activeListings,
        totalViews   : viewsAgg[0]?.total || 0,
        totalContacts: contactsAgg[0]?.total || 0,
        updatedAt    : new Date(),
      },
      { upsert: true, new: true }
    );
  }

  return res.json({ stats: stat });
};

// ─── GET /api/broker/listings ─────────────────────────────────
const getBrokerListings = async (req, res) => {
  const { status, page = 1, limit = 20 } = req.query;

  const filter = { brokerId: req.user._id };
  if (status) filter.status = status;

  const pageNum  = Math.max(1, parseInt(page, 10));
  const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10)));

  const [listings, total] = await Promise.all([
    Listing.find(filter).sort({ createdAt: -1 }).skip((pageNum - 1) * pageSize).limit(pageSize),
    Listing.countDocuments(filter),
  ]);

  return res.json({ listings, total, page: pageNum, totalPages: Math.ceil(total / pageSize) });
};

// ─── POST /api/broker/verify-document ────────────────────────
const uploadVerificationDocument = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const allowedTypes = ['kyc', 'ownership', 'live_photo', 'video'];
  const docType      = req.body.type;

  if (!allowedTypes.includes(docType)) {
    return res.status(400).json({ error: `Invalid document type. Allowed: ${allowedTypes.join(', ')}` });
  }

  // Upload to Cloudinary
  const folder = 'hometrust/broker_docs';
  let uploadResult;
  try {
    uploadResult = await uploadBuffer(req.file.buffer, folder);
  } catch (err) {
    logger.error(`Cloudinary upload failed for broker ${req.user._id}: ${err.message}`);
    return res.status(502).json({ error: 'File upload to cloud storage failed. Please try again.' });
  }

  const broker = await User.findById(req.user._id);
  const docs   = broker.brokerDetails?.verificationDocuments || [];

  // Remove existing doc of same type (replace)
  const filtered = docs.filter(d => d.type !== docType);
  filtered.push({ type: docType, url: uploadResult.secure_url, publicId: uploadResult.public_id });

  // Compute new badge
  const newBadge = computeBadge(filtered);

  broker.brokerDetails.verificationDocuments = filtered;
  broker.brokerDetails.badgeLevel            = newBadge;
  await broker.save();

  logger.info(`Broker ${req.user.email} uploaded ${docType}. New badge: ${newBadge}`);

  return res.json({
    message             : `Document (${docType}) uploaded successfully.`,
    documentUrl         : uploadResult.secure_url,
    badgeLevel          : newBadge,
    verificationDocuments: broker.brokerDetails.verificationDocuments,
  });
};

module.exports = { getBrokerStats, getBrokerListings, uploadVerificationDocument };
