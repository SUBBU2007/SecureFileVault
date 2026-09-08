const ActivityLog = require('../models/ActivityLog');

async function logAction(userId, action, fileId = null) {
  await ActivityLog.create({ user: userId, action, fileId });
}

module.exports = logAction;