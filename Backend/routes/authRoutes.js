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

// POST /api/auth/logout
router.post('/logout', verifyToken, controller.logout);

// POST /api/auth/forgot-password
router.post('/forgot-password', authLimiter, validate(schemas.forgotPassword), controller.forgotPassword);

// POST /api/auth/reset-password
router.post('/reset-password', authLimiter, validate(schemas.resetPassword), controller.resetPassword);

// POST /api/auth/refresh-token
router.post('/refresh-token', controller.refreshToken);


module.exports = router;
