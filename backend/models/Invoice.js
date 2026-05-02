const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true
        },
        items: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "BillingItem"
            }
        ],
        invoiceNumber: {
            type: String,
            required: true,
            unique: true
        },
        totalAmount: {
            type: Number,
            required: true
        },
        paidAmount: {
            type: Number,
            default: 0
        },
        balanceAmount: {
            type: Number,
            required: true
        },
        paymentStatus: {
            type: String,
            enum: ["Unpaid", "Partially Paid", "Paid"],
            default: "Unpaid"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Invoice", invoiceSchema);
