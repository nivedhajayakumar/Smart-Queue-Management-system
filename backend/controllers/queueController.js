const Token = require("../models/Token");
const Appointment = require("../models/Appointment");
const Patient = require("../models/Patient");

const { runTriage } = require("../services/triageService");
const { notifyPatient } = require("../services/notificationService");

const {
    generateTokenNumber,
    calculatePriority,
    calculateEstimatedWait,
    findLeastLoadedDoctor,
    recalculateQueueWaitTimes
} = require("../services/queueService");

async function createToken(req, res) {
    try {
        const {
            patientId,
            appointmentId,
            visitType,
            symptoms,
            vitals
        } = req.body;

        const patient = await Patient.findById(patientId);

        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        let appointment = null;

        if (appointmentId) {
            appointment = await Appointment.findById(appointmentId);
        }

        const triage = runTriage({
            symptoms: symptoms || patient.symptoms,
            vitals
        });

        let department = appointment
            ? appointment.department
            : triage.suggestedDepartment;

        if (visitType === "Emergency" || triage.urgencyLevel === "Emergency") {
            department = "Emergency";
        }

        const doctor = appointment && appointment.doctor
            ? appointment.doctor
            : department === "Emergency"
                ? null
                : await findLeastLoadedDoctor(department);

        const priority = calculatePriority({
            visitType,
            urgencyLevel: triage.urgencyLevel
        });

        const tokenNumber = department === "Emergency"
            ? null
            : await generateTokenNumber(department);

        const estimatedWaitMinutes = department === "Emergency"
            ? 0
            : await calculateEstimatedWait(department, priority);

        const token = await Token.create({
            patient: patient._id,
            appointment: appointment ? appointment._id : null,
            doctor: doctor ? doctor._id || doctor : null,
            department,
            tokenNumber,
            priority,
            visitType,
            estimatedWaitMinutes,
            checkedInAt: new Date(),
            status: department === "Emergency" ? "In Consultation" : "Waiting"
        });

        await Patient.findByIdAndUpdate(patient._id, {
            department,
            tokenNumber,
            status: token.status
        });

        if (department !== "Emergency") {
            await recalculateQueueWaitTimes(department);
        }

        // 🔔 NOTIFICATION: Token Generated
        await notifyPatient({
            patient: patient._id,
            recipientPhone: patient.phone,
            channel: "SMS",
            title: "Token Generated",
            message: department === "Emergency"
                ? "You have been moved directly to Emergency."
                : `Your token number is ${tokenNumber} for ${department}. Estimated wait time is ${estimatedWaitMinutes} minutes.`
        });

        res.status(201).json({
            message: "Smart token generated successfully",
            triage,
            token
        });

    } catch (error) {
        res.status(500).json({
            message: "Token generation failed",
            error: error.message
        });
    }
}

async function getDepartmentQueue(req, res) {
    try {
        const queue = await Token.find({
            department: req.params.department,
            status: { $in: ["Waiting", "Called", "In Consultation"] }
        })
            .populate("patient", "name age gender phone symptoms")
            .populate("doctor", "name roomNumber specialization")
            .sort({ priority: 1, createdAt: 1 });

        res.json({
            count: queue.length,
            queue
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch department queue",
            error: error.message
        });
    }
}

async function getDoctorQueue(req, res) {
    try {
        const queue = await Token.find({
            doctor: req.params.doctorId,
            status: { $in: ["Waiting", "Called", "In Consultation"] }
        })
            .populate("patient", "name age gender phone symptoms")
            .sort({ priority: 1, createdAt: 1 });

        res.json({
            count: queue.length,
            queue
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch doctor queue",
            error: error.message
        });
    }
}

async function callNextToken(req, res) {
    try {
        const { department } = req.params;

        const nextToken = await Token.findOne({
            department,
            status: "Waiting"
        })
            .sort({ priority: 1, createdAt: 1 })
            .populate("patient", "name age gender phone")
            .populate("doctor", "name roomNumber specialization");

        if (!nextToken) {
            return res.status(404).json({
                message: "No waiting tokens in this department"
            });
        }

        nextToken.status = "Called";
        nextToken.calledAt = new Date();
        await nextToken.save();

        await recalculateQueueWaitTimes(department);

        // 🔔 NOTIFICATION: Token Called
        await notifyPatient({
            patient: nextToken.patient._id,
            recipientPhone: nextToken.patient.phone,
            channel: "SMS",
            title: "Token Called",
            message: `Your token ${nextToken.tokenNumber} has been called. Please proceed to the consultation room.`
        });

        res.json({
            message: "Next token called",
            token: nextToken
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to call next token",
            error: error.message
        });
    }
}

async function updateTokenStatus(req, res) {
    try {
        const { status } = req.body;

        const updateData = { status };

        if (status === "Completed") {
            updateData.completedAt = new Date();
        }

        const token = await Token.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!token) {
            return res.status(404).json({
                message: "Token not found"
            });
        }

        await Patient.findByIdAndUpdate(token.patient, { status });
        await recalculateQueueWaitTimes(token.department);

        res.json({
            message: "Token status updated successfully",
            token
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to update token status",
            error: error.message
        });
    }
}

async function markTokenMissed(req, res) {
    try {
        const token = await Token.findByIdAndUpdate(
            req.params.id,
            { status: "Missed" },
            { new: true }
        );

        if (!token) {
            return res.status(404).json({
                message: "Token not found"
            });
        }

        await Patient.findByIdAndUpdate(token.patient, {
            status: "Waiting"
        });

        await recalculateQueueWaitTimes(token.department);

        res.json({
            message: "Token moved to missed queue",
            token
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to mark token missed",
            error: error.message
        });
    }
}

async function getMissedQueue(req, res) {
    try {
        const queue = await Token.find({ status: "Missed" })
            .populate("patient", "name age gender phone")
            .populate("doctor", "name roomNumber specialization")
            .sort({ updatedAt: -1 });

        res.json({
            count: queue.length,
            queue
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch missed queue",
            error: error.message
        });
    }
}

async function revalidateMissedToken(req, res) {
    try {
        const token = await Token.findById(req.params.id);

        if (!token) {
            return res.status(404).json({
                message: "Token not found"
            });
        }

        if (token.status !== "Missed") {
            return res.status(400).json({
                message: "Only missed tokens can be revalidated"
            });
        }

        token.status = "Waiting";
        token.priority = Math.max(token.priority + 1, 6);
        token.estimatedWaitMinutes = await calculateEstimatedWait(
            token.department,
            token.priority
        );

        await token.save();

        await Patient.findByIdAndUpdate(token.patient, {
            status: "Waiting"
        });

        await recalculateQueueWaitTimes(token.department);

        // 🔔 NOTIFICATION: Token Revalidated
        await notifyPatient({
            patient: token.patient,
            channel: "SMS",
            title: "Token Revalidated",
            message: `Your missed token ${token.tokenNumber} has been revalidated. Please wait for your turn.`
        });

        res.json({
            message: "Missed token revalidated successfully",
            token
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to revalidate token",
            error: error.message
        });
    }
}

module.exports = {
    createToken,
    getDepartmentQueue,
    getDoctorQueue,
    callNextToken,
    updateTokenStatus,
    markTokenMissed,
    getMissedQueue,
    revalidateMissedToken
};