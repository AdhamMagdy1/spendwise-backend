const { validationResult } = require('express-validator');
const { User } = require('../models/user');
const { AppError } = require('../utils/error');

// Get spending records within a date range for the authenticated user
const getSpendingWithRange = async (req, res, next) => {
  try {
    // Validation checks using express-validator for date range
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find the authenticated user by ID
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    // Fetch spending records within the specified date range for the user
    const startDate = new Date(req.body.startDate);
    const endDate = new Date(req.body.endDate);
    endDate.setHours(23, 59, 59, 999);

    const spendingRecords = user.spending.filter((record) => {
      return record.date >= startDate && record.date <= endDate;
    });

    res.json({ spendingRecords });
  } catch (error) {
    next(error);
  }
};

const createSpendingRecord = async (req, res, next) => {
  try {
    // Validation checks using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find the authenticated user by ID
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    // Calculate the new budget after adding the spending record
    const newBudget = user.currentBudget - req.body.price;

    // Check if the user has enough budget
    if (newBudget < 0) {
      throw new AppError(
        'Not enough budget to create this spending record.',
        400
      );
    }

    // Create a new spending record
    const newSpendingRecord = {
      date: req.body.date,
      product: req.body.product,
      price: req.body.price,
      primaryTag: req.body.primaryTag,
      secondaryTag: req.body.secondaryTag,
    };

    // Add the new spending record to the user's spending array
    user.spending.push(newSpendingRecord);

    // Update the user's currentBudget
    user.currentBudget = newBudget;

    // Save the updated user with the new spending record and updated currentBudget
    await user.save();

    res.status(201).json({
      message: 'Spending record created successfully',
      spending: newSpendingRecord,
    });
  } catch (error) {
    next(error);
  }
};

const editSpendingRecord = async (req, res, next) => {
  try {
    // Validation checks using express-validator
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Find the authenticated user by ID
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    // Find the spending record within the user's spending array by its index
    const spendingRecord = user.spending.id(req.params.id);

    if (!spendingRecord) {
      throw new AppError('Spending record not found.', 404);
    }

    // Calculate the difference in price between the new price and the old price
    const priceDifference = req.body.price - spendingRecord.price;

    // Calculate the new budget after updating the spending record
    const newBudget = user.currentBudget + priceDifference;

    // Check if the user has enough budget after the update
    if (newBudget < 0) {
      throw new AppError(
        'Not enough budget to update this spending record.',
        400
      );
    }

    // Update spending record properties
    spendingRecord.date = req.body.date;
    spendingRecord.product = req.body.product;
    spendingRecord.price = req.body.price;
    spendingRecord.primaryTag = req.body.primaryTag;
    spendingRecord.secondaryTag = req.body.secondaryTag;

    // Update the user's currentBudget
    user.currentBudget = newBudget;

    // Save the updated user with the edited spending record and updated currentBudget
    await user.save();

    res.json({
      message: 'Spending record updated successfully',
      spending: spendingRecord,
    });
  } catch (error) {
    next(error);
  }
};

// Get all spending records for the authenticated user
const getAllSpendingRecords = async (req, res, next) => {
  try {
    // Find the authenticated user by ID
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    res.json({ spendingRecords: user.spending });
  } catch (error) {
    next(error);
  }
};
const deleteSpendingRecord = async (req, res, next) => {
  try {
    // Find the authenticated user by ID
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    // Find and remove the spending record within the user's spending array by its index
    const spendingRecord = user.spending.id(req.params.id);

    if (!spendingRecord) {
      throw new AppError('Spending record not found.', 404);
    }

    // Update the user's currentBudget by adding back the price of the deleted spending record
    user.currentBudget += spendingRecord.price;

    spendingRecord.remove();

    // Save the user with the removed spending record and updated currentBudget
    await user.save();

    res.json({ message: 'Spending record deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSpendingWithRange,
  createSpendingRecord,
  editSpendingRecord,
  deleteSpendingRecord,
  getAllSpendingRecords,
};
