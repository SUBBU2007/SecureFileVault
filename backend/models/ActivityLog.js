const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'File' },
  fileName: { type: String }, // snapshot at time of action — survives file deletion
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', logSchema);