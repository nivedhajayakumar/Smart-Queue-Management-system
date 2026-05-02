const Notification = require("../models/Notification");

async function createNotification(data) {
    return Notification.create({
        patient: data.patient,
        recipientPhone: data.recipientPhone,
        recipientEmail: data.recipientEmail,
        channel: data.channel || "SMS",
        title: data.title,
        message: data.message,
        status: "Pending"
    });
}

async function sendNotification(notificationId) {
    const notification = await Notification.findById(notificationId);

    if (!notification) {
        throw new Error("Notification not found");
    }

    try {
        notification.status = "Sent";
        notification.sentAt = new Date();
        await notification.save();

        return notification;
    } catch (error) {
        notification.status = "Failed";
        notification.failureReason = error.message;
        await notification.save();

        return notification;
    }
}

async function notifyPatient(data) {
    const notification = await createNotification(data);
    return sendNotification(notification._id);
}

module.exports = {
    createNotification,
    sendNotification,
    notifyPatient
};
