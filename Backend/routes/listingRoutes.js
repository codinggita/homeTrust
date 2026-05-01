'use strict';
/**
 * routes/listingRoutes.js
 */

const router     = require('express').Router();
const controller = require('../controllers/listingController');
const { verifyToken, requireRole }    = require('../middleware/auth');
const { validate, schemas }           = require('../middleware/validation');
const { publicLimiter }               = require('../config/rateLimiter');
const { listingPhotoUpload }          = require('../middleware/upload');

// GET /api/listings – public, rate-limited
router.get('/', publicLimiter, controller.getListings);

// GET /api/listings/:id – public
router.get('/:id', controller.getListingById);

// POST /api/listings – broker only, accepts multipart/form-data with photos
router.post(
  '/',
  verifyToken,
  requireRole('broker'),
  listingPhotoUpload.array('photos', 10),
  validate(schemas.createListing),
  controller.createListing,
);

// PUT /api/listings/:id – broker who owns it
router.put(
  '/:id',
  verifyToken,
  requireRole('broker'),
  validate(schemas.updateListing),
  controller.updateListing,
);

// DELETE /api/listings/:id – broker owner or admin
router.delete('/:id', verifyToken, requireRole('broker', 'admin'), controller.deleteListing);

// POST /api/listings/:id/report – buyer
router.post(
  '/:id/report',
  verifyToken,
  requireRole('buyer'),
  validate(schemas.reportListing),
  controller.reportListing,
);

// POST /api/listings/:id/visit – any authenticated user
router.post('/:id/visit', verifyToken, controller.requestVisit);

module.exports = router;
