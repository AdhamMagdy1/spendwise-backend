const express = require('express');
const router = express.Router();
const {
  validateUserLogin,
  validateUser,
  validateBudget,
} = require('../middlewares/validation'); // Import validateRequest
const { authenticateUser } = require('../middlewares/authentication');
const {
  createNewUser,
  userLogin,
  updateBudget,
  getCurrentBudget,
  getUserJoinDate,
} = require('../controllers/userController');

// Define routes
router.post('/signup', validateUser, createNewUser);
router.post('/login', validateUserLogin, userLogin);
// Update user's current budget
router.put(
  '/budget',
  authenticateUser,
  validateBudget, // Apply user validation rules and validateBudget
  updateBudget
);
// Get the current budget of the authenticated user
router.get('/budget/current', authenticateUser, getCurrentBudget);

// Get the UserJoinDate of the authenticated user
router.get('/joinDate', authenticateUser, getUserJoinDate);

module.exports = router;
