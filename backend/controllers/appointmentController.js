const Patient = require("../models/Patient");
const Appointment = require("../models/Appointment");
const { runTriage } = require("../services/triageService");
const { findLeastLoadedDoctor } = require("../services/queueService");

async function bookAppointment(req, res) {
    try {
        const {
            patientId,
            appointmentType,
            appointmentDate,
            reportingTime,
            symptoms,
            vitals
        } = req.body;

        const patient = await Patient.findById(patientId);

        if (!patient) {
            return res.status(404).json({
                message: "Patient not found"
            });
        }

        const triage = runTriage({
            symptoms: symptoms || patient.symptoms,
            vitals
        });

        let department = triage.suggestedDepartment;

        if (appointmentType === "Emergency") {
            department = "Emergency";
        }

        const doctor = department === "Emergency"
            ? null
            : await findLeastLoadedDoctor(department);

        const appointment = await Appointment.create({
            patient: patient._id,
            doctor: doctor ? doctor._id : null,
            department,
            appointmentType,
            appointmentDate,
            reportingTime,
            symptoms: symptoms || patient.symptoms,
            status: appointmentType === "Walk-In" || appointmentType === "Emergency"
                ? "Checked-In"
                : "Booked"
        });

        res.status(201).json({
            message: "Appointment booked successfully",
            triage,
            appointment,
            assignedDoctor: doctor
        });
    } catch (error) {
        res.status(500).json({
            message: "Appointment booking failed",
            error: error.message
        });
    }
}

async function getAllAppointments(req, res) {
    try {
        const appointments = await Appointment.find()
            .populate("patient", "name age gender phone")
            .populate("doctor", "name specialization roomNumber")
            .sort({ appointmentDate: 1 });

        res.json({
            count: appointments.length,
            appointments
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch appointments",
            error: error.message
        });
    }
}

async function checkInAppointment(req, res) {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            {
                status: "Checked-In"
            },
            {
                new: true
            }
        );

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        res.json({
            message: "Patient checked in successfully",
            appointment
        });
    } catch (error) {
        res.status(500).json({
            message: "Check-in failed",
            error: error.message
        });
    }
}

async function cancelAppointment(req, res) {
    try {
        const appointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            {
                status: "Cancelled"
            },
            {
                new: true
            }
        );

        if (!appointment) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        res.json({
            message: "Appointment cancelled successfully",
            appointment
        });
    } catch (error) {
        res.status(500).json({
            message: "Appointment cancellation failed",
            error: error.message
        });
    }
}

module.exports = {
    bookAppointment,
    getAllAppointments,
    checkInAppointment,
    cancelAppointment
};
