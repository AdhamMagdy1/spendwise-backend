const express = require('express');
const router = express.Router();
const { validateUser, validateBudget } = require('../middlewares/validation');
const { authenticateUser } = require('../middlewares/authentication');
const {
  createNewUser,
  userLogin,
  updateBudget,
} = require('../controllers/userController');

// Define routes
router.post('/signup', validateUser, createNewUser);
router.post('/login', validateUser, userLogin);
// Update user's current budget
router.put(
  '/budget',
  authenticateUser,
  validateUser, // Apply user validation rules
  validateRequest([body('currentBudget').custom(validateBudget)]), // Validate currentBudget
  updateBudget
);

module.exports = router;
