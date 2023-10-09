const express = require('express');
const app = express();
const { connectToDatabase } = require('./config/config');
const { errorHandler } = require('./utils/error');

// Middleware for body parsing (JSON and form data)
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for Cross-Origin Resource Sharing (CORS)
const cors = require('cors');
app.use(cors());

// Logging Middleware (optional)
const morgan = require('morgan');
app.use(morgan('dev'));

// Load environment variables
require('dotenv').config();

// Connect to the MongoDB Atlas database
connectToDatabase();

// Define your routes
const userRoutes = require('./routes/userRoutes');
const spendingRoutes = require('./routes/spendingRoutes');

app.use('/api/user', userRoutes); // User-related routes
app.use('/api/spending', spendingRoutes); // Spending-related routes

// Error handling middleware
app.use(errorHandler); // Use the error handling middleware at the end of your middleware stack

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
