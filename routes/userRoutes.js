const express = require('express');
const router = express.Router();
const { validateUser } = require('../middlewares/validation');
const { authenticateUser } = require('../middlewares/authentication');
const {
  createNewUser,
  userLogin,
  updateBudget,
} = require('../controllers/userController');

// Define routes
router.post('/signup', validateUser, createNewUser);
router.post('/login', validateUser, userLogin);
router.put('/budget', authenticateUser, updateBudget);

module.exports = router;
