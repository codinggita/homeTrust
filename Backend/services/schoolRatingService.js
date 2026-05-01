'use strict';
/**
 * services/schoolRatingService.js
 * Counts schools and kindergartens within 2km via Overpass.
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
  node["amenity"="school"](around:2000,${lat},${lon});
  node["amenity"="kindergarten"](around:2000,${lat},${lon});
  way["amenity"="school"](around:2000,${lat},${lon});
);
out count;`;

  const data  = await overpassQuery(query);
  const count = data?.elements?.[0]?.tags?.total ?? 0;

  const value = Math.min(100, count * 10);
  return {
    value,
    label : getLabel(value),
    unit  : '/10',
    source: 'OpenStreetMap Overpass',
  };
};

module.exports = { compute };
