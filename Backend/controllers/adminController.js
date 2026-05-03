'use strict';
/**
 * controllers/adminController.js
 * Admin moderation: reported listings, verification queue, analytics.
 */

const ReportedListing = require('../models/ReportedListing');
const Listing         = require('../models/Listing');
const User            = require('../models/User');
const logger          = require('../config/logger');
const { trustScoreFromLevel } = require('../utils/helpers');

// ─── GET /api/admin/reported ──────────────────────────────────
const getReportedListings = async (req, res) => {
  const { status = 'pending', page = 1, limit = 20 } = req.query;

  const pageNum  = Math.max(1, parseInt(page, 10));
  const pageSize = Math.min(50, parseInt(limit, 10));

  const filter = {};
  if (status !== 'all') filter.status = status;

  const [reports, total] = await Promise.all([
    ReportedListing.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize)
      .populate('listingId', 'address price bhk status brokerId verificationLevel')
      .populate('reporterId', 'profile.fullName email'),
    ReportedListing.countDocuments(filter),
  ]);

  return res.json({ reports, total, page: pageNum, totalPages: Math.ceil(total / pageSize) });
};

// ─── POST /api/admin/reported/:id/resolve ─────────────────────
const resolveReport = async (req, res) => {
  const { action, strike, note } = req.body;

  const report = await ReportedListing.findById(req.params.id).populate('listingId');
  if (!report) return res.status(404).json({ error: 'Report not found.' });

  report.status     = action === 'remove' ? 'resolved' : 'dismissed';
  report.adminNote  = note;
  report.resolvedAt = new Date();
  report.resolvedBy = req.user._id;
  await report.save();

  if (action === 'remove') {
    const listing = report.listingId;
    if (listing) {
      listing.status = 'removed';
      await listing.save();
      logger.info(`Admin ${req.user.email} removed listing ${listing._id}`);
    }

    if (strike) {
      const broker = await User.findById(listing?.brokerId);
      if (broker) {
        broker.brokerDetails.strikes += 1;
        if (broker.brokerDetails.strikes >= 3) {
          broker.brokerDetails.isSuspended = true;
          logger.warn(`Broker ${broker.email} suspended after 3 strikes`);
        }
        await broker.save();
      }
    }
  }

  return res.json({ message: `Report ${report.status}.`, report });
};

// ─── GET /api/admin/verification-queue ───────────────────────
const getVerificationQueue = async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const pageNum  = Math.max(1, parseInt(page, 10));
  const pageSize = Math.min(50, parseInt(limit, 10));

  // Listings that are pending and belong to brokers with enough docs for upgrade
  const listings = await Listing.find({ status: 'pending' })
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * pageSize)
    .limit(pageSize)
    .populate('brokerId', 'profile.fullName email brokerDetails.badgeLevel brokerDetails.verificationDocuments brokerDetails.strikes');

  // Annotate with suggested verification level
  const annotated = listings.map(l => {
    const badge   = l.brokerId?.brokerDetails?.badgeLevel || 'none';
    const suggested = badge; // broker badge determines max listing level
    return { ...l.toObject(), suggestedVerificationLevel: suggested };
  });

  const total = await Listing.countDocuments({ status: 'pending' });

  return res.json({ listings: annotated, total, page: pageNum, totalPages: Math.ceil(total / pageSize) });
};

// ─── POST /api/admin/verify-listing/:id ─────────────────────
const verifyListing = async (req, res) => {
  const { approve, verificationLevel } = req.body;

  const listing = await Listing.findById(req.params.id);
  if (!listing) return res.status(404).json({ error: 'Listing not found.' });

  if (!approve) {
    listing.status = 'removed';
    await listing.save();
    return res.json({ message: 'Listing rejected and removed.', listing });
  }

  listing.verificationLevel = verificationLevel;
  listing.trustScore        = trustScoreFromLevel(verificationLevel);
  listing.status            = 'active';
  await listing.save();

  logger.info(`Admin ${req.user.email} approved listing ${listing._id} as ${verificationLevel}`);

  return res.json({ message: 'Listing approved.', listing });
};

