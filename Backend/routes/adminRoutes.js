'use strict';
/**
 * routes/adminRoutes.js
 */

const router     = require('express').Router();
const controller = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/auth');
const { validate, schemas }        = require('../middleware/validation');

// All admin routes require authentication + admin role
router.use(verifyToken, requireRole('admin'));

// GET /api/admin/reported
router.get('/reported', controller.getReportedListings);

// POST /api/admin/reported/:id/resolve
router.post('/reported/:id/resolve', validate(schemas.adminResolve), controller.resolveReport);

// GET /api/admin/verification-queue
router.get('/verification-queue', controller.getVerificationQueue);

// POST /api/admin/verify-listing/:id
router.post('/verify-listing/:id', validate(schemas.adminVerifyListing), controller.verifyListing);

// GET /api/admin/analytics
router.get('/analytics', controller.getAnalytics);

// GET /api/admin/users
router.get('/users', controller.getAllUsers);

// PATCH /api/admin/users/:id/status
router.patch('/users/:id/status', validate(schemas.updateUserStatus), controller.updateUserStatus);


module.exports = router;

