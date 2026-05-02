const Token = require("../models/Token");
const Doctor = require("../models/Doctor");

async function generateTokenNumber(department) {
    const lastToken = await Token.findOne({
        department,
        tokenNumber: {
            $ne: null
        }
    }).sort({ tokenNumber: -1 });

    return lastToken ? lastToken.tokenNumber + 1 : 1;
}

function calculatePriority({ visitType, urgencyLevel }) {
    if (urgencyLevel === "Emergency" || visitType === "Emergency") return 1;
    if (urgencyLevel === "High") return 2;
    if (visitType === "Revisit") return 3;
    if (urgencyLevel === "Medium") return 4;
    return 5;
}

async function calculateEstimatedWait(department, priority) {
    const waitingCount = await Token.countDocuments({
        department,
        status: "Waiting",
        priority: {
            $lte: priority
        }
    });

    return waitingCount * 10;
}

async function getDoctorActiveLoad(doctorId) {
    return Token.countDocuments({
        doctor: doctorId,
        status: {
            $in: ["Waiting", "Called", "In Consultation"]
        }
    });
}

async function findLeastLoadedDoctor(department) {
    const doctors = await Doctor.find({
        department,
        availabilityStatus: "Available"
    });

    if (doctors.length === 0) {
        return null;
    }

    const doctorsWithLoad = await Promise.all(
        doctors.map(async (doctor) => {
            const activeLoad = await getDoctorActiveLoad(doctor._id);

            return {
                doctor,
                activeLoad
            };
        })
    );

    doctorsWithLoad.sort((a, b) => a.activeLoad - b.activeLoad);

    return doctorsWithLoad[0].doctor;
}

async function recalculateQueueWaitTimes(department) {
    const tokens = await Token.find({
        department,
        status: "Waiting"
    }).sort({
        priority: 1,
        createdAt: 1
    });

    for (let index = 0; index < tokens.length; index++) {
        tokens[index].estimatedWaitMinutes = index * 10;
        await tokens[index].save();
    }
}

module.exports = {
    generateTokenNumber,
    calculatePriority,
    calculateEstimatedWait,
    findLeastLoadedDoctor,
    recalculateQueueWaitTimes
};
