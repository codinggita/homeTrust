'use strict';
/**
 * models/User.js – HomeTrust user schema
 * Roles: buyer | broker | admin
 */

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const verificationDocumentSchema = new mongoose.Schema({
  type       : { type: String, enum: ['kyc', 'ownership', 'live_photo', 'video'], required: true },
  url        : { type: String, required: true },
  publicId   : { type: String }, // Cloudinary public_id for deletion
  verifiedAt : { type: Date, default: Date.now },
}, { _id: false });

const userSchema = new mongoose.Schema({
  email    : { type: String, required: true, unique: true, lowercase: true, trim: true },
  password : { type: String, required: true, select: false }, // excluded by default

  role : {
    type    : String,
    enum    : ['buyer', 'broker', 'admin'],
    default : 'buyer',
    required: true,
  },

  profile: {
    fullName : { type: String, trim: true },
    phone    : { type: String, trim: true },
    avatar   : { type: String },
  },

  // Only used when role === 'broker'
  brokerDetails: {
    companyName           : { type: String, trim: true },
    gst                   : { type: String, trim: true },
    strikes               : { type: Number, default: 0, min: 0 },
    isSuspended           : { type: Boolean, default: false },
    verificationDocuments : { type: [verificationDocumentSchema], default: [] },
    // Computed badge level based on uploaded documents
    badgeLevel            : {
      type    : String,
      enum    : ['none', 'bronze', 'silver', 'gold', 'platinum'],
      default : 'none',
    },
  },
}, {
  timestamps: true,
  toJSON: {
    transform(_doc, ret) {
      delete ret.password;
      return ret;
    },
  },
});

// ── Indexes ─────────────────────────────────────────────────
// Note: email index is already created by unique:true on the field.
userSchema.index({ role: 1 });

// ── Pre-save: hash password ──────────────────────────────────
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ── Instance method: compare password ───────────────────────
userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
