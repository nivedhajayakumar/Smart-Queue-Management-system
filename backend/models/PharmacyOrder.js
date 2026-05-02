const mongoose = require("mongoose");

const pharmacyMedicineSchema = new mongoose.Schema(
    {
        medicineName: {
            type: String,
            required: true
        },
        dosage: {
            type: String
        },
        frequency: {
            type: String
        },
        duration: {
            type: String
        },
        quantity: {
            type: Number,
            default: 1
        },
        price: {
            type: Number,
            default: 0
        }
    },
    {
        _id: false
    }
);

const pharmacyOrderSchema = new mongoose.Schema(
    {
        prescription: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Prescription",
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
            type: [pharmacyMedicineSchema],
            default: []
        },
        status: {
            type: String,
            enum: ["Pending", "Ready", "Dispensed", "Cancelled"],
            default: "Pending"
        },
        totalAmount: {
            type: Number,
            default: 0
        },
        dispensedAt: {
            type: Date
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("PharmacyOrder", pharmacyOrderSchema);
