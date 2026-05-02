const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
    {
        medicineName: {
            type: String,
            required: true
        },
        dosage: {
            type: String,
            required: true
        },
        frequency: {
            type: String,
            required: true
        },
        duration: {
            type: String,
            required: true
        },
        instructions: {
            type: String
        }
    },
    {
        _id: false
    }
);

const prescriptionSchema = new mongoose.Schema(
    {
        consultation: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Consultation",
            required: true
        },
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
        medicines: {
            type: [medicineSchema],
            default: []
        },
        advice: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
