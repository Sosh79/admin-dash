import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    default: 'admin'
  }
}, {
  timestamps: true
});

// Remove password when converting to JSON
adminSchema.methods.toJSON = function() {
  const admin = this.toObject();
  delete admin.password;
  return admin;
};

export const Admin = mongoose.model('Admin', adminSchema);
