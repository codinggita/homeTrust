'use strict';
/**
 * services/aqiService.js
 * Fetches AQI from OpenWeatherMap Air Pollution API.
 * Free key: https://openweathermap.org/api → Air Pollution
 * AQI 1=Good, 2=Fair, 3=Moderate, 4=Poor, 5=Very Poor
 */

const axios  = require('axios');
const logger = require('../config/logger');
const { getLabel } = require('../utils/helpers');

const AQI_SCORE_MAP = { 
  1: 95, // Good
  2: 75, // Fair
  3: 55, // Moderate
  4: 35, // Poor
  5: 15  // Very Poor
};

/**
 * @param {number} lat
 * @param {number} lon
 * @returns {{ value: number, label: string, unit: string, source: string }}
 */
const compute = async (lat, lon) => {
  const apiKey = process.env.OPENWEATHER_API_KEY;
  if (!apiKey) {
    logger.warn('OPENWEATHER_API_KEY not set, using moderate fallback for AQI');
    return { value: 50, label: 'Moderate', unit: '/100', source: 'Fallback (No API Key)' };
  }

  try {
    const url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;
    const response = await axios.get(url, { timeout: 8000 });

    const aqi = response.data?.list?.[0]?.main?.aqi;
    if (!aqi || aqi < 1 || aqi > 5) {
      throw new Error(`Unexpected AQI value from API: ${aqi}`);
    }

    const value = AQI_SCORE_MAP[aqi];
    return {
      value,
      label : getLabel(value),
      unit  : `AQI ${aqi}`,
      source: 'OpenWeatherMap Air Pollution API',
    };
  } catch (err) {
    logger.error(`AQI API fetch failed: ${err.message}`);
    return { value: 50, label: 'Moderate', unit: '/100', source: 'Fallback (API Error)', error: true };
  }
};

module.exports = { compute };
