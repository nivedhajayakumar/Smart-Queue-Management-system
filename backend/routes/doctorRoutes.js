const express = require("express");
const {
    createDoctor,
    getAllDoctors,
    getDoctorsByDepartment,
    updateDoctorAvailability
} = require("../controllers/doctorController");

const {
    protect,
    allowRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    allowRoles("ADMIN"),
    createDoctor
);

router.get(
    "/",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST", "DOCTOR"),
    getAllDoctors
);

router.get(
    "/department/:department",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST"),
    getDoctorsByDepartment
);

router.patch(
    "/:id/availability",
    protect,
    allowRoles("ADMIN", "DOCTOR"),
    updateDoctorAvailability
);

module.exports = router;
