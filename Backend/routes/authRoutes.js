'use strict';
/**
 * routes/authRoutes.js
 */

const router     = require('express').Router();
const controller = require('../controllers/authController');
const { validate, schemas } = require('../middleware/validation');
const { verifyToken }       = require('../middleware/auth');
const { authLimiter }       = require('../config/rateLimiter');

// POST /api/auth/signup
router.post('/signup', authLimiter, validate(schemas.signup), controller.signup);

// POST /api/auth/login
router.post('/login', authLimiter, validate(schemas.login), controller.login);

// GET /api/auth/me
router.get('/me', verifyToken, controller.getMe);

module.exports = router;
