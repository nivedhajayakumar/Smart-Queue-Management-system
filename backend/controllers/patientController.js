const Patient = require("../models/Patient");

function assignDepartment(symptoms) {
    const text = symptoms.toLowerCase();

    if (text.includes("heart") || text.includes("chest pain")) {
        return "Cardiology";
    }

    if (text.includes("skin") || text.includes("rash")) {
        return "Dermatology";
    }

    if (text.includes("bone") || text.includes("fracture")) {
        return "Orthopedics";
    }

    if (text.includes("child") || text.includes("baby")) {
        return "Pediatrics";
    }

    return "General Medicine";
}

async function generateToken(department) {
    const lastPatient = await Patient.findOne({ department })
        .sort({ tokenNumber: -1 });

    return lastPatient ? lastPatient.tokenNumber + 1 : 1;
}

async function createPatient(req, res) {
    try {
        const {
            name,
            age,
            gender,
            phone,
            address,
            symptoms,
            visitType
        } = req.body;

        let department = assignDepartment(symptoms);
        let tokenNumber = null;
        let status = "Waiting";

        if (visitType === "Emergency") {
            department = "Emergency";
            status = "Emergency";
        } else {
            tokenNumber = await generateToken(department);
        }

        const patient = await Patient.create({
            name,
            age,
            gender,
            phone,
            address,
            symptoms,
            visitType,
            department,
            tokenNumber,
            status
        });

        res.status(201).json({
            message: "Patient registered successfully",
            patient
        });
    } catch (error) {
        res.status(500).json({
            message: "Patient registration failed",
            error: error.message
        });
    }
}

async function getAllPatients(req, res) {
    try {
        const patients = await Patient.find().sort({ createdAt: -1 });

        res.json({
            count: patients.length,
            patients
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch patients",
            error: error.message
        });
    }
}

async function getPatientById(req, res) {
    try {
        const patient = await Patient.findById(req.params.id);

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        res.json(patient);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch patient",
            error: error.message
        });
    }
}

async function updatePatientStatus(req, res) {
    try {
        const { status } = req.body;

        const patient = await Patient.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        res.json({
            message: "Patient status updated successfully",
            patient
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update patient status",
            error: error.message
        });
    }
}

module.exports = {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatientStatus
};
