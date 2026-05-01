'use strict';
/**
 * services/scoringOrchestrator.js
 * Runs all 11 metric services in parallel, handles failures gracefully,
 * and computes a weighted overall score.
 */

const logger = require('../config/logger');

const aqiService            = require('./aqiService');
const walkabilityService    = require('./walkabilityService');
const floodRiskService      = require('./floodRiskService');
const crimeService          = require('./crimeService');
const noiseService          = require('./noiseService');
const metroService          = require('./metroService');
const schoolRatingService   = require('./schoolRatingService');
const hospitalAccessService = require('./hospitalAccessService');
const greenCoverService     = require('./greenCoverService');
const internetSpeedService  = require('./internetSpeedService');
const powerReliabilityService = require('./powerReliabilityService');

// ─── Weights (must sum to 1.0) ────────────────────────────────────
// AQI 25%, Walkability 20%, Flood 15%, Safety 20%, rest equally share 20%
const WEIGHTS = {
  aqi            : 0.25,
  walkability    : 0.20,
  floodRisk      : 0.15,
  safety         : 0.20,
  noise          : 0.20 / 7,
  metroProximity : 0.20 / 7,
  schoolRating   : 0.20 / 7,
  hospitalAccess : 0.20 / 7,
  greenCover     : 0.20 / 7,
  internetSpeed  : 0.20 / 7,
  powerReliability: 0.20 / 7,
};

const FALLBACK = { value: 50, label: 'Moderate', unit: '', error: true };

/**
 * Compute grade from overall score.
 * @param {number} score
 * @returns {string}
 */
const toGrade = (score) => {
  if (score >= 90) return 'A+';
  if (score >= 80) return 'A';
  if (score >= 70) return 'B';
  if (score >= 60) return 'C';
  if (score >= 40) return 'D';
  return 'F';
};

/**
 * Run all scoring services for a given pincode document.
 * @param {object} pincodeDoc – Mongoose Pincode document (has lat, lon, district, etc.)
 * @returns {Promise<{ scores: object, overallScore: number, grade: string }>}
 */
const compute = async (pincodeDoc) => {
  const { lat, lon } = pincodeDoc;

  // Run all services concurrently
  const [
    aqiResult,
    walkResult,
    floodResult,
    crimeResult,
    noiseResult,
    metroResult,
    schoolResult,
    hospitalResult,
    greenResult,
    internetResult,
    powerResult,
  ] = await Promise.allSettled([
    aqiService.compute(lat, lon, pincodeDoc),
    walkabilityService.compute(lat, lon, pincodeDoc),
    floodRiskService.compute(lat, lon, pincodeDoc),
    crimeService.compute(lat, lon, pincodeDoc),
    noiseService.compute(lat, lon, pincodeDoc),
    metroService.compute(lat, lon, pincodeDoc),
    schoolRatingService.compute(lat, lon, pincodeDoc),
    hospitalAccessService.compute(lat, lon, pincodeDoc),
    greenCoverService.compute(lat, lon, pincodeDoc),
    internetSpeedService.compute(lat, lon, pincodeDoc),
    powerReliabilityService.compute(lat, lon, pincodeDoc),
  ]);

  // Helper to extract value or use fallback
  const extract = (result, name) => {
    if (result.status === 'fulfilled') return result.value;
    logger.error(`Scoring service [${name}] failed for pincode ${pincodeDoc.pincode}: ${result.reason?.message}`);
    return { ...FALLBACK };
  };

  const scores = {
    aqi            : extract(aqiResult,       'aqi'),
    walkability    : extract(walkResult,      'walkability'),
    floodRisk      : extract(floodResult,     'floodRisk'),
    safety         : extract(crimeResult,     'safety'),
    noise          : extract(noiseResult,     'noise'),
    metroProximity : extract(metroResult,     'metroProximity'),
    schoolRating   : extract(schoolResult,    'schoolRating'),
    hospitalAccess : extract(hospitalResult,  'hospitalAccess'),
    greenCover     : extract(greenResult,     'greenCover'),
    internetSpeed  : extract(internetResult,  'internetSpeed'),
    powerReliability: extract(powerResult,   'powerReliability'),
  };

  // Weighted overall score
  let overallScore = 0;
  for (const [key, weight] of Object.entries(WEIGHTS)) {
    overallScore += (scores[key]?.value ?? 50) * weight;
  }
  overallScore = Math.round(overallScore);

  return {
    scores,
    overallScore,
    grade: toGrade(overallScore),
  };
};

module.exports = { compute };
