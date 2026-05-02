const express = require("express");

const {
    evaluateSymptoms
} = require("../controllers/triageController");

const {
    protect,
    allowRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/evaluate",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST", "DOCTOR"),
    evaluateSymptoms
);

module.exports = router;
