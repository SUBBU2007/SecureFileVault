const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true }, // 'upload', 'download', 'delete', 'admin_delete'
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', logSchema);