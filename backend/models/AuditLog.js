const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        role: {
            type: String
        },
        action: {
            type: String,
            required: true
        },
        method: {
            type: String
        },
        path: {
            type: String
        },
        resourceType: {
            type: String
        },
        resourceId: {
            type: String
        },
        ipAddress: {
            type: String
        },
        statusCode: {
            type: Number
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
