const mongoose = require("mongoose");

const tokenSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },
        appointment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Appointment"
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor"
        },
        department: {
            type: String,
            required: true
        },
        tokenNumber: {
            type: Number
        },
        priority: {
            type: Number,
            default: 3
        },
        visitType: {
            type: String,
            enum: ["Fresh", "Revisit", "Emergency"],
            required: true
        },
        status: {
            type: String,
            enum: [
                "Waiting",
                "Called",
                "In Consultation",
                "Completed",
                "Missed",
                "Cancelled"
            ],
            default: "Waiting"
        },
        estimatedWaitMinutes: {
            type: Number,
            default: 0
        },
        checkedInAt: {
            type: Date
        },
        calledAt: {
            type: Date
        },
        completedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Token", tokenSchema);
