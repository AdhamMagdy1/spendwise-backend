const jwt = require('jsonwebtoken');
const { AppError } = require('../utils/error');
const User = require('../models/user'); // Import your User model

// Middleware function to authenticate user requests
const authenticateUser = async (req, res, next) => {
  try {
    // 1. Get the token from the request header
    const token = req.header('Authorization');

    // 2. If no token is provided, send an error response
    if (!token) {
      throw new AppError('Authentication failed. No token provided.', 401);
    }

    // 3. Verify the token and extract the user data
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Find the user in the database using the decoded user ID
    const user = await User.findById(decoded.id);

    // 5. If no user is found, send an error response
    if (!user) {
      throw new AppError('User not found.', 404);
    }

    // 6. Attach the user object to the request for use in route handlers
    req.user = user;
    next();
  } catch (error) {
    next(error); // Pass any errors to the error handling middleware
  }
};

module.exports = {
  authenticateUser,
};
