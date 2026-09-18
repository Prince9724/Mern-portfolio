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

    // Hero
    if (req.body.hero) {
      settings.hero = { ...settings.hero.toObject(), ...req.body.hero };
    }

    // About (with nested stats)
    if (req.body.about) {
      const currentAbout = settings.about.toObject();
      settings.about = {
        ...currentAbout,
        ...req.body.about,
        stats: {
          ...(currentAbout.stats || {}),
          ...(req.body.about.stats || {}),
        },
      };
    }

    // Social
    if (req.body.social) {
      settings.social = { ...settings.social.toObject(), ...req.body.social };
    }

    // SEO
    if (req.body.seo) {
      settings.seo = { ...settings.seo.toObject(), ...req.body.seo };
    }

    // General
    if (req.body.general) {
      settings.general = { ...settings.general.toObject(), ...req.body.general };
    }

    settings.markModified('hero');
    settings.markModified('about');
    settings.markModified('social');
    settings.markModified('seo');
    settings.markModified('general');

    await settings.save();
    console.log('✅ Settings updated');

    res.json({
      success: true,
      message: 'Settings updated successfully',
      data: settings
    });
  } catch (error) {
    console.error('❌ Error in updateSettings:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update settings'
    });
  }
};

module.exports = { getSettings, updateSettings };