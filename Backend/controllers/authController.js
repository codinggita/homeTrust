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
    expiresIn: process.env.JWT_EXPIRES_IN || '1h', // Access token should be short-lived
  });

/** Generate a long-lived refresh token */
const signRefreshToken = (id) =>
  jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || 'refresh_secret_v1', {
    expiresIn: '30d',
  });

// ─── POST /api/auth/signup ────────────────────────────────────
const signup = async (req, res) => {
  const { email, password, role, fullName, phone, brokerCompany } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
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

  const user = await User.create(userData);
  const token = signToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  logger.info(`New ${user.role} registered: ${user.email}`);

  return res.status(201).json({
    token,
    refreshToken,
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

  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  if (user.role === 'broker' && user.brokerDetails?.isSuspended) {
    return res.status(403).json({ error: 'Your account has been suspended.' });
  }

  const token = signToken(user._id);
  const refreshToken = signRefreshToken(user._id);

  user.refreshToken = refreshToken;
  await user.save();

  return res.json({
    token,
    refreshToken,
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

// ─── POST /api/auth/refresh-token ─────────────────────────────
const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(400).json({ error: 'Refresh token is required.' });

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || 'refresh_secret_v1');
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ error: 'Invalid or expired refresh token.' });
    }

    // Generate new pair (rotation)
    const newToken = signToken(user._id);
    const newRefreshToken = signRefreshToken(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    return res.json({ token: newToken, refreshToken: newRefreshToken });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired refresh token.' });
  }
};

// ─── GET /api/auth/me ─────────────────────────────────────────
const getMe = async (req, res) => {
  // req.user is populated by verifyToken middleware
  return res.json({ user: req.user });
};

// ─── POST /api/auth/logout ────────────────────────────────────
const logout = async (req, res) => {
  if (req.user) {
    req.user.refreshToken = undefined;
    await req.user.save();
  }
  logger.info(`User logged out: ${req.user?.email || 'unknown'}`);
  return res.json({ message: 'Successfully logged out.' });
};


// ─── POST /api/auth/forgot-password ───────────────────────────
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: 'No account found with that email address.' });
  }

  // Generate a random 6-digit PIN or token
  const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  logger.info(`Password reset requested for: ${email}. Code: ${resetToken}`);

  // In production, send email here. For now, return in response for easier testing.
  return res.json({ 
    message: 'Password reset code sent to email.',
    debug_code: process.env.NODE_ENV !== 'production' ? resetToken : undefined 
  });
};

// ─── POST /api/auth/reset-password ────────────────────────────
const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;

  const user = await User.findOne({
    email,
    resetPasswordToken: code,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    return res.status(400).json({ error: 'Invalid or expired reset code.' });
  }

  user.password = newPassword;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  logger.info(`Password reset successfully for: ${email}`);
  return res.json({ message: 'Password has been reset successfully. You can now log in.' });
};

module.exports = { signup, login, getMe, logout, forgotPassword, resetPassword, refreshToken };


