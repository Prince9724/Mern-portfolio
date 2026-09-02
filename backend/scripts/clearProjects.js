const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Project = require('../models/Project');

dotenv.config();

const clearProjects = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/portfolio');
    console.log('✅ Connected to MongoDB');

    const result = await Project.deleteMany({});
    console.log(`🗑️  Cleared ${result.deletedCount} projects`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing projects:', error);
    process.exit(1);
  }
};

clearProjects();