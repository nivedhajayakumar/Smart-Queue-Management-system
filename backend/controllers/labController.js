const LabOrder = require("../models/LabOrder");

async function getAllLabOrders(req, res) {
    try {
        const labOrders = await LabOrder.find()
            .populate("patient", "name age gender phone")
            .populate("doctor", "name specialization")
            .sort({ createdAt: -1 });

        res.json({
            count: labOrders.length,
            labOrders
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch lab orders",
            error: error.message
        });
    }
}

async function updateLabOrderStatus(req, res) {
    try {
        const { status } = req.body;

        const labOrder = await LabOrder.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!labOrder) {
            return res.status(404).json({
                message: "Lab order not found"
            });
        }

        res.json({
            message: "Lab order status updated successfully",
            labOrder
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update lab order status",
            error: error.message
        });
    }
}

async function uploadLabReport(req, res) {
    try {
        const {
            reportTitle,
            resultSummary,
            reportFileUrl
        } = req.body;

        const labOrder = await LabOrder.findByIdAndUpdate(
            req.params.id,
            {
                status: "Report Ready",
                report: {
                    reportTitle,
                    resultSummary,
                    reportFileUrl,
                    uploadedAt: new Date()
                }
            },
            { new: true }
        );

        if (!labOrder) {
            return res.status(404).json({
                message: "Lab order not found"
            });
        }

        res.json({
            message: "Lab report uploaded successfully",
            labOrder
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to upload lab report",
            error: error.message
        });
    }
}

async function getPatientLabReports(req, res) {
    try {
        const labReports = await LabOrder.find({
            patient: req.params.patientId,
            status: "Report Ready"
        })
            .populate("doctor", "name specialization")
            .sort({ updatedAt: -1 });

        res.json({
            count: labReports.length,
            labReports
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch patient lab reports",
            error: error.message
        });
    }
}

module.exports = {
    getAllLabOrders,
    updateLabOrderStatus,
    uploadLabReport,
    getPatientLabReports
};
