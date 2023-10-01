const { validationResult, body } = require('express-validator');
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

// Validation rules for creating/editing spending records
const validateSpending = [
  body('date').isDate().withMessage('Date must be a valid date'),
  body('product').notEmpty().withMessage('Product name is required'),
  body('price').isNumeric().withMessage('Price must be a valid number'),
  body('primaryTag')
    .optional()
    .notEmpty()
    .withMessage('Primary tag cannot be empty'),
  body('secondaryTag')
    .optional()
    .notEmpty()
    .withMessage('Secondary tag cannot be empty'),
];

module.exports = {
  validateRequest,
  validateSpending,
  validateUser,
};
