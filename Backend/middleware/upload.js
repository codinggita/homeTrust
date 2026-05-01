'use strict';
/**
 * middleware/upload.js
 * Multer configuration using memory storage.
 * Files are kept in buffer and uploaded to Cloudinary by controllers.
 */

const multer = require('multer');
const path   = require('path');

const ALLOWED_IMAGE_TYPES = /jpeg|jpg|png|webp/;
const ALLOWED_DOC_TYPES   = /jpeg|jpg|png|webp|pdf/;
const ALLOWED_VIDEO_TYPES = /mp4|mov|webm|avi/;

const imageFilter = (_req, file, cb) => {
  const ext      = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mimeType = file.mimetype;
  if (ALLOWED_IMAGE_TYPES.test(ext) && (mimeType.startsWith('image/'))) {
    return cb(null, true);
  }
  cb(new Error(`Invalid file type. Allowed image formats: jpeg, jpg, png, webp. Got: ${ext}`));
};

const documentFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (ALLOWED_DOC_TYPES.test(ext)) return cb(null, true);
  cb(new Error(`Invalid document type. Allowed: jpeg, jpg, png, webp, pdf. Got: ${ext}`));
};

const videoFilter = (_req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  if (ALLOWED_VIDEO_TYPES.test(ext) || file.mimetype.startsWith('video/')) return cb(null, true);
  cb(new Error(`Invalid video type. Allowed: mp4, mov, webm, avi. Got: ${ext}`));
};

const memoryStorage = multer.memoryStorage();

/** For listing photos (up to 10 images, 10 MB each) */
const listingPhotoUpload = multer({
  storage : memoryStorage,
  limits  : { fileSize: 10 * 1024 * 1024, files: 10 },
  fileFilter: imageFilter,
});

/** For broker KYC / ownership documents (1 file, 10 MB) */
const documentUpload = multer({
  storage : memoryStorage,
  limits  : { fileSize: 10 * 1024 * 1024, files: 1 },
  fileFilter: documentFilter,
});

/** For video walkthrough (1 file, 100 MB) */
const videoUpload = multer({
  storage : memoryStorage,
  limits  : { fileSize: 100 * 1024 * 1024, files: 1 },
  fileFilter: videoFilter,
});

module.exports = { listingPhotoUpload, documentUpload, videoUpload };
