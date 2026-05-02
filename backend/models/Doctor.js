const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        specialization: {
            type: String,
            required: true
        },
        department: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        roomNumber: {
            type: String,
            required: true
        },
        availabilityStatus: {
            type: String,
            enum: ["Available", "Unavailable"],
            default: "Available"
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("Doctor", doctorSchema);
