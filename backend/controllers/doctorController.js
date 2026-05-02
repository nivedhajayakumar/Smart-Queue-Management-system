const Doctor = require("../models/Doctor");

async function createDoctor(req, res) {
    try {
        const doctor = await Doctor.create(req.body);

        res.status(201).json({
            message: "Doctor added successfully",
            doctor
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add doctor",
            error: error.message
        });
    }
}

async function getAllDoctors(req, res) {
    try {
        const doctors = await Doctor.find().sort({ createdAt: -1 });

        res.json({
            count: doctors.length,
            doctors
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch doctors",
            error: error.message
        });
    }
}

async function getDoctorsByDepartment(req, res) {
    try {
        const doctors = await Doctor.find({
            department: req.params.department,
            availabilityStatus: "Available"
        });

        res.json({
            count: doctors.length,
            doctors
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch department doctors",
            error: error.message
        });
    }
}

async function updateDoctorAvailability(req, res) {
    try {
        const { availabilityStatus } = req.body;

        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            { availabilityStatus },
            { new: true }
        );

        if (!doctor) {
            return res.status(404).json({
                message: "Doctor not found"
            });
        }

        res.json({
            message: "Doctor availability updated",
            doctor
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update doctor availability",
            error: error.message
        });
    }
}

module.exports = {
    createDoctor,
    getAllDoctors,
    getDoctorsByDepartment,
    updateDoctorAvailability
};
