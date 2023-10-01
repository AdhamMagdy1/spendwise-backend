const mongoose = require('mongoose');

const spendingSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  product: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  primaryTag: String,
  secondaryTag: String,
});

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Ensure email addresses are unique
  },
  password: {
    type: String,
    required: true,
  },
  activeToken: String, // You can specify the data type based on your token requirements
  currentBudget: Number, // You can specify the data type based on your budget requirements
  spending: [spendingSchema], // Embed the spending records as an array
});

// Create and export the User model
module.exports = mongoose.model('User', userSchema);
