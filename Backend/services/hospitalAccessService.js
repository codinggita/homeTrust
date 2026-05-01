'use strict';
/**
 * services/hospitalAccessService.js
 * Counts hospitals and clinics within 5km via Overpass.
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
  node["amenity"="hospital"](around:5000,${lat},${lon});
  node["amenity"="clinic"](around:5000,${lat},${lon});
  way["amenity"="hospital"](around:5000,${lat},${lon});
);
out count;`;

  const data  = await overpassQuery(query);
  const count = data?.elements?.[0]?.tags?.total ?? 0;

  const value = Math.min(100, count * 15);
  return {
    value,
    label : getLabel(value),
    unit  : '/100',
    source: 'OpenStreetMap Overpass',
  };
};

module.exports = { compute };
