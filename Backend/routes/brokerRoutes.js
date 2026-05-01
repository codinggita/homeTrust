'use strict';
/**
 * routes/brokerRoutes.js
 */

const router     = require('express').Router();
const controller = require('../controllers/brokerController');
const { verifyToken, requireRole } = require('../middleware/auth');
const { documentUpload, videoUpload } = require('../middleware/upload');

// All broker routes require authentication + broker role
router.use(verifyToken, requireRole('broker'));

// GET /api/broker/stats
router.get('/stats', controller.getBrokerStats);

// GET /api/broker/listings
router.get('/listings', controller.getBrokerListings);

// POST /api/broker/verify-document
// Accepts single file; type in body determines upload filter
router.post(
  '/verify-document',
  (req, _res, next) => {
    // Dynamically choose multer preset based on document type
    const type = req.body?.type || req.query?.type || '';
    const upload = type === 'video'
      ? videoUpload.single('file')
      : documentUpload.single('file');
    upload(req, _res, next);
  },
  controller.uploadVerificationDocument,
);

module.exports = router;
