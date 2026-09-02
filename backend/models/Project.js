const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  shortDescription: {
    type: String,
    required: true,
    maxLength: 200
  },
  fullDescription: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  },
  screenshots: [{
    type: String
  }],
  technologies: [{
    type: String
  }],
  features: [{
    type: String
  }],
  challenges: {
    type: String
  },
  solutions: {
    type: String
  },
  githubUrl: {
    type: String
  },
  liveUrl: {
    type: String
  },
  category: {
    type: String,
    required: true,
    enum: ['Full Stack', 'Frontend', 'Backend', 'React', 'MERN']
  },
  featured: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft'
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);