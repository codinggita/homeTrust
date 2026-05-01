'use strict';
/**
 * services/greenCoverService.js
 * Counts green spaces (parks, forests, grass) within 1km via Overpass.
 */

const { getLabel, overpassQuery } = require('../utils/helpers');

/**
 * @param {number} lat
 * @param {number} lon
 * @returns {{ value: number, label: string, unit: string, source: string }}
 */
const compute = async (lat, lon) => {
  const query = `
[out:json][timeout:15];
(
  way["landuse"="grass"](around:1000,${lat},${lon});
  way["landuse"="forest"](around:1000,${lat},${lon});
  way["leisure"="park"](around:1000,${lat},${lon});
  node["leisure"="park"](around:1000,${lat},${lon});
);
out count;`;

  const data  = await overpassQuery(query);
  const count = data?.elements?.[0]?.tags?.total ?? 0;

  const value = Math.min(100, count * 5);
  return {
    value,
    label : getLabel(value),
    unit  : '/100',
    source: 'OpenStreetMap Overpass',
  };
};

module.exports = { compute };
