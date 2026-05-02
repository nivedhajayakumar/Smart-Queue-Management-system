const express = require("express");
const {
    createDepartment,
    getAllDepartments
} = require("../controllers/departmentController");

const {
    protect,
    allowRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/",
    protect,
    allowRoles("ADMIN"),
    createDepartment
);

router.get(
    "/",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST", "DOCTOR"),
    getAllDepartments
);

module.exports = router;
