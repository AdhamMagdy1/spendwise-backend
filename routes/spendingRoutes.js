const express = require('express');
const router = express.Router();
const { authenticateUser } = require('../middlewares/authentication');
const { validateSpending, validateDate } = require('../middlewares/validation');
const {
  getSpendingWithRange,
  createSpendingRecord,
  editSpendingRecord,
  deleteSpendingRecord,
  getAllSpendingRecords,
  getSpendingByPrimaryTag,
  getSpendingBySecondaryTag,
} = require('../controllers/spendingController');

router.get(
  '/spending/range',
  authenticateUser,
  validateDate,
  getSpendingWithRange
);
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

router.get('/spending/primary-tag', authenticateUser, getSpendingByPrimaryTag);
router.get(
  '/spending/secondary-tag',
  authenticateUser,
  getSpendingBySecondaryTag
);

module.exports = router;
