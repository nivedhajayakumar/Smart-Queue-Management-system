const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
    {
        invoice: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Invoice",
            required: true
        },
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },
        amount: {
            type: Number,
            required: true
        },
        paymentMode: {
            type: String,
            enum: ["Cash", "Card", "UPI", "Insurance"],
            required: true
        },
        transactionId: {
            type: String
        },
        paidAt: {
            type: Date,
            default: Date.now
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Payment", paymentSchema);
