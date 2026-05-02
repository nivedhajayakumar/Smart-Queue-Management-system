const mongoose = require("mongoose");

const labOrderSchema = new mongoose.Schema(
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
        tests: {
            type: [String],
            required: true
        },
        priority: {
            type: String,
            enum: ["Routine", "Urgent"],
            default: "Routine"
        },
        status: {
            type: String,
            enum: ["Requested", "Sample Collected", "Report Ready"],
            default: "Requested"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("LabOrder", labOrderSchema);
