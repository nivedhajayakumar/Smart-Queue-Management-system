const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor"
        },
        department: {
            type: String,
            required: true
        },
        appointmentType: {
            type: String,
            enum: ["Online", "Walk-In", "Revisit", "Emergency"],
            required: true
        },
        appointmentDate: {
            type: Date,
            required: true
        },
        reportingTime: {
            type: String
        },
        symptoms: {
            type: String
        },
        status: {
            type: String,
            enum: ["Booked", "Checked-In", "Cancelled", "Completed"],
            default: "Booked"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Appointment", appointmentSchema);
