const mongoose = require("mongoose");

const consultationSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true
        },
        token: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Token"
        },
        symptoms: {
            type: String,
            required: true
        },
        diagnosis: {
            type: String,
            required: true
        },
        notes: {
            type: String
        },
        status: {
            type: String,
            enum: ["In Progress", "Completed"],
            default: "In Progress"
        },
        completedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Consultation", consultationSchema);
