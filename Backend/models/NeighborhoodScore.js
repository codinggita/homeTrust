'use strict';
/**
 * models/NeighborhoodScore.js
 * Cached pincode quality report (TTL = 24h)
 */

const mongoose = require('mongoose');

const metricSchema = new mongoose.Schema({
  value  : { type: Number, required: true },
  label  : { type: String, required: true }, // Excellent / Good / Moderate / Poor
  unit   : { type: String, default: '' },
  source : { type: String, default: '' },
  error  : { type: Boolean, default: false }, // true if API failed → fallback used
}, { _id: false });

const neighborhoodScoreSchema = new mongoose.Schema({
  pincode  : { type: String, required: true, index: true },
  lat      : { type: Number, default: null },
  lon      : { type: Number, default: null },
  district : { type: String, default: '' },
  state    : { type: String, default: '' },

  scores: {
    aqi            : metricSchema,
    walkability    : metricSchema,
    floodRisk      : metricSchema,
    safety         : metricSchema,
    noise          : metricSchema,
    metroProximity : metricSchema,
    schoolRating   : metricSchema,
    hospitalAccess : metricSchema,
    greenCover     : metricSchema,
    internetSpeed  : metricSchema,
    powerReliability: metricSchema,
  },

  overallScore : { type: Number, required: true, min: 0, max: 100 },
  grade        : { type: String }, // A+ / A / B / C / D computed from overall

  createdAt : { type: Date, default: Date.now },
  expiresAt : { type: Date, required: true, index: { expireAfterSeconds: 0 } },
}, { timestamps: false });

// Compound unique index – one cached doc per pincode
neighborhoodScoreSchema.index({ pincode: 1, createdAt: -1 });

module.exports = mongoose.model('NeighborhoodScore', neighborhoodScoreSchema);
