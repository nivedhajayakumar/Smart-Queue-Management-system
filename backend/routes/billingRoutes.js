const express = require("express");

const {
    createBillingItem,
    getPatientBillingItems,
    generateInvoice,
    getPatientInvoices,
    recordPayment
} = require("../controllers/billingController");

const {
    protect,
    allowRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/items",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST"),
    createBillingItem
);

router.get(
    "/patient/:patientId/items",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST"),
    getPatientBillingItems
);

router.post(
    "/invoices",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST"),
    generateInvoice
);

router.get(
    "/patient/:patientId/invoices",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST"),
    getPatientInvoices
);

router.post(
    "/payments",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST"),
    recordPayment
);

module.exports = router;
