'use strict';
/**
 * routes/generalRoutes.js
 * Basic health and connectivity routes.
 */

const router = require('express').Router();

// GET /api/ping
router.get('/ping', (_req, res) => res.json({ message: 'pong', timestamp: new Date() }));

// GET /api/root
router.get('/', (_req, res) => res.json({
  name: 'HomeTrust API',
  version: '1.0.0',
  description: 'Institutional-grade real estate intelligence and rental verification.',
  docs: 'https://documenter.getpostman.com/view/YOUR_DOCS_ID'
}));

module.exports = router;
