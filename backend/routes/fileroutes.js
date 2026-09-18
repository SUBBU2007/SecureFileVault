const express = require('express');
const crypto = require('crypto');
const multer = require('multer');
const File = require('../models/File');
const { verifyToken } = require('../middleware/authMiddleware');
const { encryptBuffer } = require('../utils/encryption');
const { uploadToS3 } = require('../utils/s3');
const { getFromS3 } = require('../utils/s3');
const { decryptBuffer } = require('../utils/encryption');
const logAction = require('../utils/logAction');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });

router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const hash = crypto.createHash('sha256').update(req.file.buffer).digest('hex');
    const existing = await File.findOne({ hash });

    let s3Key, iv, authTag;
    if (existing) {
      s3Key = existing.s3Key;
      iv = existing.iv;
      authTag = existing.authTag;
    } else {
      const encrypted = encryptBuffer(req.file.buffer);
      s3Key = `files/${hash}`;
      iv = encrypted.iv;
      authTag = encrypted.authTag;
      await uploadToS3(encrypted.encryptedData, s3Key);
    }

    const fileDoc = await File.create({
      owner: req.user.userId,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      hash, s3Key, iv, authTag,
    });

    await logAction(req.user.userId, 'upload', fileDoc._id, fileDoc.originalName);
    res.status(201).json({
      message: existing ? 'Duplicate detected — storage reused' : 'File uploaded and encrypted',
      file: fileDoc,
    });
  } catch (err) {
    res.status(500).json({ message: 'Upload failed', error: err.message });
  }
});

router.get('/download/:fileId', verifyToken, async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });

    // Ownership check — this is your RBAC-at-the-resource-level proof
    if (file.owner.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied' });
    }

    const encryptedData = await getFromS3(file.s3Key);
    const decrypted = decryptBuffer(encryptedData, file.iv, file.authTag);

    await logAction(req.user.userId, 'download', file._id, file.originalName);

    res.set('Content-Type', file.mimeType);
    res.set('Content-Disposition', `attachment; filename="${file.originalName}"`);
    res.send(decrypted);

    
  } catch (err) {
    res.status(500).json({ message: 'Download failed', error: err.message });
  }
});

router.get('/my-files', verifyToken, async (req, res) => {
  try {
    const files = await File.find({ owner: req.user.userId }).sort({ createdAt: -1 });
    res.json({ files });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch files', error: err.message });
  }
});

router.delete('/:fileId', verifyToken, async (req, res) => {
  try {
    const file = await File.findById(req.params.fileId);
    if (!file) return res.status(404).json({ message: 'File not found' });
    if (file.owner.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await File.findByIdAndDelete(req.params.fileId);
    await logAction(req.user.userId, 'delete', req.params.fileId, file.originalName);
    res.json({ message: 'File deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Delete failed', error: err.message });
  }
});

module.exports = router;