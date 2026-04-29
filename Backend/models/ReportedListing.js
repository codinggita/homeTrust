'use strict';
/**
 * models/ReportedListing.js – buyer-reported fake/fraudulent listings
 */

const mongoose = require('mongoose');

const reportedListingSchema = new mongoose.Schema({
  listingId  : { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true, index: true },
  reporterId : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reason     : {
    type    : String,
    enum    : ['fake_photos', 'wrong_location', 'price_fraud', 'broker_scam', 'already_rented', 'other'],
    required: true,
  },
  description: { type: String, trim: true, maxlength: 1000 },
  status     : {
    type   : String,
    enum   : ['pending', 'resolved', 'dismissed'],
    default: 'pending',
    index  : true,
  },
  adminNote  : { type: String, trim: true },
  resolvedAt : { type: Date },
  resolvedBy : { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
  timestamps: true,
});

// Prevent duplicate reports from the same user for the same listing
reportedListingSchema.index({ listingId: 1, reporterId: 1 }, { unique: true });

module.exports = mongoose.model('ReportedListing', reportedListingSchema);
