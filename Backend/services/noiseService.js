'use strict';
/**
 * services/noiseService.js
 * Finds nearest motorway, railway, or aerodrome via Overpass.
 * Closer = more noise = lower score.
 */

const { getLabel, overpassQuery, haversineKm } = require('../utils/helpers');

/**
 * @param {number} lat
 * @param {number} lon
 * @returns {{ value: number, label: string, unit: string, source: string }}
 */
const compute = async (lat, lon) => {
  // Search within 10km for major noise sources
  const query = `
[out:json][timeout:20];
(
  way["highway"="motorway"](around:10000,${lat},${lon});
  way["railway"="rail"](around:10000,${lat},${lon});
  node["aeroway"="aerodrome"](around:30000,${lat},${lon});
);
out center 5;`;

  const data    = await overpassQuery(query);
  const elements = data?.elements ?? [];

  if (elements.length === 0) {
    // No noise sources found → excellent
    return { value: 90, label: getLabel(90), unit: '/100', source: 'OpenStreetMap Overpass' };
  }

  // Find nearest element using centre or first node
  const distances = elements.map(el => {
    const elLat = el.center?.lat ?? el.lat ?? lat;
    const elLon = el.center?.lon ?? el.lon ?? lon;
    return haversineKm(lat, lon, elLat, elLon);
  });

  const minDist = Math.min(...distances);
  const value   = Math.max(0, Math.round(100 - minDist * 5));
  return {
    value,
    label : getLabel(value),
    unit  : '/100',
    source: 'OpenStreetMap Overpass',
  };
};

module.exports = { compute };
