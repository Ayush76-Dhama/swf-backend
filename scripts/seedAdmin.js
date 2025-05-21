const mongoose = require('mongoose');
const Admin = require('../models/admin');
require('dotenv').config();

const seedAdmin = async () => {
  try {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/swf';
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const email = 'admin@swf.com'; // Keep consistent
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      existingAdmin.password = 'Admin@123'; // Let schema pre-save handle hashing
      existingAdmin.username = 'admin';
      await existingAdmin.save();
      console.log('Admin user updated successfully');
    } else {
      const newAdmin = new Admin({
        username: 'admin',
        email,
        password: 'Admin@123',
        role: 'admin',
      });
      await newAdmin.save();
      console.log('Admin user created successfully');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

seedAdmin();
