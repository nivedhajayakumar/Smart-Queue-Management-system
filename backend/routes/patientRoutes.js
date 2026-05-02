const express = require("express");
const {
    createPatient,
    getAllPatients,
    getPatientById,
    updatePatientStatus
} = require("../controllers/patientController");

const {
    protect,
    allowRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST"),
    createPatient
);

router.get(
    "/",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST", "DOCTOR"),
    getAllPatients
);

router.get(
    "/:id",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST", "DOCTOR"),
    getPatientById
);

router.patch(
    "/:id/status",
    protect,
    allowRoles("ADMIN", "DOCTOR"),
    updatePatientStatus
);

module.exports = router;
