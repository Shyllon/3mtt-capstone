const { body, validationResult } = require('express-validator');

// User registration validation middleware
const validateUserRegistration = [
  body('email').isEmail().withMessage('Enter a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  // More validation rules as necessary
];

// User login validation middleware
const validateUserLogin = [
  body('email').isEmail().withMessage('Enter a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  // More validation rules
];

// Profile update validation (check if defined)
const validateUserProfileUpdate = [
  body('email').optional().isEmail().withMessage('Enter a valid email address'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  // More validation rules as necessary
];

module.exports = {
  validateUserRegistration,
  validateUserLogin,
  validateUserProfileUpdate, // Ensure this is exported correctly
  validationResult
};
