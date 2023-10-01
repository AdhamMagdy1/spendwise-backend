const express = require('express');
const router = express.Router();
const {
  validateUser,
  validateBudget,
  validateRequest,
} = require('../middlewares/validation'); // Import validateRequest
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
  validateRequest([validateBudget]), // Apply user validation rules and validateBudget
  updateBudget
);

module.exports = router;
