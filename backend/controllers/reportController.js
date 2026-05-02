const Patient = require("../models/Patient");
const Doctor = require("../models/Doctor");
const Token = require("../models/Token");
const Consultation = require("../models/Consultation");
const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");
const LabOrder = require("../models/LabOrder");
const PharmacyOrder = require("../models/PharmacyOrder");
const AuditLog = require("../models/AuditLog");

function startOfToday() {
    return new Date(new Date().setHours(0, 0, 0, 0));
}

async function getAdminSummary(req, res) {
    try {
        const today = startOfToday();

        const [
            totalPatients,
            todayPatients,
            totalDoctors,
            activeTokens,
            completedConsultationsToday,
            totalRevenueToday,
            pendingLabOrders,
            pendingPharmacyOrders
        ] = await Promise.all([
            Patient.countDocuments(),
            Patient.countDocuments({ createdAt: { $gte: today } }),
            Doctor.countDocuments(),
            Token.countDocuments({ status: { $in: ["Waiting", "Called", "In Consultation"] } }),
            Consultation.countDocuments({ status: "Completed", completedAt: { $gte: today } }),
            Payment.aggregate([
                { $match: { paidAt: { $gte: today } } },
                { $group: { _id: null, total: { $sum: "$amount" } } }
            ]),
            LabOrder.countDocuments({ status: { $in: ["Requested", "Sample Collected"] } }),
            PharmacyOrder.countDocuments({ status: { $in: ["Pending", "Ready"] } })
        ]);

        res.json({
            totalPatients,
            todayPatients,
            totalDoctors,
            activeTokens,
            completedConsultationsToday,
            totalRevenueToday: totalRevenueToday[0]?.total || 0,
            pendingLabOrders,
            pendingPharmacyOrders
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to load admin summary",
            error: error.message
        });
    }
}

async function getDepartmentQueueReport(req, res) {
    try {
        const report = await Token.aggregate([
            {
                $group: {
                    _id: {
                        department: "$department",
                        status: "$status"
                    },
                    count: {
                        $sum: 1
                    }
                }
            },
            {
                $sort: {
                    "_id.department": 1
                }
            }
        ]);

        res.json({
            report
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to load department queue report",
            error: error.message
        });
    }
}

async function getDoctorUtilizationReport(req, res) {
    try {
        const report = await Consultation.aggregate([
            {
                $group: {
                    _id: "$doctor",
                    totalConsultations: {
                        $sum: 1
                    },
                    completedConsultations: {
                        $sum: {
                            $cond: [
                                {
                                    $eq: ["$status", "Completed"]
                                },
                                1,
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        await Consultation.populate(report, {
            path: "_id",
            select: "name specialization department"
        });

        res.json({
            report
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to load doctor utilization report",
            error: error.message
        });
    }
}

async function getRevenueReport(req, res) {
    try {
        const report = await Payment.aggregate([
            {
                $group: {
                    _id: "$paymentMode",
                    totalAmount: {
                        $sum: "$amount"
                    },
                    totalPayments: {
                        $sum: 1
                    }
                }
            }
        ]);

        res.json({
            report
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to load revenue report",
            error: error.message
        });
    }
}

async function getAuditLogs(req, res) {
    try {
        const logs = await AuditLog.find()
            .populate("user", "name email role")
            .sort({ createdAt: -1 })
            .limit(100);

        res.json({
            count: logs.length,
            logs
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch audit logs",
            error: error.message
        });
    }
}

module.exports = {
    getAdminSummary,
    getDepartmentQueueReport,
    getDoctorUtilizationReport,
    getRevenueReport,
    getAuditLogs
};
