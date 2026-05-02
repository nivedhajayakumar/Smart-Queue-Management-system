const mongoose = require("mongoose");

const billingItemSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },
        visitId: {
            type: mongoose.Schema.Types.ObjectId
        },
        sourceType: {
            type: String,
            enum: ["Consultation", "Lab", "Pharmacy", "Emergency", "Other"],
            required: true
        },
        sourceId: {
            type: mongoose.Schema.Types.ObjectId
        },
        description: {
            type: String,
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ["Unbilled", "Billed", "Paid", "Cancelled"],
            default: "Unbilled"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("BillingItem", billingItemSchema);
