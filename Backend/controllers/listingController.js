'use strict';
/**
 * controllers/listingController.js
 * Property listing CRUD, reporting, and visit management.
 */

const { v4: uuidv4 }      = require('uuid');
const Listing             = require('../models/Listing');
const ReportedListing     = require('../models/ReportedListing');
const BrokerStat          = require('../models/BrokerStat');
const User                = require('../models/User');
const { uploadBuffer }    = require('../config/cloudinary');
const { trustScoreFromLevel } = require('../utils/helpers');
const logger              = require('../config/logger');

// ─── Helper: upsert BrokerStat ───────────────────────────────
const incrementStat = async (brokerId, field, amount = 1) => {
  await BrokerStat.findOneAndUpdate(
    { brokerId },
    { $inc: { [field]: amount }, updatedAt: new Date() },
    { upsert: true, new: true }
  );
};

// ─── GET /api/listings ───────────────────────────────────────
const getListings = async (req, res) => {
  const {
    minPrice, maxPrice,
    bhk, verificationLevel,
    minTrustScore, trustedOnly,
    sortBy = 'newest',
    page = 1, limit = 20,
  } = req.query;

  const filter = { status: 'active' };

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  if (bhk) {
    const bhkValues = String(bhk).split(',').map(Number).filter(Boolean);
    filter.bhk = { $in: bhkValues };
  }

  if (verificationLevel) filter.verificationLevel = verificationLevel;

  if (minTrustScore) filter.trustScore = { $gte: Number(minTrustScore) };

  if (trustedOnly === 'true') filter.trustScore = { $gte: 70 };

  const SORT_MAP = {
    reliability: { trustScore: -1 },
    priceLow   : { price: 1 },
    priceHigh  : { price: -1 },
    newest     : { createdAt: -1 },
  };
  const sort = SORT_MAP[sortBy] || SORT_MAP.newest;

  const pageNum  = Math.max(1, parseInt(page, 10));
  const pageSize = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const skip     = (pageNum - 1) * pageSize;

  const [listings, total] = await Promise.all([
    Listing.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(pageSize)
      .populate('brokerId', 'profile.fullName profile.phone brokerDetails.companyName brokerDetails.badgeLevel'),
    Listing.countDocuments(filter),
  ]);

  return res.json({
    listings,
    total,
    page      : pageNum,
    totalPages: Math.ceil(total / pageSize),
  });
};

// ─── GET /api/listings/:id ───────────────────────────────────
const getListingById = async (req, res) => {
  const listing = await Listing.findById(req.params.id)
    .populate('brokerId', '-password -brokerDetails.verificationDocuments');

  if (!listing || listing.status === 'removed') {
    return res.status(404).json({ error: 'Listing not found.' });
  }

  // Increment view counter (fire-and-forget)
  Listing.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }).exec();
  incrementStat(listing.brokerId._id, 'totalViews').catch(() => {});

  const brokerStat = await BrokerStat.findOne({ brokerId: listing.brokerId._id });

  return res.json({ listing, brokerStat });
};

// ─── POST /api/listings ──────────────────────────────────────
const createListing = async (req, res) => {
  const broker = await User.findById(req.user._id);

  // Broker must have at least KYC doc (bronze level)
  const docs     = broker.brokerDetails?.verificationDocuments || [];
  const hasKyc   = docs.some(d => d.type === 'kyc');
  if (!hasKyc) {
    return res.status(403).json({
      error: 'KYC verification required before posting listings. Please upload your KYC document first.',
    });
  }

  const { addressFull, pincode, lat, lon, price, bhk, area, furnishing, availability, amenities } = req.body;

  // Parse amenities (may arrive as JSON string from form-data)
  let parsedAmenities = [];
  if (amenities) {
    parsedAmenities = Array.isArray(amenities)
      ? amenities
      : JSON.parse(amenities);
  }

  // Upload photos to Cloudinary
  const photoUrls = [];
  if (req.files && req.files.length > 0) {
    const uploadPromises = req.files.map(f =>
      uploadBuffer(f.buffer, 'hometrust/listings')
    );
    const results = await Promise.allSettled(uploadPromises);
    results.forEach(r => {
      if (r.status === 'fulfilled') photoUrls.push(r.value.secure_url);
      else logger.warn(`Photo upload failed: ${r.reason?.message}`);
    });
  }

  const badgeLevel  = broker.brokerDetails?.badgeLevel || 'none';
  const verLevel    = ['silver', 'gold', 'platinum'].includes(badgeLevel) ? badgeLevel : 'bronze';
  const trustScore  = trustScoreFromLevel(verLevel);

  const listing = await Listing.create({
    brokerId: req.user._id,
    address : { full: addressFull, pincode, lat: lat || 0, lon: lon || 0 },
    price, bhk, area,
    furnishing   : furnishing || 'unfurnished',
    availability : availability ? new Date(availability) : undefined,
    amenities    : parsedAmenities,
    photos       : photoUrls,
    verificationLevel: verLevel,
    trustScore,
    status       : 'pending',
  });

  // Update broker stats
  await incrementStat(req.user._id, 'totalListings');

  return res.status(201).json({ listing });
};

