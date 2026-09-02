const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { contactLimiter } = require('../middleware/rateLimiter');
const { 
  sendMessage, 
  getMessages, 
  updateMessage, 
  deleteMessage 
} = require('../controllers/contactController');

// Public route - Send contact message
router.post('/', contactLimiter, sendMessage);

// Admin routes - Message management (Protected)
router.get('/', protect, getMessages);        // ✅ GET /api/admin/messages
router.put('/:id', protect, updateMessage);    // ✅ PUT /api/admin/messages/:id
router.delete('/:id', protect, deleteMessage); // ✅ DELETE /api/admin/messages/:id

module.exports = router;