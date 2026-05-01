'use strict';
/**
 * utils/helpers.js
 * Shared utility functions: label mapping, Haversine distance,
 * and Overpass API wrapper.
 */

const axios = require('axios');

// ─── Label Mapper ────────────────────────────────────────────────────────────
/**
 * Map a numeric score (0-100) to a qualitative label.
 * @param {number} value
 * @returns {string}
 */
const getLabel = (value) => {
  if (value >= 80) return 'Excellent';
  if (value >= 60) return 'Good';
  if (value >= 40) return 'Moderate';
  return 'Poor';
};

// ─── Haversine Distance ──────────────────────────────────────────────────────
/**
 * Great-circle distance between two lat/lon points in kilometres.
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} distance in km
 */
const haversineKm = (lat1, lon1, lat2, lon2) => {
  const R    = 6371; // Earth radius km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a    =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const toRad = (deg) => (deg * Math.PI) / 180;

// ─── Overpass API Wrapper ─────────────────────────────────────────────────────
const OVERPASS_ENDPOINTS = [
  'https://overpass-api.de/api/interpreter',
  'https://overpass.kumi.systems/api/interpreter',
];

let endpointIndex = 0;

/**
 * Execute an Overpass QL query and return parsed JSON.
 * Automatically rotates endpoints on failure.
 * @param {string} query – Overpass QL string
 * @returns {Promise<object>}
 */
const overpassQuery = async (query) => {
  const endpoint = OVERPASS_ENDPOINTS[endpointIndex % OVERPASS_ENDPOINTS.length];

  try {
    const response = await axios.post(
      endpoint,
      `data=${encodeURIComponent(query)}`,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          // Overpass API requires a valid User-Agent – without it, returns 406
          'User-Agent'  : 'HomeTrust/1.0 (real-estate-platform; contact@hometrust.in)',
          'Accept'      : 'application/json',
        },
        timeout: 20000,
      }
    );
    return response.data;
  } catch (err) {
    // Rotate to next endpoint on failure
    endpointIndex = (endpointIndex + 1) % OVERPASS_ENDPOINTS.length;
    throw new Error(`Overpass query failed [${endpoint}]: ${err.message}`);
  }
};

// ─── Trust Score Calculator ──────────────────────────────────────────────────
/**
 * Map verification level to base trust score.
 * @param {string} level
 * @returns {number}
 */
const trustScoreFromLevel = (level) => {
  const map = { bronze: 50, silver: 70, gold: 85, platinum: 95 };
  return map[level] ?? 50;
};

// ─── Pincode Validator ───────────────────────────────────────────────────────
/**
 * Returns true if the string is a valid 6-digit Indian pincode.
 * @param {string} pin
 * @returns {boolean}
 */
const isValidPincode = (pin) => /^\d{6}$/.test(String(pin));

module.exports = { getLabel, haversineKm, overpassQuery, trustScoreFromLevel, isValidPincode };
