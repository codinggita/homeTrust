'use strict';
/**
 * middleware/auth.js
 * JWT verification and role-based access control middleware.
 */

const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

/**
 * verifyToken – Extract and verify JWT from Authorization header.
 * Attaches the full user document to req.user (without password).
 */
const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided. Authorization header must be: Bearer <token>' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user    = await User.findById(decoded.id).select('-password');

    if (!user) return res.status(401).json({ error: 'User associated with this token no longer exists.' });

    // Prevent suspended brokers from accessing protected routes
    if (user.role === 'broker' && user.brokerDetails?.isSuspended) {
      return res.status(403).json({ error: 'Your broker account has been suspended due to policy violations.' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token has expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid token.' });
  }
};

/**
 * requireRole – Middleware factory. Allows only specified roles.
 * @param {...string} roles – allowed roles
 */
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ error: 'Not authenticated.' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({
      error: `Access denied. Required role(s): [${roles.join(', ')}]. Your role: ${req.user.role}`,
    });
  }
  next();
};

module.exports = { verifyToken, requireRole };
