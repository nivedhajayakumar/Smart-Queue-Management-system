const BillingItem = require("../models/BillingItem");
const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");

const { notifyPatient } = require("../services/notificationService"); // 🔔 added

async function createBillingItem(req, res) {
    try {
        const billingItem = await BillingItem.create(req.body);

        res.status(201).json({
            message: "Billing item created successfully",
            billingItem
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create billing item",
            error: error.message
        });
    }
}

async function getPatientBillingItems(req, res) {
    try {
        const billingItems = await BillingItem.find({
            patient: req.params.patientId
        }).sort({ createdAt: -1 });

        res.json({
            count: billingItems.length,
            billingItems
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch billing items",
            error: error.message
        });
    }
}

async function generateInvoiceNumber() {
    const count = await Invoice.countDocuments();
    return `INV-${String(count + 1).padStart(5, "0")}`;
}

async function generateInvoice(req, res) {
    try {
        const { patientId, billingItemIds } = req.body;

        const items = await BillingItem.find({
            _id: { $in: billingItemIds },
            patient: patientId,
            status: "Unbilled"
        });

        if (items.length === 0) {
            return res.status(400).json({
                message: "No unbilled items found"
            });
        }

        const totalAmount = items.reduce(
            (sum, item) => sum + item.amount,
            0
        );

        const invoice = await Invoice.create({
            patient: patientId,
            items: items.map((item) => item._id),
            invoiceNumber: await generateInvoiceNumber(),
            totalAmount,
            balanceAmount: totalAmount
        });

        await BillingItem.updateMany(
            { _id: { $in: items.map((item) => item._id) } },
            { status: "Billed" }
        );

        // 🔔 NOTIFICATION: Invoice Generated
        await notifyPatient({
            patient: patientId,
            channel: "SMS",
            title: "Invoice Generated",
            message: `Invoice ${invoice.invoiceNumber} generated. Total amount: ${totalAmount}.`
        });

        res.status(201).json({
            message: "Invoice generated successfully",
            invoice
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to generate invoice",
            error: error.message
        });
    }
}

async function getPatientInvoices(req, res) {
    try {
        const invoices = await Invoice.find({
            patient: req.params.patientId
        })
            .populate("items")
            .sort({ createdAt: -1 });

        res.json({
            count: invoices.length,
            invoices
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch invoices",
            error: error.message
        });
    }
}

async function recordPayment(req, res) {
    try {
        const {
            invoiceId,
            amount,
            paymentMode,
            transactionId
        } = req.body;

        const invoice = await Invoice.findById(invoiceId);

        if (!invoice) {
            return res.status(404).json({
                message: "Invoice not found"
            });
        }

        const payment = await Payment.create({
            invoice: invoiceId,
            patient: invoice.patient,
            amount,
            paymentMode,
            transactionId
        });

        invoice.paidAmount += amount;
        invoice.balanceAmount = invoice.totalAmount - invoice.paidAmount;

        if (invoice.balanceAmount <= 0) {
            invoice.paymentStatus = "Paid";
            invoice.balanceAmount = 0;
        } else {
            invoice.paymentStatus = "Partially Paid";
        }

        await invoice.save();

        if (invoice.paymentStatus === "Paid") {
            await BillingItem.updateMany(
                { _id: { $in: invoice.items } },
                { status: "Paid" }
            );
        }

        // 🔔 NOTIFICATION: Payment Received
        await notifyPatient({
            patient: invoice.patient,
            channel: "SMS",
            title: "Payment Received",
            message: `Payment of ${amount} received successfully. Balance amount: ${invoice.balanceAmount}.`
        });

        res.status(201).json({
            message: "Payment recorded successfully",
            payment,
            invoice
        });

    } catch (error) {
        res.status(500).json({
            message: "Failed to record payment",
            error: error.message
        });
    }
}

module.exports = {
    createBillingItem,
    getPatientBillingItems,
    generateInvoice,
    getPatientInvoices,
    recordPayment
};