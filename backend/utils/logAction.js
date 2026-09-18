const ActivityLog = require('../models/ActivityLog');

async function logAction(userId, action, fileId = null, fileName = null) {
  await ActivityLog.create({ user: userId, action, fileId, fileName });
}

module.exports = logAction;