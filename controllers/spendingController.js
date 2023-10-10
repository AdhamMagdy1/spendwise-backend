const { validationResult } = require('express-validator');
const User = require('../models/user');
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

    // Convert startDate and endDate to Date objects
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);

    // Extract date strings in "YYYY-MM-DD" format from the input date objects
    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    // Query the database to find spending records within the specified date range
    const spendingRecords = await User.aggregate([
      {
        $match: {
          _id: user._id,
          'spending.date': {
            $gte: new Date(startDateStr),
            $lte: new Date(endDateStr),
          },
        },
      },
      {
        $unwind: '$spending',
      },
      {
        $match: {
          'spending.date': {
            $gte: new Date(startDateStr),
            $lte: new Date(endDateStr),
          },
        },
      },
      {
        $project: {
          _id: 0,
          spending: 1,
        },
      },
    ]);

    res.json({
      spendingRecords: spendingRecords.map((record) => record.spending),
    });
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

    // Format the date to "yyyy-mm-dd" format
    const formattedDate = new Date(req.body.date).toISOString().split('T')[0];

    // Create a new spending record
    const newSpendingRecord = {
      date: formattedDate,
      product: req.body.product,
      price: req.body.price,
      primaryTag: req.body.primaryTag.toUpperCase(),
      secondaryTag: req.body.secondaryTag.toUpperCase(),
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
    const newBudget = user.currentBudget - priceDifference;

    // Check if the user has enough budget after the update
    if (newBudget < 0) {
      throw new AppError(
        'Not enough budget to update this spending record.',
        400
      );
    }

    // Update spending record properties
    spendingRecord.date = new Date(req.body.date);
    spendingRecord.product = req.body.product;
    spendingRecord.price = req.body.price;
    spendingRecord.primaryTag = req.body.primaryTag.toUpperCase();
    spendingRecord.secondaryTag = req.body.secondaryTag.toUpperCase();

    // // Update the user's currentBudget
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

    // Find the index of the spending record within the user's spending array by its ID
    const spendingRecordIndex = user.spending.findIndex(
      (record) => record._id.toString() === req.params.id
    );

    if (spendingRecordIndex === -1) {
      throw new AppError('Spending record not found.', 404);
    }

    // Get the price of the spending record before removing it
    const spendingRecordPrice = user.spending[spendingRecordIndex].price;

    // Update the user's currentBudget by adding back the price of the deleted spending record
    user.currentBudget += spendingRecordPrice;

    // Remove the spending record from the array
    user.spending.splice(spendingRecordIndex, 1);

    // Save the user with the removed spending record and updated currentBudget
    await user.save();

    res.json({ message: 'Spending record deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const getSpendingByPrimaryTag = async (req, res, next) => {
  try {
    // Find the authenticated user by ID
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    // Extract the primary tag from the request query
    const primaryTag = req.query.primaryTag.toUpperCase();

    // Filter spending records by the specified primary tag
    const spendingRecords = user.spending.filter((record) => {
      return record.primaryTag === primaryTag;
    });

    // Check if there are any matching spending records
    if (spendingRecords.length === 0) {
      throw new AppError(
        `No spending records found for primary tag: ${primaryTag}`,
        404
      );
    }

    res.json({ spendingRecords });
  } catch (error) {
    next(error);
  }
};

const getSpendingBySecondaryTag = async (req, res, next) => {
  try {
    // Find the authenticated user by ID
    const user = await User.findById(req.user._id);

    if (!user) {
      throw new AppError('User not found.', 404);
    }

    // Extract the secondary tag from the request query
    const secondaryTag = req.query.secondaryTag.toUpperCase();

    // Filter spending records by the specified secondary tag
    const spendingRecords = user.spending.filter((record) => {
      return record.secondaryTag === secondaryTag;
    });

    // Check if there are any matching spending records
    if (spendingRecords.length === 0) {
      throw new AppError(
        `No spending records found for secondary tag: ${secondaryTag}`,
        404
      );
    }

    res.json({ spendingRecords });
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
  getSpendingByPrimaryTag,
  getSpendingBySecondaryTag,
};
