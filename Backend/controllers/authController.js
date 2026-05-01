'use strict';
/**
 * controllers/authController.js
 * Handles user signup, login, and profile retrieval.
 */

const jwt    = require('jsonwebtoken');
const User   = require('../models/User');
const logger = require('../config/logger');

/** Generate signed JWT for a user ID */
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

// ─── POST /api/auth/signup ────────────────────────────────────
const signup = async (req, res) => {
  const { email, password, role, fullName, phone, brokerCompany } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  // Check for existing user
  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const userData = {
    email,
    password,
    role: role || 'buyer',
    profile: { fullName, phone },
  };

  if (role === 'broker' && brokerCompany) {
    userData.brokerDetails = { companyName: brokerCompany };
  }

  const user  = await User.create(userData);
  const token = signToken(user._id);

  logger.info(`New ${user.role} registered: ${user.email}`);

  return res.status(201).json({
    token,
    user: {
      id      : user._id,
      email   : user.email,
      role    : user.role,
      profile : user.profile,
    },
  });
};

// ─── POST /api/auth/login ─────────────────────────────────────
const login = async (req, res) => {
  const { email, password } = req.body;

  // Select password explicitly (it's excluded by default)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (user.role === 'broker' && user.brokerDetails?.isSuspended) {
    return res.status(403).json({ error: 'Your account has been suspended.' });
  }

  const token = signToken(user._id);

  return res.json({
    token,
    user: {
      id            : user._id,
      email         : user.email,
      role          : user.role,
      profile       : user.profile,
      brokerDetails : user.role === 'broker' ? {
        companyName : user.brokerDetails?.companyName,
        badgeLevel  : user.brokerDetails?.badgeLevel,
        isSuspended : user.brokerDetails?.isSuspended,
      } : undefined,
    },
  });
};

// ─── GET /api/auth/me ─────────────────────────────────────────
const getMe = async (req, res) => {
  // req.user is populated by verifyToken middleware
  return res.json({ user: req.user });
};

module.exports = { signup, login, getMe };
