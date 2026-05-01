'use strict';
/**
 * services/metroService.js
 * Finds nearest subway/metro station via Overpass.
 * Closer = better score.
 */

const { getLabel, overpassQuery, haversineKm } = require('../utils/helpers');

/**
 * @param {number} lat
 * @param {number} lon
 * @returns {{ value: number, label: string, unit: string, source: string }}
 */
const compute = async (lat, lon) => {
  const query = `
[out:json][timeout:20];
(
  node["railway"="subway_entrance"](around:20000,${lat},${lon});
  node["railway"="station"]["station"="subway"](around:20000,${lat},${lon});
  node["railway"="station"]["network"~"metro|Metro|METRO",i](around:20000,${lat},${lon});
);
out center 5;`;

  const data     = await overpassQuery(query);
  const elements = data?.elements ?? [];

  if (elements.length === 0) {
    return { value: 0, label: 'Poor', unit: 'km', source: 'OpenStreetMap Overpass' };
  }

  const distances = elements.map(el =>
    haversineKm(lat, lon, el.lat ?? el.center?.lat ?? lat, el.lon ?? el.center?.lon ?? lon)
  );
  const minDist = Math.min(...distances);
  const value   = Math.max(0, Math.round(100 - minDist * 20));

  return {
    value,
    label : getLabel(value),
    unit  : 'km',
    source: 'OpenStreetMap Overpass',
  };
};

module.exports = { compute };
