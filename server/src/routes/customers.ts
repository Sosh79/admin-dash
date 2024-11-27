import express from 'express';
import Customer from '../models/Customer';
import { protect } from '../middleware/auth';

const router = express.Router();

// Get all customers
router.get('/', protect, async (req, res) => {
  try {
    const customers = await Customer.find().sort({ createdAt: -1 });
    res.json(customers);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new customer
router.post('/', protect, async (req, res) => {
  try {
    const customer = new Customer(req.body);
    const newCustomer = await customer.save();
    res.status(201).json(newCustomer);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Update a customer
router.put('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    Object.assign(customer, req.body);
    const updatedCustomer = await customer.save();
    res.json(updatedCustomer);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a customer
router.delete('/:id', protect, async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    await customer.deleteOne();
    res.json({ message: 'Customer deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
