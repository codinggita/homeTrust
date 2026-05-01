'use strict';
/**
 * services/floodRiskService.js
 * Uses Open-Elevation API for elevation + Overpass for nearby waterways.
 * High elevation + no river nearby = low risk = high score.
 */

const axios  = require('axios');
const { getLabel, overpassQuery } = require('../utils/helpers');

/**
 * @param {number} lat
 * @param {number} lon
 * @returns {{ value: number, label: string, unit: string, source: string }}
 */
const compute = async (lat, lon) => {
  // Step 1: Get elevation from Open-Elevation (free, no key)
  let elevation = 50; // safe default
  try {
    const elevRes = await axios.get(
      `https://api.open-elevation.com/api/v1/lookup?locations=${lat},${lon}`,
      { timeout: 10000 }
    );
    elevation = elevRes.data?.results?.[0]?.elevation ?? 50;
  } catch (_) {
    // fallback – assume moderate elevation
  }

  // Very low elevation → high flood risk regardless
  if (elevation < 5) {
    return { value: 20, label: getLabel(20), unit: 'meters', source: 'Open-Elevation + Overpass' };
  }

  // Step 2: Check for rivers within 500m
  const query = `[out:json][timeout:15];way["waterway"="river"](around:500,${lat},${lon});out count;`;
  let riverNearby = false;
  try {
    const data  = await overpassQuery(query);
    const count = data?.elements?.[0]?.tags?.total ?? 0;
    riverNearby = count > 0;
  } catch (_) { /* fallback */ }

  const value = riverNearby ? 50 : 80;
  return {
    value,
    label : getLabel(value),
    unit  : 'meters',
    source: 'Open-Elevation + OpenStreetMap Overpass',
  };
};

module.exports = { compute };
