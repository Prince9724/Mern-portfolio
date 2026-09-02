const Contact = require('../models/Contact');
const { sendContactNotification, sendAutoReply } = require('../config/email');

// @desc    Send contact message
// @route   POST /api/contact
// @access  Public
const sendMessage = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }

    // Save to database
    const contact = await Contact.create({ 
      name, 
      email, 
      subject, 
      message 
    });

    console.log('✅ Message saved to database:', contact._id);

    // Send email notification to admin
    try {
      await sendContactNotification({ name, email, subject, message });
      console.log('✅ Admin notification email sent');
    } catch (emailError) {
      console.error('❌ Failed to send admin email:', emailError.message);
    }

    // Send auto-reply to user
    try {
      await sendAutoReply(email, name);
      console.log('✅ Auto-reply email sent to user');
    } catch (emailError) {
      console.error('❌ Failed to send auto-reply:', emailError.message);
    }

    res.status(201).json({ 
      success: true, 
      message: 'Message sent successfully' 
    });
  } catch (error) {
    console.error('❌ Error in sendMessage:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to send message' 
    });
  }
};

// @desc    Get all messages (Admin)
// @route   GET /api/admin/messages
// @access  Private
const getMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.json({ success: true, data: messages });
  } catch (error) {
    console.error('❌ Error in getMessages:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch messages' 
    });
  }
};

// @desc    Update message status
// @route   PUT /api/admin/messages/:id
// @access  Private
const updateMessage = async (req, res) => {
  try {
    const message = await Contact.findByIdAndUpdate(
      req.params.id,
      { ...req.body, isRead: true },
      { new: true, runValidators: true }
    );
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }
    res.json({ success: true, data: message });
  } catch (error) {
    console.error('❌ Error in updateMessage:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to update message' 
    });
  }
};

// @desc    Delete message
// @route   DELETE /api/admin/messages/:id
// @access  Private
const deleteMessage = async (req, res) => {
  try {
    const message = await Contact.findById(req.params.id);
    if (!message) {
      return res.status(404).json({ 
        success: false, 
        message: 'Message not found' 
      });
    }
    await message.deleteOne();
    res.json({ 
      success: true, 
      message: 'Message deleted successfully' 
    });
  } catch (error) {
    console.error('❌ Error in deleteMessage:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to delete message' 
    });
  }
};

module.exports = { 
  sendMessage, 
  getMessages, 
  updateMessage, 
  deleteMessage 
};