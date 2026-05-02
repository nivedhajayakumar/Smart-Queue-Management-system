const Notification = require("../models/Notification");
const {
    createNotification,
    sendNotification
} = require("../services/notificationService");

async function createManualNotification(req, res) {
    try {
        const notification = await createNotification(req.body);

        res.status(201).json({
            message: "Notification created successfully",
            notification
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create notification",
            error: error.message
        });
    }
}

async function sendManualNotification(req, res) {
    try {
        const notification = await sendNotification(req.params.id);

        res.json({
            message: "Notification sent successfully",
            notification
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to send notification",
            error: error.message
        });
    }
}

async function getAllNotifications(req, res) {
    try {
        const notifications = await Notification.find()
            .populate("patient", "name phone")
            .sort({ createdAt: -1 });

        res.json({
            count: notifications.length,
            notifications
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch notifications",
            error: error.message
        });
    }
}

async function getPatientNotifications(req, res) {
    try {
        const notifications = await Notification.find({
            patient: req.params.patientId
        }).sort({ createdAt: -1 });

        res.json({
            count: notifications.length,
            notifications
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch patient notifications",
            error: error.message
        });
    }
}

module.exports = {
    createManualNotification,
    sendManualNotification,
    getAllNotifications,
    getPatientNotifications
};
