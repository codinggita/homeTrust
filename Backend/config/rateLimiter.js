'use strict';
/**
 * config/rateLimiter.js – express-rate-limit presets
 */

const rateLimit = require('express-rate-limit');

/** Public endpoints: 100 requests per 15 minutes */
const publicLimiter = rateLimit({
  windowMs : parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 min
  max      : parseInt(process.env.RATE_LIMIT_MAX       || '100', 10),
  standardHeaders: true,
  legacyHeaders  : false,
  message : { error: 'Too many requests, please try again after 15 minutes.' },
});

/** Auth endpoints: stricter – 20 requests per 15 minutes */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max     : 20,
  standardHeaders: true,
  legacyHeaders  : false,
  message : { error: 'Too many authentication attempts. Please try again later.' },
});

module.exports = { publicLimiter, authLimiter };
