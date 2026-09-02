const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getJourney,
  createJourney,
  updateJourney,
  deleteJourney
} = require('../controllers/journeyController');

// Public routes
router.get('/', getJourney);

// Protected routes (Admin only)
router.post('/', protect, createJourney);
router.put('/:id', protect, updateJourney);
router.delete('/:id', protect, deleteJourney);

module.exports = router;