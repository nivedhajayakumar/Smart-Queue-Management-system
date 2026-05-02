const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        age: {
            type: Number,
            required: true
        },
        gender: {
            type: String,
            enum: ["Male", "Female", "Other"],
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        address: {
            type: String
        },
        symptoms: {
            type: String,
            required: true
        },
        visitType: {
            type: String,
            enum: ["Fresh", "Revisit", "Emergency"],
            required: true
        },
        department: {
            type: String,
            required: true
        },
        tokenNumber: {
            type: Number
        },
        status: {
            type: String,
            enum: ["Waiting", "In Consultation", "Completed", "Emergency"],
            default: "Waiting"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Patient", patientSchema);
