const Skill = require('../models/Skill');

// @desc    Get all skills
// @route   GET /api/skills
// @access  Public
const getSkills = async (req, res) => {
  try {
    console.log('📊 Fetching skills...');
    const skills = await Skill.find().sort({ displayOrder: 1, createdAt: 1 });
    console.log(`✅ Found ${skills.length} skills`);
    
    res.status(200).json({ 
      success: true, 
      count: skills.length, 
      data: skills 
    });
  } catch (error) {
    console.error('❌ Error in getSkills:', error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to fetch skills'
    });
  }
};

// @desc    Create skill
// @route   POST /api/skills
// @access  Private
const createSkill = async (req, res) => {
  try {
    console.log('📝 Creating skill:', req.body);
    
    const { name, category, level, displayOrder, icon } = req.body;
    
    if (!name || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name and category are required'
      });
    }

    // Check if skill already exists
    const existingSkill = await Skill.findOne({ name: name.trim() });
    if (existingSkill) {
      return res.status(400).json({
        success: false,
        message: `Skill "${name}" already exists`
      });
    }

    const skill = await Skill.create({
      name: name.trim(),
      category,
      level: level || 70,
      displayOrder: displayOrder || 0,
      icon: icon || 'Code2'
    });
    
    console.log('✅ Skill created:', skill);
    res.status(201).json({ success: true, data: skill });
  } catch (error) {
    console.error('❌ Error in createSkill:', error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to create skill'
    });
  }
};

// @desc    Update skill
// @route   PUT /api/skills/:id
// @access  Private
const updateSkill = async (req, res) => {
  try {
    console.log('📝 Updating skill:', req.params.id, req.body);
    
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }

    // Check for duplicate name
    if (req.body.name && req.body.name !== skill.name) {
      const existingSkill = await Skill.findOne({ 
        name: req.body.name.trim(),
        _id: { $ne: req.params.id }
      });
      if (existingSkill) {
        return res.status(400).json({
          success: false,
          message: `Skill "${req.body.name}" already exists`
        });
      }
    }

    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    console.log('✅ Skill updated:', updatedSkill);
    res.json({ success: true, data: updatedSkill });
  } catch (error) {
    console.error('❌ Error in updateSkill:', error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to update skill'
    });
  }
};

// @desc    Delete skill
// @route   DELETE /api/skills/:id
// @access  Private
const deleteSkill = async (req, res) => {
  try {
    console.log('🗑️ Deleting skill:', req.params.id);
    
    const skill = await Skill.findById(req.params.id);
    
    if (!skill) {
      return res.status(404).json({
        success: false,
        message: 'Skill not found'
      });
    }
    
    await Skill.findByIdAndDelete(req.params.id);
    console.log('✅ Skill deleted');
    res.json({ success: true, message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('❌ Error in deleteSkill:', error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message || 'Failed to delete skill'
    });
  }
};

module.exports = { getSkills, createSkill, updateSkill, deleteSkill };