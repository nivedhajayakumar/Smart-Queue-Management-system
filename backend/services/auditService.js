const AuditLog = require("../models/AuditLog");

async function writeAuditLog(data) {
    try {
        await AuditLog.create(data);
    } catch (error) {
        console.error("Audit log failed:", error.message);
    }
}

module.exports = {
    writeAuditLog
};
