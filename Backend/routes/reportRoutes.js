'use strict';
/**
 * routes/reportRoutes.js
 *
 * IMPORTANT: Static routes (/compare, /saved, /saved/:id) MUST be registered
 * BEFORE the dynamic /:pincode route, otherwise Express will match
 * "compare" and "saved" as pincode values.
 */

const router     = require('express').Router();
const controller = require('../controllers/reportController');
const { verifyToken, requireRole } = require('../middleware/auth');
const { validate, schemas }        = require('../middleware/validation');
const { publicLimiter }            = require('../config/rateLimiter');

// ── Static routes first ─────────────────────────────────────────

// POST /api/report/compare – public, rate-limited
router.post('/compare', publicLimiter, validate(schemas.comparePincodes), controller.compareReports);

// GET /api/report/saved – buyer only
router.get('/saved', verifyToken, requireRole('buyer'), controller.getSavedReports);

// DELETE /api/report/saved/:id – buyer only
router.delete('/saved/:id', verifyToken, requireRole('buyer'), controller.deleteSavedReport);

// POST /api/report/save – buyer only
router.post('/save', verifyToken, requireRole('buyer'), controller.saveReport);

// ── Dynamic route last ──────────────────────────────────────────

// GET /api/report/:pincode – public, rate-limited
router.get('/:pincode', publicLimiter, controller.getReport);

module.exports = router;
