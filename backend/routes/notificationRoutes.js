const express = require("express");

const {
    createManualNotification,
    sendManualNotification,
    getAllNotifications,
    getPatientNotifications
} = require("../controllers/notificationController");

const {
    protect,
    allowRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST"),
    createManualNotification
);

router.patch(
    "/:id/send",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST"),
    sendManualNotification
);

router.get(
    "/",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST"),
    getAllNotifications
);

router.get(
    "/patient/:patientId",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST", "DOCTOR"),
    getPatientNotifications
);

module.exports = router;
