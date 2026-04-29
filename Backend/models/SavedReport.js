'use strict';
/**
 * models/SavedReport.js – buyer's bookmarked neighbourhood reports
 */

const mongoose = require('mongoose');

const savedReportSchema = new mongoose.Schema({
  userId  : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  pincode : { type: String, required: true },

  // Snapshot of scores at save time (denormalised for permanence)
  snapshot: {
    scores      : { type: mongoose.Schema.Types.Mixed, required: true },
    overallScore: { type: Number, required: true },
    district    : { type: String },
    state       : { type: String },
    lat         : { type: Number },
    lon         : { type: Number },
  },

  savedAt : { type: Date, default: Date.now },
}, {
  timestamps: false,
});

savedReportSchema.index({ userId: 1, pincode: 1 });

module.exports = mongoose.model('SavedReport', savedReportSchema);
