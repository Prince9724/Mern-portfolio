const Project = require('../models/Project');
const slugify = require('slugify');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const { category, featured, status } = req.query;
    let filter = {};
    
    // If status is not specified, show both draft and published
    // But for public, only show published
    if (!req.query.public) {
      // Public route - only show published
      filter.status = 'published';
    }

    if (category) filter.category = category;
    if (featured === 'true') filter.featured = true;
    // If status is explicitly passed in query
    if (status) filter.status = status;

    console.log('📊 Fetching projects with filter:', filter);
    
    const projects = await Project.find(filter)
      .sort({ featured: -1, displayOrder: 1, createdAt: -1 });

    console.log(`✅ Found ${projects.length} projects`);

    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('❌ Error in getProjects:', error.message);
    res.status(200).json({
      success: true,
      count: 0,
      data: []
    });
  }
};

// @desc    Get single project by slug
// @route   GET /api/projects/:slug
// @access  Public
const getProjectBySlug = async (req, res) => {
  try {
    const project = await Project.findOne({ 
      slug: req.params.slug,
      status: 'published'
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('❌ Error in getProjectBySlug:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get ALL projects for admin (including drafts)
// @route   GET /api/projects/admin/all
// @access  Private
const getAllProjectsAdmin = async (req, res) => {
  try {
    const projects = await Project.find({})
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: projects.length,
      data: projects
    });
  } catch (error) {
    console.error('❌ Error in getAllProjectsAdmin:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create project
// @route   POST /api/projects
// @access  Private
const createProject = async (req, res) => {
  try {
    const { title, ...rest } = req.body;
    
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const slug = slugify(title, { lower: true, strict: true });

    const existing = await Project.findOne({ slug });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'A project with this title already exists'
      });
    }

    const project = await Project.create({ title, slug, ...rest });

    console.log('✅ Project created:', project.title);

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      data: project
    });
  } catch (error) {
    console.error('❌ Error in createProject:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private
const updateProject = async (req, res) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    if (req.body.title && req.body.title !== project.title) {
      req.body.slug = slugify(req.body.title, { lower: true, strict: true });
      
      const existing = await Project.findOne({ 
        slug: req.body.slug,
        _id: { $ne: req.params.id }
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'A project with this title already exists'
        });
      }
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    console.log('✅ Project updated:', project.title);

    res.json({
      success: true,
      message: 'Project updated successfully',
      data: project
    });
  } catch (error) {
    console.error('❌ Error in updateProject:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await project.deleteOne();

    console.log('🗑️ Project deleted:', project.title);

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    console.error('❌ Error in deleteProject:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getProjects,
  getProjectBySlug,
  getAllProjectsAdmin,
  createProject,
  updateProject,
  deleteProject
};