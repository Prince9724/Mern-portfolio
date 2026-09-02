const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Skill name is required'],
    trim: true,
    unique: true,
  },
  icon: {
    type: String,
    default: 'Code2'
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Frontend', 'Backend', 'Database', 'Tools', 'Currently Learning'],
    default: 'Frontend'
  },
  level: {
    type: Number,
    min: 1,
    max: 100,
    default: 70
  },
  displayOrder: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create model
const Skill = mongoose.model('Skill', skillSchema);
module.exports = Skill;