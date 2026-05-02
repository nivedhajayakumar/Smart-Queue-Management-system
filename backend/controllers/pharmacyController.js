const PharmacyOrder = require("../models/PharmacyOrder");

async function getAllPharmacyOrders(req, res) {
    try {
        const orders = await PharmacyOrder.find()
            .populate("patient", "name age gender phone")
            .populate("doctor", "name specialization")
            .populate("prescription")
            .sort({ createdAt: -1 });

        res.json({
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch pharmacy orders",
            error: error.message
        });
    }
}

async function updatePharmacyOrderStatus(req, res) {
    try {
        const { status } = req.body;

        const updateData = { status };

        if (status === "Dispensed") {
            updateData.dispensedAt = new Date();
        }

        const order = await PharmacyOrder.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true }
        );

        if (!order) {
            return res.status(404).json({
                message: "Pharmacy order not found"
            });
        }

        res.json({
            message: "Pharmacy order status updated successfully",
            order
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to update pharmacy order",
            error: error.message
        });
    }
}

async function getPatientPharmacyOrders(req, res) {
    try {
        const orders = await PharmacyOrder.find({
            patient: req.params.patientId
        })
            .populate("doctor", "name specialization")
            .sort({ createdAt: -1 });

        res.json({
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch patient pharmacy orders",
            error: error.message
        });
    }
}

module.exports = {
    getAllPharmacyOrders,
    updatePharmacyOrderStatus,
    getPatientPharmacyOrders
};
