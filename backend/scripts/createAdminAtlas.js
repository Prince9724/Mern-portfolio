const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB Atlas
    console.log('📊 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin exists
    const adminExists = await Admin.findOne({ email: 'admin@princegond.com' });
    
    if (adminExists) {
      console.log('✅ Admin already exists:');
      console.log(`   Email: ${adminExists.email}`);
      
      // Update password if needed
      adminExists.password = 'Prince@123456';
      await adminExists.save();
      console.log('✅ Admin password reset to: Prince@123456');
    } else {
      // Create new admin
      const admin = await Admin.create({
        name: 'Prince Gond',
        email: 'admin@princegond.com',
        password: 'Prince@123456',
        role: 'admin',
        isActive: true
      });

      console.log('✅ Admin created successfully:');
      console.log(`   Email: ${admin.email}`);
      console.log(`   Password: Prince@123456`);
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();