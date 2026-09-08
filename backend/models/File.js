const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema(
  {
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    originalName: { type: String, required: true },
    mimeType: String,
    size: Number,
    hash: { type: String, required: true, index: true },
    s3Key: { type: String, required: true },
    iv: { type: String, required: true },
    authTag: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('File', fileSchema);