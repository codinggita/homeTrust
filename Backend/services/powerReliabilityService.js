'use strict';
/**
 * services/powerReliabilityService.js
 * Tiered fallback logic – similar to internetSpeedService.
 * Metro grids are most reliable, rural feeders least.
 */

const { getLabel }    = require('../utils/helpers');
const { getCityTier } = require('./internetSpeedService');

const TIER_CONFIG = {
  metro : { hours: 23.5, score: 85 },
  tier2 : { hours: 22,   score: 65 },
  rural : { hours: 18,   score: 45 },
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
    unit  : `${config.hours}h/day`,
    source: `Tiered estimate (${tier} city class)`,
  };
};

module.exports = { compute };
