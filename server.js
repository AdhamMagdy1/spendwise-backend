const express = require('express');
const app = express();
const { connectToDatabase } = require('./config/config'); 

// Load environment variables
require('dotenv').config();

// Connect to the MongoDB Atlas database
connectToDatabase();

// Middleware configuration, including body parsing, CORS, and other middleware
// ...

// Define your routes
// ...

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
