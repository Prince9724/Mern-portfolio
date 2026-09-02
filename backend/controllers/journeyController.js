const Journey = require('../models/Journey');

// @desc    Get all journey entries
// @route   GET /api/journey
// @access  Public
const getJourney = async (req, res) => {
  try {
    const journey = await Journey.find().sort({ displayOrder: 1, startDate: -1 });
    res.json({ success: true, count: journey.length, data: journey });
  } catch (error) {
    console.error('Error in getJourney:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch journey'
    });
  }
};

// @desc    Create journey entry
// @route   POST /api/journey
// @access  Private
const createJourney = async (req, res) => {
  try {
    const { title, description, startDate, endDate, current, technologies, displayOrder } = req.body;
    
    if (!title || !startDate) {
      return res.status(400).json({
        success: false,
        message: 'Title and start date are required'
      });
    }

    const journey = await Journey.create({
      title,
      description,
      startDate,
      endDate,
      current: current || false,
      technologies: technologies || [],
      displayOrder: displayOrder || 0
    });
    
    res.status(201).json({ success: true, data: journey });
  } catch (error) {
    console.error('Error in createJourney:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create journey entry'
    });
  }
};

// @desc    Update journey entry
// @route   PUT /api/journey/:id
// @access  Private
const updateJourney = async (req, res) => {
  try {
    const journey = await Journey.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey entry not found'
      });
    }
    
    res.json({ success: true, data: journey });
  } catch (error) {
    console.error('Error in updateJourney:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to update journey entry'
    });
  }
};

// @desc    Delete journey entry
// @route   DELETE /api/journey/:id
// @access  Private
const deleteJourney = async (req, res) => {
  try {
    const journey = await Journey.findById(req.params.id);
    
    if (!journey) {
      return res.status(404).json({
        success: false,
        message: 'Journey entry not found'
      });
    }
    
    await journey.deleteOne();
    res.json({ success: true, message: 'Journey entry deleted successfully' });
  } catch (error) {
    console.error('Error in deleteJourney:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to delete journey entry'
    });
  }
};

module.exports = { getJourney, createJourney, updateJourney, deleteJourney };