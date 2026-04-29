'use strict';
/**
 * models/Pincode.js – read-only collection already seeded in Atlas
 * Field names match the actual Atlas collection exactly.
 */

const mongoose = require('mongoose');

const pincodeSchema = new mongoose.Schema({
  pincode        : { type: String, required: true, unique: true, index: true },
  officeName     : { type: String },
  officeType     : { type: String },    // S.O / B.O / H.O
  deliveryStatus : { type: String },    // Delivery / Non-Delivery
  divisionName   : { type: String },
  regionName     : { type: String },
  circleName     : { type: String },
  taluk          : { type: String },
  district       : { type: String },
  state          : { type: String },    // actual field name in Atlas
  // lat / lon may be absent – treat as optional
  lat            : { type: Number, default: null },
  lon            : { type: Number, default: null },
}, {
  collection: 'pincodes', // must match the existing Atlas collection name
  timestamps: false,
});

module.exports = mongoose.model('Pincode', pincodeSchema);
