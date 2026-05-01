'use strict';
/**
 * services/walkabilityService.js
 * Uses Overpass API (public, no key) to count nearby amenities within 1km.
 */

const axios  = require('axios');
const { getLabel, overpassQuery } = require('../utils/helpers');

/**
 * @param {number} lat
 * @param {number} lon
 * @returns {{ value: number, label: string, unit: string, source: string }}
 */
const compute = async (lat, lon) => {
  // Overpass QL: find amenities within 1000m radius
  const amenityTypes = ['grocery', 'pharmacy', 'cafe', 'bank', 'school', 'park'];
  const conditions   = amenityTypes.map(a => `node["amenity"="${a}"](around:1000,${lat},${lon});`).join('');
  const query = `[out:json][timeout:15];(${conditions});out count;`;

  const data  = await overpassQuery(query);
  const count = data?.elements?.[0]?.tags?.total ?? 0;

  const value = Math.min(100, count * 12);
  return {
    value,
    label : getLabel(value),
    unit  : '/100',
    source: 'OpenStreetMap Overpass API',
  };
};

module.exports = { compute };
