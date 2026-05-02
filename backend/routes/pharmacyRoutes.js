const express = require("express");

const {
    getAllPharmacyOrders,
    updatePharmacyOrderStatus,
    getPatientPharmacyOrders
} = require("../controllers/pharmacyController");

const {
    protect,
    allowRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
    "/orders",
    protect,
    allowRoles("ADMIN", "DOCTOR", "RECEPTIONIST"),
    getAllPharmacyOrders
);

router.patch(
    "/orders/:id/status",
    protect,
    allowRoles("ADMIN", "DOCTOR", "RECEPTIONIST"),
    updatePharmacyOrderStatus
);

router.get(
    "/patient/:patientId/orders",
    protect,
    allowRoles("ADMIN", "DOCTOR", "RECEPTIONIST"),
    getPatientPharmacyOrders
);

module.exports = router;
