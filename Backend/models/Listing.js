'use strict';
/**
 * models/Listing.js – Property listing schema
 */

const mongoose = require('mongoose');

const listingSchema = new mongoose.Schema({
  brokerId : { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },

  address: {
    full   : { type: String, required: true, trim: true },
    pincode: { type: String, required: true, index: true },
    lat    : { type: Number },
    lon    : { type: Number },
  },

  price       : { type: Number, required: true, min: 0 },           // monthly rent in INR
  bhk         : { type: Number, required: true, min: 1, max: 10 },
  area        : { type: Number, required: true, min: 1 },           // sq ft
  furnishing  : { type: String, enum: ['unfurnished', 'semi-furnished', 'fully-furnished'], default: 'unfurnished' },
  availability: { type: Date },
  amenities   : { type: [String], default: [] },

  verificationLevel: {
    type   : String,
    enum   : ['bronze', 'silver', 'gold', 'platinum'],
    default: 'bronze',
  },

  trustScore : { type: Number, default: 0, min: 0, max: 100 },

  photos   : { type: [String], default: [] },  // Cloudinary secure URLs
  videoUrl : { type: String, default: '' },

  status: {
    type   : String,
    enum   : ['pending', 'active', 'flagged', 'removed'],
    default: 'pending',
    index  : true,
  },

  views    : { type: Number, default: 0 },
  contacts : { type: Number, default: 0 },

  // For geo-tagged live photos (GeoJSON point stored as separate field)
  geoTag: {
    type        : { type: String, enum: ['Point'], default: 'Point' },
    coordinates : { type: [Number], default: [0, 0] }, // [lon, lat]
  },
}, {
  timestamps: true,
});

// Geo index for map-based queries
listingSchema.index({ 'geoTag': '2dsphere' });
listingSchema.index({ status: 1, verificationLevel: 1, trustScore: -1 });
listingSchema.index({ price: 1 });

module.exports = mongoose.model('Listing', listingSchema);