// ─── GET /api/admin/analytics ────────────────────────────────
const getAnalytics = async (req, res) => {
  // Fake percentage by city (based on reported vs total listings per pincode)
  const fakePercentageByCity = await ReportedListing.aggregate([
    { $match: { status: 'resolved' } },
    {
      $lookup: {
        from        : 'listings',
        localField  : 'listingId',
        foreignField: '_id',
        as          : 'listing',
      },
    },
    { $unwind: '$listing' },
    {
      $group: {
        _id      : '$listing.address.pincode',
        fakeCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from    : 'listings',
        let     : { pincode: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$address.pincode', '$$pincode'] } } },
          { $count: 'total' },
        ],
        as: 'allListings',
      },
    },
    { $unwind: { path: '$allListings', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        city      : '$_id',
        percentage: {
          $round: [
            { $multiply: [{ $divide: ['$fakeCount', { $ifNull: ['$allListings.total', 1] }] }, 100] },
            1,
          ],
        },
      },
    },
    { $sort: { percentage: -1 } },
    { $limit: 10 },
  ]);

  // Top offending brokers (most strikes)
  const topOffendingBrokers = await User.aggregate([
    { $match: { role: 'broker', 'brokerDetails.strikes': { $gt: 0 } } },
    {
      $lookup: {
        from    : 'listings',
        let     : { brokerId: '$_id' },
        pipeline: [
          { $match: { $expr: { $eq: ['$brokerId', '$$brokerId'] }, status: 'removed' } },
          { $count: 'total' },
        ],
        as: 'removedListings',
      },
    },
    { $unwind: { path: '$removedListings', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        brokerName  : '$profile.fullName',
        email       : '$email',
        strikes     : '$brokerDetails.strikes',
        isSuspended : '$brokerDetails.isSuspended',
        fakeListings: { $ifNull: ['$removedListings.total', 0] },
      },
    },
    { $sort: { strikes: -1 } },
    { $limit: 10 },
  ]);

  // Platform summary
  const [totalListings, totalUsers, totalReports] = await Promise.all([
    Listing.countDocuments(),
    User.countDocuments(),
    ReportedListing.countDocuments(),
  ]);

  return res.json({
    fakePercentageByCity,
    topOffendingBrokers,
    summary: { totalListings, totalUsers, totalReports },
  });
};

// ─── GET /api/admin/users ────────────────────────────────────
const getAllUsers = async (req, res) => {
  const { role, page = 1, limit = 20 } = req.query;
  const pageNum  = Math.max(1, parseInt(page, 10));
  const pageSize = Math.min(100, parseInt(limit, 10));

  const filter = {};
  if (role) filter.role = role;

  const [users, total] = await Promise.all([
    User.find(filter)
      .sort({ createdAt: -1 })
      .skip((pageNum - 1) * pageSize)
      .limit(pageSize),
    User.countDocuments(filter),
  ]);

  return res.json({ users, total, page: pageNum, totalPages: Math.ceil(total / pageSize) });
};

// ─── PATCH /api/admin/users/:id/status ───────────────────────
const updateUserStatus = async (req, res) => {
  const { isSuspended } = req.body;
  const user = await User.findById(req.params.id);

  if (!user) return res.status(404).json({ error: 'User not found.' });
  if (user.role !== 'broker') return res.status(400).json({ error: 'Only broker accounts can be suspended.' });

  user.brokerDetails.isSuspended = isSuspended;
  await user.save();

  logger.info(`Admin ${req.user.email} ${isSuspended ? 'suspended' : 'unsuspended'} broker ${user.email}`);
  return res.json({ message: `Broker ${isSuspended ? 'suspended' : 'unsuspended'} successfully.`, user });
};

module.exports = { 
  getReportedListings, resolveReport, 
  getVerificationQueue, verifyListing, 
  getAnalytics, getAllUsers, updateUserStatus 
};

