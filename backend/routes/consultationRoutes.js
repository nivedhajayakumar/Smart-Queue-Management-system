const express = require("express");

const {
    getDoctorDashboard,
    startConsultation,
    addPrescription,
    requestLabTests,
    scheduleFollowUp,
    completeConsultation,
    getPatientMedicalHistory
} = require("../controllers/consultationController");

const {
    protect,
    allowRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/doctor/:doctorId/dashboard",
    protect,
    allowRoles("ADMIN", "DOCTOR"),
    getDoctorDashboard
);

router.post(
    "/start",
    protect,
    allowRoles("ADMIN", "DOCTOR"),
    startConsultation
);

router.post(
    "/prescription",
    protect,
    allowRoles("ADMIN", "DOCTOR"),
    addPrescription
);

router.post(
    "/lab-order",
    protect,
    allowRoles("ADMIN", "DOCTOR"),
    requestLabTests
);

router.post(
    "/follow-up",
    protect,
    allowRoles("ADMIN", "DOCTOR"),
    scheduleFollowUp
);

router.patch(
    "/:id/complete",
    protect,
    allowRoles("ADMIN", "DOCTOR"),
    completeConsultation
);

router.get(
    "/patient/:patientId/history",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST", "DOCTOR"),
    getPatientMedicalHistory
);

module.exports = router;
