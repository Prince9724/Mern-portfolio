const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getSettings, updateSettings } = require('../controllers/settingsController');

// Public route - Get settings
router.get('/', getSettings);

// Protected route - Update settings
router.put('/', protect, updateSettings);

module.exports = router;