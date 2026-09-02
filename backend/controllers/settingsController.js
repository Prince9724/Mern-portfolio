const SiteSettings = require('../models/SiteSettings');

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    console.log('📊 Fetching settings...');
    let settings = await SiteSettings.findOne();
    
    if (!settings) {
      console.log('📝 Creating default settings...');
      settings = await SiteSettings.create({});
    }
    
    res.json({ success: true, data: settings });
  } catch (error) {
    console.error('❌ Error in getSettings:', error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch settings'
    });
  }
};

// @desc    Update settings
// @route   PUT /api/admin/settings
// @access  Private
const updateSettings = async (req, res) => {
  try {
    console.log('📝 Updating settings...');
    
    let settings = await SiteSettings.findOne();
    
    if (!settings) {
      settings = new SiteSettings();
    }
    
    // Update each section
    if (req.body.hero) settings.hero = { ...settings.hero, ...req.body.hero };
    if (req.body.about) settings.about = { ...settings.about, ...req.body.about };
    if (req.body.social) settings.social = { ...settings.social, ...req.body.social };
    if (req.body.seo) settings.seo = { ...settings.seo, ...req.body.seo };
    if (req.body.general) settings.general = { ...settings.general, ...req.body.general };
    
    await settings.save();
    console.log('✅ Settings updated');
    
    res.json({ 
      success: true, 
      message: 'Settings updated successfully',
      data: settings 
    });
  } catch (error) {
    console.error('❌ Error in updateSettings:', error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to update settings'
    });
  }
};

module.exports = { getSettings, updateSettings };