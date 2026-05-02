const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient"
        },
        recipientPhone: {
            type: String
        },
        recipientEmail: {
            type: String
        },
        channel: {
            type: String,
            enum: ["SMS", "WhatsApp", "Push", "Email"],
            required: true
        },
        title: {
            type: String,
            required: true
        },
        message: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ["Pending", "Sent", "Failed"],
            default: "Pending"
        },
        sentAt: {
            type: Date
        },
        failureReason: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Notification", notificationSchema);
