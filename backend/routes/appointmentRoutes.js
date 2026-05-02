const express = require("express");
const {
    bookAppointment,
    getAllAppointments,
    checkInAppointment,
    cancelAppointment
} = require("../controllers/appointmentController");

const {
    protect,
    allowRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST"),
    bookAppointment
);

router.get(
    "/",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST", "DOCTOR"),
    getAllAppointments
);

router.patch(
    "/:id/check-in",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST"),
    checkInAppointment
);

router.patch(
    "/:id/cancel",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST"),
    cancelAppointment
);

module.exports = router;
