'use strict';
/**
 * middleware/errorHandler.js
 * Central error handler – catches all errors thrown by route handlers.
 * Logs with Winston, returns structured JSON response.
 */

const logger = require('../config/logger');

// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, _next) => {
  // Log full error with stack trace in non-production
  const isDev = process.env.NODE_ENV !== 'production';
  logger.error(`${req.method} ${req.originalUrl} → ${err.message}`, { stack: err.stack });

  // Mongoose validation errors
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: 'Validation error', details: messages });
  }

  // Mongoose CastError (invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Invalid ${err.path}: ${err.value}` });
  }

  // MongoDB duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    const value = err.keyValue?.[field];
    return res.status(409).json({ error: `Duplicate value for ${field}: ${value}` });
  }

  // JWT errors (caught in middleware/auth.js but include here as safety net)
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Invalid token.' });
  }

  // Multer file size exceeded
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ error: 'File too large. Maximum allowed size is 10 MB.' });
  }

  // Default 500
  const status  = err.statusCode || err.status || 500;
  const message = isDev ? err.message : 'An internal server error occurred.';
  return res.status(status).json({ error: message, ...(isDev && { stack: err.stack }) });
};

module.exports = errorHandler;
