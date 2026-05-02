'use strict';
/**
 * services/crimeService.js
 * Looks up district crime rates from a pre-loaded JSON file (NCRB-style data).
 * Score = max(0, 100 - crimeRate/1000)
 */

const path   = require('path');
const { getLabel } = require('../utils/helpers');

// Load once at module init – stays in memory
const CRIME_DATA = require(path.join(__dirname, '..', 'utils', 'district_crime.json'));

/**
 * @param {string} district – district name from Pincode doc
 * @returns {{ value: number, label: string, unit: string, source: string }}
 */
const compute = (_lat, _lon, pincodeDoc) => {
  const district = (pincodeDoc?.district || '').toLowerCase().trim();
  const entry    = CRIME_DATA.find(d => d.district.toLowerCase() === district);

  // crimeRate = crimes per 100,000 population
  // National average is roughly 400-600. 
  // We use a logarithmic scale to penalize high crime rates more fairly.
  const crimeRate = entry?.crimeRate ?? 500; 
  
  // Score = 100 - (crimeRate / 20) with caps
  let value = 100 - (crimeRate / 20);
  value = Math.max(5, Math.min(98, value));

  return {
    value   : Math.round(value),
    label   : getLabel(value),
    unit    : 'score',
    source  : entry ? 'NCRB District Crime Records' : 'Estimated from regional averages',
  };
};

module.exports = { compute };
