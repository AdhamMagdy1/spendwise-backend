const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { AppError } = require('../utils/error');

// User registration (signup)
const createNewUser = async (req, res, next) => {
  try {
    // Validation checks using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already exists with the provided email
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      throw new AppError('User with this email already exists.', 400);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create a new user with initial activeToken, currentBudget, and joinDate
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
      activeToken: '',
      currentBudget: 0,
      joinDate: new Date().toISOString(), // Set joinDate to today's date in ISO 8601 format
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};

// User login
const userLogin = async (req, res, next) => {
  try {
    // Validation checks using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find the user by email
    const user = await User.findOne({ email: req.body.email });

    // Check if the user exists and compare passwords
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
      throw new AppError('Invalid email or password.', 401);
    }

    // Generate a new JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d', // Adjust token expiration as needed
    });

    // Update the user's activeToken
    user.activeToken = token;
    await user.save();

    res.json({ message: 'Login successful', token, id: user._id });
  } catch (error) {
    next(error);
  }
};

// Update the current budget for the authenticated user
const updateBudget = async (req, res, next) => {
  try {
    // Validation checks using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    console.log(req.user._id); // Add this line for debugging

    // Find the authenticated user by ID
    const user = await User.findById(req.user._id);
    console.log(user); // Add this line for debugging

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    // Validate and update the user's currentBudget
    const newBudget = parseFloat(req.body.currentBudget);

    if (isNaN(newBudget) || newBudget < 0) {
      throw new AppError('Invalid budget value.', 400);
    }

    user.currentBudget = newBudget;
    await user.save();

    res.json({
      message: 'Budget updated successfully',
      currentBudget: user.currentBudget,
    });
  } catch (error) {
    next(error);
  }
};

// Get the current budget of the authenticated user
const getCurrentBudget = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    res.json({ currentBudget: user.currentBudget });
  } catch (error) {
    next(error);
  }
};

// Get the join date of the authenticated user
const getUserJoinDate = async (req, res, next) => {
  try {
    // Find the authenticated user by ID
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    // Extract and send the join date in the specified format
    const joinDate = user.joinDate;

    res.json({ joinDate });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createNewUser,
  userLogin,
  updateBudget,
  getCurrentBudget, // Add getCurrentBudget to exports
  getUserJoinDate,
};
