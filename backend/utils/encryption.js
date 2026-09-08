const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY, 'hex');

function encryptBuffer(buffer) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return { encryptedData: encrypted, iv: iv.toString('hex'), authTag: authTag.toString('hex') };
}

function decryptBuffer(encryptedBuffer, ivHex, authTagHex) {
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, Buffer.from(ivHex, 'hex'));
  decipher.setAuthTag(Buffer.from(authTagHex, 'hex'));
  return Buffer.concat([decipher.update(encryptedBuffer), decipher.final()]);
}

module.exports = { encryptBuffer, decryptBuffer };