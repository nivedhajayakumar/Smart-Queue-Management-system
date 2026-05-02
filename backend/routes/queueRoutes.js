const express = require("express");

const {
    createToken,
    getDepartmentQueue,
    getDoctorQueue,
    callNextToken,
    updateTokenStatus,
    markTokenMissed,
    getMissedQueue,
    revalidateMissedToken
} = require("../controllers/queueController");

const {
    protect,
    allowRoles
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
    "/token",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST"),
    createToken
);

router.get(
    "/department/:department",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST", "DOCTOR"),
    getDepartmentQueue
);

router.get(
    "/doctor/:doctorId",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST", "DOCTOR"),
    getDoctorQueue
);

router.get(
    "/missed",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST"),
    getMissedQueue
);

router.patch(
    "/department/:department/call-next",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST", "DOCTOR"),
    callNextToken
);

router.patch(
    "/token/:id/status",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST", "DOCTOR"),
    updateTokenStatus
);

router.patch(
    "/token/:id/missed",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST", "DOCTOR"),
    markTokenMissed
);

router.patch(
    "/token/:id/revalidate",
    protect,
    allowRoles("ADMIN", "RECEPTIONIST"),
    revalidateMissedToken
);

module.exports = router;
