const { validationResult, body, query } = require('express-validator');
const { AppError } = require('../utils/error');

// Middleware function for request validation using express-validator
const validateRequest = (validations) => {
  return async (req, res, next) => {
    // Execute the defined validations
    await Promise.all(validations.map((validation) => validation.run(req)));

    // Check for validation errors
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      // If there are validation errors, send an error response
      const errorMessages = errors.array().map((error) => error.msg);
      next(new AppError(`Validation error: ${errorMessages.join(', ')}`, 400));
    } else {
      // If there are no validation errors, continue to the next middleware
      next();
    }
  };
};

// Validation rules for user registration
const validateUser = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];
const validateUserLogin = [
  body('email').isEmail().withMessage('Invalid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
];

// Validation rules for creating/editing spending records
const validateSpending = [
  body('date').isISO8601().withMessage('Date must be in ISO 8601 format'),
  body('product').notEmpty().withMessage('Product name is required'),
  body('price')
    .isNumeric()
    .withMessage('Price must be a valid number')
    .custom((value) => {
      if (value <= 0) {
        throw new Error('Price must be grater than zero');
      }
      return true;
    }),
  body('primaryTag')
    .optional()
    .notEmpty()
    .withMessage('Primary tag cannot be empty'),
  body('secondaryTag')
    .optional()
    .notEmpty()
    .withMessage('Secondary tag cannot be empty'),
];

// Custom validation for budget
const validateBudget = [
  body('currentBudget')
    .isNumeric()
    .withMessage('Budget must be a valid number')
    .custom((value) => {
      if (value < 0) {
        throw new Error('Budget must be a positive number or zero');
      }
      return true;
    }),
];

// Custom validation for date format (start and end date)
const validateDate = [
  query('startDate')
    .isISO8601()
    .withMessage(
      'Invalid startDate format. Use ISO 8601 format (e.g., "2023-09-30T14:00:00.000Z")'
    ),
  query('endDate')
    .isISO8601()
    .withMessage(
      'Invalid endDate format. Use ISO 8601 format (e.g., "2023-09-30T14:00:00.000Z")'
    ),
];

module.exports = {
  validateRequest,
  validateSpending,
  validateUser,
  validateBudget,
  validateUserLogin,
  validateDate, // Add the validateDate export
};
