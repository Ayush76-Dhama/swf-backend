const mongoose = require('mongoose');
const Admin = require('../models/admin');
require('dotenv').config();
const bcrypt = require('bcrypt');

const seedAdmin = async () => {
  try {
    // Set default MongoDB URI if not defined
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/swf';
    
    console.log('Connecting to MongoDB...');
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB successfully');

    // Check if admin already exists
    console.log('Checking for existing admin user...');
    const existingAdmin = await Admin.findOne({ email: 'admin@swf.com' });
    
    if (existingAdmin) {
      console.log('Admin user already exists, updating...');
      existingAdmin.password = await bcrypt.hash('Admin@123', 10);
      existingAdmin.name = 'Admin User';
      existingAdmin.username = 'admin'; 
      await existingAdmin.save();
      console.log('Admin user updated successfully');
    } else {
      console.log('Creating new admin user...');
      // Create admin user
      const adminUser = new Admin({
        username: 'admin',
        name: 'Admin User',
        email: 'admin@swf.com',
        password: 'Admin@123',
        role: 'admin'
      });

      await adminUser.save();
      console.log('Admin user created successfully');
    }

    console.log('Seeding completed successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin user:', error);
    process.exit(1);
  }
};

seedAdmin();
