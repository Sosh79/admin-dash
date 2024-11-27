import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin';
import dotenv from 'dotenv';

dotenv.config();

const createAdmin = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/admin-dashboard');
    console.log('Connected to MongoDB...');

    // Admin credentials
    const adminData = {
      name: 'Admin User',
      email: 'admin@gmail.com',
      password: 'admin123',
      role: 'admin'
    };

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('Admin already exists with this email');
      process.exit(0);
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(adminData.password, salt);

    // Create new admin
    const admin = new Admin({
      ...adminData,
      password: hashedPassword
    });

    await admin.save();
    console.log('Admin created successfully!');
    console.log('Email:', adminData.email);
    console.log('Password:', adminData.password);

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
};

createAdmin();
// for creating admin
// npx ts-node src/scripts/createAdmin.ts