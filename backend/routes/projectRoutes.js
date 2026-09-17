const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getProjects,
  getProjectBySlug,
  getAllProjectsAdmin,
  createProject,
  updateProject,
  deleteProject
} = require('../controllers/projectController');

// Admin routes
router.get('/admin/all', protect, getAllProjectsAdmin);
router.post('/', protect, createProject);
router.put('/:id', protect, updateProject);
router.delete('/:id', protect, deleteProject);

// Public routes
router.get('/', getProjects);
router.get('/:slug', getProjectBySlug);

module.exports = router;