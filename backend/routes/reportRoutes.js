const express = require("express");

const {
    getAdminSummary,
    getDepartmentQueueReport,
    getDoctorUtilizationReport,
    getRevenueReport,
    getAuditLogs
} = require("../controllers/reportController");

const {
    protect,
    allowRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/summary",
    protect,
    allowRoles("ADMIN"),
    getAdminSummary
);

router.get(
    "/department-queues",
    protect,
    allowRoles("ADMIN"),
    getDepartmentQueueReport
);

router.get(
    "/doctor-utilization",
    protect,
    allowRoles("ADMIN"),
    getDoctorUtilizationReport
);

router.get(
    "/revenue",
    protect,
    allowRoles("ADMIN"),
    getRevenueReport
);

router.get(
    "/audit-logs",
    protect,
    allowRoles("ADMIN"),
    getAuditLogs
);

module.exports = router;
