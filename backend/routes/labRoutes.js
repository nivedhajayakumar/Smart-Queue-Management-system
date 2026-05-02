const express = require("express");

const {
    getAllLabOrders,
    updateLabOrderStatus,
    uploadLabReport,
    getPatientLabReports
} = require("../controllers/labController");

const {
    protect,
    allowRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/orders",
    protect,
    allowRoles("ADMIN", "DOCTOR", "RECEPTIONIST"),
    getAllLabOrders
);

router.patch(
    "/orders/:id/status",
    protect,
    allowRoles("ADMIN", "DOCTOR", "RECEPTIONIST"),
    updateLabOrderStatus
);

router.patch(
    "/orders/:id/report",
    protect,
    allowRoles("ADMIN", "DOCTOR", "RECEPTIONIST"),
    uploadLabReport
);

router.get(
    "/patient/:patientId/reports",
    protect,
    allowRoles("ADMIN", "DOCTOR", "RECEPTIONIST"),
    getPatientLabReports
);

module.exports = router;
