'use strict';
/**
 * services/internetSpeedService.js
 * Tiered fallback logic based on city type derived from pincode data.
 * No external API – uses known metro/tier-2 city lookup.
 */

const { getLabel } = require('../utils/helpers');

// ─── City tier lookup maps ────────────────────────────────────
const METRO_CITIES = new Set([
  'mumbai', 'delhi', 'new delhi', 'bangalore', 'bengaluru',
  'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad',
]);

const TIER2_CITIES = new Set([
  'surat', 'lucknow', 'jaipur', 'kanpur', 'nagpur', 'indore',
  'thane', 'bhopal', 'visakhapatnam', 'pimpri', 'patna',
  'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik', 'meerut',
  'rajkot', 'kalyan', 'vasai', 'varanasi', 'srinagar', 'aurangabad',
  'dhanbad', 'amritsar', 'navi mumbai', 'allahabad', 'ranchi',
  'howrah', 'coimbatore', 'jabalpur', 'gwalior', 'vijayawada',
  'jodhpur', 'madurai', 'raipur', 'kota', 'chandigarh',
]);

/**
 * Determine city tier from pincode document.
 * Checks district, officeName, divisionName etc.
 */
const getCityTier = (pincodeDoc) => {
  const fields = [
    pincodeDoc?.district,
    pincodeDoc?.divisionName,
    pincodeDoc?.regionName,
    pincodeDoc?.officeName,
  ].map(f => (f || '').toLowerCase().trim());

  for (const f of fields) {
    if (METRO_CITIES.has(f)) return 'metro';
    if (TIER2_CITIES.has(f)) return 'tier2';
  }
  return 'rural';
};

const TIER_CONFIG = {
  metro : { speedMbps: 100, score: 90 },
  tier2 : { speedMbps: 50,  score: 70 },
  rural : { speedMbps: 10,  score: 40 },
};

/**
 * @param {number} lat
 * @param {number} lon
 * @param {object} pincodeDoc
 * @returns {{ value: number, label: string, unit: string, source: string }}
 */
const compute = (_lat, _lon, pincodeDoc) => {
  const tier   = getCityTier(pincodeDoc);
  const config = TIER_CONFIG[tier];
  return {
    value : config.score,
    label : getLabel(config.score),
    unit  : `${config.speedMbps} Mbps`,
    source: `Tiered estimate (${tier} city class)`,
  };
};

module.exports = { compute, getCityTier };