// ─── PUT /api/listings/:id ───────────────────────────────────
const updateListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found.' });

  if (listing.brokerId.toString() !== req.user._id.toString()) {
    return res.status(403).json({ error: 'You do not own this listing.' });
  }

  if (listing.status === 'removed') {
    return res.status(400).json({ error: 'Cannot edit a removed listing.' });
  }

  const allowed = ['price', 'bhk', 'area', 'furnishing', 'availability', 'amenities'];
  allowed.forEach(f => { if (req.body[f] !== undefined) listing[f] = req.body[f]; });
  if (req.body.addressFull) listing.address.full = req.body.addressFull;

  // Editing resets to pending moderation
  listing.status = 'pending';
  await listing.save();

  return res.json({ listing });
};

// ─── DELETE /api/listings/:id ─────────────────────────────────
const deleteListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found.' });

  const isOwner = listing.brokerId.toString() === req.user._id.toString();
  const isAdmin = req.user.role === 'admin';

  if (!isOwner && !isAdmin) {
    return res.status(403).json({ error: 'Access denied.' });
  }

  listing.status = 'removed';
  await listing.save();

  // Update stats
  await BrokerStat.findOneAndUpdate(
    { brokerId: listing.brokerId },
    { $inc: { totalListings: -1, activeListings: -1 } }
  );

  return res.json({ message: 'Listing removed successfully.' });
};

// ─── POST /api/listings/:id/report ───────────────────────────
const reportListing = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing || listing.status === 'removed') {
    return res.status(404).json({ error: 'Listing not found.' });
  }

  const { reason, description } = req.body;

  // Duplicate check handled by unique index – will throw 11000 on collision
  const report = await ReportedListing.create({
    listingId : listing._id,
    reporterId: req.user._id,
    reason,
    description,
  });

  // Auto-flag listing if it has 3+ pending reports
  const pendingCount = await ReportedListing.countDocuments({ listingId: listing._id, status: 'pending' });
  if (pendingCount >= 3 && listing.status === 'active') {
    listing.status = 'flagged';
    await listing.save();
  }

  return res.status(201).json({ report });
};

// ─── POST /api/listings/:id/visit ────────────────────────────
const requestVisit = async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing || listing.status !== 'active') {
    return res.status(404).json({ error: 'Listing not available for visits.' });
  }

  // Increment contact counter
  Listing.findByIdAndUpdate(req.params.id, { $inc: { contacts: 1 } }).exec();
  incrementStat(listing.brokerId, 'totalContacts').catch(() => {});

  const visitToken = uuidv4();
  return res.json({
    visitToken,
    qrData    : `hometrust://visit/${listing._id}/${visitToken}`,
    message   : 'Present this QR code at the property for gate access.',
    listing   : { id: listing._id, address: listing.address, bhk: listing.bhk },
  });
};

// ─── POST /api/listings/:id/favorite ─────────────────────────
const toggleFavorite = async (req, res) => {
  const user = await User.findById(req.user._id);
  const listingId = req.params.id;

  const isFavorite = user.favorites.includes(listingId);

  if (isFavorite) {
    user.favorites = user.favorites.filter(id => id.toString() !== listingId);
  } else {
    user.favorites.push(listingId);
  }

  await user.save();
  return res.json({ 
    message: isFavorite ? 'Removed from favorites' : 'Added to favorites',
    isFavorite: !isFavorite 
  });
};

// ─── GET /api/listings/favorites ─────────────────────────────
const getFavorites = async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'favorites',
    match: { status: 'active' },
    populate: { path: 'brokerId', select: 'profile.fullName brokerDetails.companyName' }
  });

  return res.json({ favorites: user.favorites });
};

module.exports = {
  getListings, getListingById, createListing,
  updateListing, deleteListing, reportListing, requestVisit,
  toggleFavorite, getFavorites
};

