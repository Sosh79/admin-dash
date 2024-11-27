import mongoose, { Document, Schema } from 'mongoose';

export interface ICustomer extends Document {
  name: string;
  email: string;
  phone: string;
  address: string;
}

const customerSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phone: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

export default mongoose.model<ICustomer>('Customer', customerSchema);
