const express = require('express');
const User = require('../models/User');
const File = require('../models/File');
const ActivityLog = require('../models/ActivityLog');
const { verifyToken, requireAdmin } = require('../middleware/authMiddleware');
const logAction = require('../utils/logAction');

const router = express.Router();

// All routes here require both a valid token AND admin role
router.use(verifyToken, requireAdmin);

router.get('/users', async (req, res) => {
  const users = await User.find().select('-password');
  res.json({ users });
});

router.get('/storage-stats', async (req, res) => {
  const totalFiles = await File.countDocuments();
  const totalSize = await File.aggregate([{ $group: { _id: null, total: { $sum: '$size' } } }]);
  res.json({ totalFiles, totalSizeBytes: totalSize[0]?.total || 0 });
});

router.delete('/files/:fileId', async (req, res) => {
  const file = await File.findByIdAndDelete(req.params.fileId);
  if (!file) return res.status(404).json({ message: 'File not found' });
  await logAction(req.user.userId, 'admin_delete', req.params.fileId, file.originalName);

  res.json({ message: 'File removed by admin', fileId: req.params.fileId });
});

router.get('/logs', async (req, res) => {
  const logs = await ActivityLog.find().populate('user', 'email').sort({ createdAt: -1 }).limit(100);
  res.json({ logs });
});

module.exports = router;