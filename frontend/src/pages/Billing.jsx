import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import { Field, PageHeader, Panel, Table } from "../components/ui";

function Billing() {
    const [patients, setPatients] = useState([]);
    const [patientId, setPatientId] = useState("");
    const [items, setItems] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [payment, setPayment] = useState({ invoiceId: "", amount: "", paymentMode: "UPI", transactionId: "" });

    useEffect(() => {
        apiRequest("/patients").then((data) => setPatients(data.patients || []));
    }, []);

    async function loadBilling() {
        const itemData = await apiRequest(`/billing/patient/${patientId}/items`);
        const invoiceData = await apiRequest(`/billing/patient/${patientId}/invoices`);
        setItems(itemData.billingItems || []);
        setInvoices(invoiceData.invoices || []);
    }

    async function generateInvoice() {
        const billingItemIds = items.filter((i) => i.status === "Unbilled").map((i) => i._id);
        await apiRequest("/billing/invoices", {
            method: "POST",
            body: JSON.stringify({ patientId, billingItemIds })
        });
        loadBilling();
    }

    async function recordPayment() {
        await apiRequest("/billing/payments", {
            method: "POST",
            body: JSON.stringify({
                ...payment,
                amount: Number(payment.amount)
            })
        });
        loadBilling();
    }

    return (
        <div>
            <PageHeader title="Billing" subtitle="Billing items, invoices, and payments" />

            <Panel title="Select Patient">
                <div className="toolbar">
                    <Field label="Patient">
                        <select value={patientId} onChange={(e) => setPatientId(e.target.value)}>
                            <option value="">Select patient</option>
                            {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                        </select>
                    </Field>
                    <button onClick={loadBilling}>Load Billing</button>
                    <button onClick={generateInvoice}>Generate Invoice</button>
                </div>
            </Panel>

            <Panel title="Billing Items">
                <Table
                    columns={["Description", "Source", "Amount", "Status"]}
                    rows={items}
                    renderRow={(i) => (
                        <tr key={i._id}>
                            <td>{i.description}</td>
                            <td>{i.sourceType}</td>
                            <td>₹{i.amount}</td>
                            <td>{i.status}</td>
                        </tr>
                    )}
                />
            </Panel>

            <Panel title="Invoices">
                <Table
                    columns={["Invoice", "Total", "Paid", "Balance", "Status"]}
                    rows={invoices}
                    renderRow={(i) => (
                        <tr key={i._id}>
                            <td>{i.invoiceNumber}</td>
                            <td>₹{i.totalAmount}</td>
                            <td>₹{i.paidAmount}</td>
                            <td>₹{i.balanceAmount}</td>
                            <td>{i.paymentStatus}</td>
                        </tr>
                    )}
                />
            </Panel>

            <Panel title="Record Payment">
                <div className="form-grid">
                    <Field label="Invoice">
                        <select value={payment.invoiceId} onChange={(e) => setPayment({ ...payment, invoiceId: e.target.value })}>
                            <option value="">Select invoice</option>
                            {invoices.map((i) => <option key={i._id} value={i._id}>{i.invoiceNumber}</option>)}
                        </select>
                    </Field>
                    <Field label="Amount"><input value={payment.amount} onChange={(e) => setPayment({ ...payment, amount: e.target.value })} /></Field>
                    <Field label="Mode">
                        <select value={payment.paymentMode} onChange={(e) => setPayment({ ...payment, paymentMode: e.target.value })}>
                            <option>Cash</option><option>Card</option><option>UPI</option><option>Insurance</option>
                        </select>
                    </Field>
                    <Field label="Transaction ID"><input value={payment.transactionId} onChange={(e) => setPayment({ ...payment, transactionId: e.target.value })} /></Field>
                    <button onClick={recordPayment}>Record Payment</button>
                </div>
            </Panel>
        </div>
    );
}

export default Billing;
