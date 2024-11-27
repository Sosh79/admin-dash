import express from 'express';
import { Admin } from '../models/Admin';

const router = express.Router();

// Get admin statistics
router.get('/admins', async (req, res) => {
  try {
    const totalAdmins = await Admin.countDocuments();
    const activeAdmins = await Admin.countDocuments({ role: 'admin' });
    const adminsByRole = await Admin.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      totalAdmins,
      activeAdmins,
      adminsByRole,
    });
  } catch (error: any) {
    res.status(500).json({ message: error.message || 'Error fetching analytics' });
  }
});

export default router;
