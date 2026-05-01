'use strict';
/**
 * middleware/validation.js
 * Joi schemas and validator factory for request bodies.
 */

const Joi = require('joi');

// ─── Schemas ─────────────────────────────────────────────────────────────────

const signupSchema = Joi.object({
  email        : Joi.string().email().lowercase().required(),
  password     : Joi.string().min(8).max(72).required(),
  role         : Joi.string().valid('buyer', 'broker').default('buyer'),
  fullName     : Joi.string().min(2).max(100).required(),
  phone        : Joi.string().pattern(/^[6-9]\d{9}$/).required()
                   .messages({ 'string.pattern.base': 'Phone must be a valid 10-digit Indian mobile number' }),
  brokerCompany: Joi.string().max(200).when('role', { is: 'broker', then: Joi.optional() }),
});

const loginSchema = Joi.object({
  email   : Joi.string().email().lowercase().required(),
  password: Joi.string().required(),
});

const createListingSchema = Joi.object({
  addressFull  : Joi.string().min(5).max(500).required(),
  pincode      : Joi.string().pattern(/^\d{6}$/).required(),
  lat          : Joi.number().min(-90).max(90).optional(),
  lon          : Joi.number().min(-180).max(180).optional(),
  price        : Joi.number().positive().required(),
  bhk          : Joi.number().integer().min(1).max(10).required(),
  area         : Joi.number().positive().required(),
  furnishing   : Joi.string().valid('unfurnished', 'semi-furnished', 'fully-furnished').default('unfurnished'),
  availability : Joi.date().iso().optional(),
  amenities    : Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).optional(),
});

const updateListingSchema = Joi.object({
  addressFull  : Joi.string().min(5).max(500).optional(),
  price        : Joi.number().positive().optional(),
  bhk          : Joi.number().integer().min(1).max(10).optional(),
  area         : Joi.number().positive().optional(),
  furnishing   : Joi.string().valid('unfurnished', 'semi-furnished', 'fully-furnished').optional(),
  availability : Joi.date().iso().optional(),
  amenities    : Joi.alternatives().try(
    Joi.array().items(Joi.string()),
    Joi.string()
  ).optional(),
}).min(1);

const reportListingSchema = Joi.object({
  reason     : Joi.string()
    .valid('fake_photos', 'wrong_location', 'price_fraud', 'broker_scam', 'already_rented', 'other')
    .required(),
  description: Joi.string().max(1000).optional(),
});

const pincodeSchema = Joi.object({
  pincode: Joi.string().pattern(/^\d{6}$/).required(),
});

const comparePincodesSchema = Joi.object({
  pincodes: Joi.array()
    .items(Joi.string().pattern(/^\d{6}$/))
    .min(2)
    .max(3)
    .required(),
});

const adminResolveSchema = Joi.object({
  action : Joi.string().valid('remove', 'dismiss').required(),
  strike : Joi.boolean().default(false),
  note   : Joi.string().max(500).optional(),
});

const adminVerifyListingSchema = Joi.object({
  approve           : Joi.boolean().required(),
  verificationLevel : Joi.string().valid('silver', 'gold', 'platinum').required(),
});

// ─── Middleware Factory ───────────────────────────────────────────────────────

/**
 * Validates req.body against a Joi schema.
 * Returns 400 with detailed errors on failure.
 * @param {Joi.ObjectSchema} schema
 */
const validate = (schema) => (req, res, next) => {
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const details = error.details.map(d => d.message);
    return res.status(400).json({ error: 'Validation failed', details });
  }
  req.body = value; // replace with sanitised/defaulted values
  next();
};

module.exports = {
  validate,
  schemas: {
    signup              : signupSchema,
    login               : loginSchema,
    createListing       : createListingSchema,
    updateListing       : updateListingSchema,
    reportListing       : reportListingSchema,
    pincode             : pincodeSchema,
    comparePincodes     : comparePincodesSchema,
    adminResolve        : adminResolveSchema,
    adminVerifyListing  : adminVerifyListingSchema,
  },
};
