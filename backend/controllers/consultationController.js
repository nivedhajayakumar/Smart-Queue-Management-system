const Consultation = require("../models/Consultation");
const Prescription = require("../models/Prescription");
const LabOrder = require("../models/LabOrder");
const FollowUp = require("../models/FollowUp");
const Token = require("../models/Token");
const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const PharmacyOrder = require("../models/PharmacyOrder");
const BillingItem = require("../models/BillingItem");

async function getDoctorDashboard(req, res) {
    try {
        const { doctorId } = req.params;

        const waitingTokens = await Token.find({
            doctor: doctorId,
            status: {
                $in: ["Waiting", "Called", "In Consultation"]
            }
        })
            .populate("patient", "name age gender phone symptoms visitType")
            .sort({
                priority: 1,
                tokenNumber: 1,
                createdAt: 1
            });

        const completedToday = await Consultation.countDocuments({
            doctor: doctorId,
            status: "Completed",
            completedAt: {
                $gte: new Date(new Date().setHours(0, 0, 0, 0))
            }
        });

        res.json({
            doctorId,
            queueCount: waitingTokens.length,
            completedToday,
            queue: waitingTokens
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to load doctor dashboard",
            error: error.message
        });
    }
}

async function startConsultation(req, res) {
    try {
        const {
            patientId,
            doctorId,
            tokenId,
            symptoms,
            diagnosis,
            notes
        } = req.body;

        const patient = await Patient.findById(patientId);
        const doctor = await Doctor.findById(doctorId);
        const token = await Token.findById(tokenId);

        // 1️⃣ Basic checks
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        if (!token) {
            return res.status(404).json({ message: "Token not found" });
        }

        // 2️⃣ Validate token belongs to patient
        if (token.patient.toString() !== patientId) {
            return res.status(400).json({
                message: "Token does not belong to this patient"
            });
        }

        // 3️⃣ Validate doctor is assigned to this token
        if (!token.doctor || token.doctor.toString() !== doctorId) {
            return res.status(400).json({
                message: "Doctor not assigned for this patient"
            });
        }

        // 4️⃣ Prevent duplicate consultation
        const existing = await Consultation.findOne({ token: tokenId });

        if (existing) {
            return res.status(400).json({
                message: "Consultation already started for this token"
            });
        }

        // 5️⃣ Create consultation
        const consultation = await Consultation.create({
            patient: patientId,
            doctor: doctorId,
            token: tokenId,
            symptoms,
            diagnosis,
            notes,
            status: "In Progress"
        });

        // 6️⃣ Update token status
        await Token.findByIdAndUpdate(tokenId, {
            status: "In Consultation"
        });

        res.status(201).json({
            message: "Consultation started successfully",
            consultation
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to start consultation",
            error: error.message
        });
    }
}

async function addPrescription(req, res) {
    try {
        const {
            consultationId,
            patientId,
            doctorId,
            medicines,
            advice
        } = req.body;

        const prescription = await Prescription.create({
            consultation: consultationId,
            patient: patientId,
            doctor: doctorId,
            medicines,
            advice
        });

        const pharmacyMedicines = medicines.map((medicine) => ({
            medicineName: medicine.medicineName,
            dosage: medicine.dosage,
            frequency: medicine.frequency,
            duration: medicine.duration,
            quantity: medicine.quantity || 1,
            price: medicine.price || 0
        }));

        const totalAmount = pharmacyMedicines.reduce(
            (sum, medicine) => sum + medicine.quantity * medicine.price,
            0
        );

        const pharmacyOrder = await PharmacyOrder.create({
            prescription: prescription._id,
            patient: patientId,
            doctor: doctorId,
            medicines: pharmacyMedicines,
            totalAmount
        });

        if (totalAmount > 0) {
            await BillingItem.create({
                patient: patientId,
                sourceType: "Pharmacy",
                sourceId: pharmacyOrder._id,
                description: "Pharmacy medicines",
                amount: totalAmount
            });
        }

        res.status(201).json({
            message: "Prescription added and pharmacy order created successfully",
            prescription,
            pharmacyOrder
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to add prescription",
            error: error.message
        });
    }
}

async function requestLabTests(req, res) {
    try {
        const {
            consultationId,
            patientId,
            doctorId,
            tests,
            priority,
            amount
        } = req.body;

        const lastLabOrder = await LabOrder.findOne()
            .sort({ labTokenNumber: -1 });

        const labTokenNumber = lastLabOrder
            ? lastLabOrder.labTokenNumber + 1
            : 1;

        const labOrder = await LabOrder.create({
            consultation: consultationId,
            patient: patientId,
            doctor: doctorId,
            tests,
            priority,
            labTokenNumber
        });

        if (amount && amount > 0) {
            await BillingItem.create({
                patient: patientId,
                sourceType: "Lab",
                sourceId: labOrder._id,
                description: `Lab tests: ${tests.join(", ")}`,
                amount
            });
        }

        res.status(201).json({
            message: "Lab tests requested successfully",
            labOrder
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to request lab tests",
            error: error.message
        });
    }
}


async function scheduleFollowUp(req, res) {
    try {
        const {
            patientId,
            doctorId,
            consultationId,
            followUpDate,
            reason
        } = req.body;

        const followUp = await FollowUp.create({
            patient: patientId,
            doctor: doctorId,
            consultation: consultationId,
            followUpDate,
            reason
        });

        res.status(201).json({
            message: "Follow-up scheduled successfully",
            followUp
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to schedule follow-up",
            error: error.message
        });
    }
}

async function completeConsultation(req, res) {
    try {
        const consultation = await Consultation.findByIdAndUpdate(
            req.params.id,
            {
                status: "Completed",
                completedAt: new Date()
            },
            {
                new: true
            }
        );

        if (!consultation) {
            return res.status(404).json({
                message: "Consultation not found"
            });
        }

        if (consultation.token) {
            await Token.findByIdAndUpdate(consultation.token, {
                status: "Completed",
                completedAt: new Date()
            });
        }

        res.json({
            message: "Consultation completed successfully",
            consultation
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to complete consultation",
            error: error.message
        });
    }
}

async function getPatientMedicalHistory(req, res) {
    try {
        const { patientId } = req.params;

        const consultations = await Consultation.find({ patient: patientId })
            .populate("doctor", "name specialization department")
            .sort({ createdAt: -1 });

        const prescriptions = await Prescription.find({ patient: patientId })
            .populate("doctor", "name specialization")
            .sort({ createdAt: -1 });

        const labOrders = await LabOrder.find({ patient: patientId })
            .populate("doctor", "name specialization")
            .sort({ createdAt: -1 });

        const followUps = await FollowUp.find({ patient: patientId })
            .populate("doctor", "name specialization")
            .sort({ followUpDate: -1 });

        res.json({
            patientId,
            consultations,
            prescriptions,
            labOrders,
            followUps
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch patient medical history",
            error: error.message
        });
    }
}

module.exports = {
    getDoctorDashboard,
    startConsultation,
    addPrescription,
    requestLabTests,
    scheduleFollowUp,
    completeConsultation,
    getPatientMedicalHistory
};
