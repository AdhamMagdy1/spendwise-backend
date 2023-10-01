const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/authentication');
const { validateSpending } = require('../middlewares/validation');
const {
  getSpendingWithRange,
  createSpendingRecord,
  editSpendingRecord,
  deleteSpendingRecord,
  getAllSpendingRecords,
} = require('../controllers/spendingController');

// Define routes
router.get('/spending/range', authenticateUser, getSpendingWithRange);
router.post(
  '/spending',
  authenticateUser,
  validateSpending,
  createSpendingRecord
);
router.put(
  '/spending/:id',
  authenticateUser,
  validateSpending,
  editSpendingRecord
);
router.delete('/spending/:id', authenticateUser, deleteSpendingRecord);
router.get('/spending', authenticateUser, getAllSpendingRecords);

module.exports = router;
