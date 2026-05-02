'use strict';
/**
 * server.js – HomeTrust Backend Entry Point
 * Boots Express, connects to MongoDB, registers all routes,
 * applies security middleware, and starts listening.
 */

require('dotenv').config();
require('express-async-errors'); // must be first require

const express = require('express');
const helmet  = require('helmet');
const cors    = require('cors');
const morgan  = require('morgan');
const mongoSanitize  = require('express-mongo-sanitize');
const sanitizeHtml   = require('sanitize-html');

/**
 * Recursively strip XSS from all string values in an object.
 */
const deepSanitize = (obj) => {
  if (typeof obj === 'string') return sanitizeHtml(obj, { allowedTags: [], allowedAttributes: {} });
  if (Array.isArray(obj))     return obj.map(deepSanitize);
  if (obj && typeof obj === 'object') {
    const clean = {};
    for (const key of Object.keys(obj)) clean[key] = deepSanitize(obj[key]);
    return clean;
  }
  return obj;
};

const xssClean = (req, _res, next) => {
  if (req.body)  req.body  = deepSanitize(req.body);
  if (req.query) req.query = deepSanitize(req.query);
  next();
};

const connectDB      = require('./config/db');
const logger         = require('./config/logger');
const errorHandler   = require('./middleware/errorHandler');

// ── Routes ──────────────────────────────────────────────────
const authRoutes    = require('./routes/authRoutes');
const reportRoutes  = require('./routes/reportRoutes');
const listingRoutes = require('./routes/listingRoutes');
const brokerRoutes  = require('./routes/brokerRoutes');
const adminRoutes   = require('./routes/adminRoutes');
const generalRoutes = require('./routes/generalRoutes');


const app = express();

// ── Security headers ─────────────────────────────────────────
app.use(helmet());

// ── CORS ─────────────────────────────────────────────────────
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://hometrust.onrender.com',
  'https://home-trust-main.vercel.app',
  ...(process.env.CORS_ORIGINS || '').split(',').map(o => o.trim()).filter(Boolean)
];


app.use(cors({
  origin: (origin, callback) => {
    // 1. Allow non-browser clients (Postman, server-to-server)
    if (!origin) return callback(null, true);

    // 2. Allow exact matches from allowedOrigins
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // 3. Allow Vercel preview/production domains (e.g. hometrust.vercel.app or hometrust-xxx.vercel.app)
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    // 4. Block others
    callback(new Error(`CORS policy blocked origin: ${origin}`));
  },
  credentials: true,
}));


// ── Body parsers ──────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Sanitisation ──────────────────────────────────────────────
app.use(mongoSanitize());   // prevent NoSQL injection
app.use(xssClean);          // strip XSS from req.body / req.query

// ── HTTP request logging ──────────────────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev', {
    stream: { write: msg => logger.http(msg.trim()) },
  }));
}

// ── Health check ──────────────────────────────────────────────
app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// ── API Routes ────────────────────────────────────────────────
app.use('/api',          generalRoutes);
app.use('/api/auth',     authRoutes);
app.use('/api/report',   reportRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/broker',   brokerRoutes);
app.use('/api/admin',    adminRoutes);


// ── 404 fallback ──────────────────────────────────────────────
app.use((_req, res) => res.status(404).json({ error: 'Route not found' }));

// ── Central error handler ─────────────────────────────────────
app.use(errorHandler);

// ── Boot ──────────────────────────────────────────────────────
const PORT = parseInt(process.env.PORT || '5000', 10);

(async () => {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`🏠 HomeTrust backend running on port ${PORT} [${process.env.NODE_ENV}]`);
  });
})();

module.exports = app; // for testing
