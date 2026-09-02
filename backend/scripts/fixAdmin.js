const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

dotenv.config();

const fixAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing admin
    await Admin.deleteMany({});
    console.log('🗑️  Removed existing admins');

    // Create new admin
    const admin = await Admin.create({
      name: 'Prince Gond',
      email: 'admin@princegond.com',
      password: 'Prince@123456',
      role: 'admin',
      isActive: true
    });

    console.log('✅ Admin created successfully!');
    console.log('📧 Email: admin@princegond.com');
    console.log('🔑 Password: Prince@123456');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixAdmin();