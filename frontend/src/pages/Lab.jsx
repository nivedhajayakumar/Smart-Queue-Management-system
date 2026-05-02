import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import { Field, PageHeader, Panel, Table } from "../components/ui";

function Lab() {
    const [orders, setOrders] = useState([]);
    const [report, setReport] = useState({ reportTitle: "", resultSummary: "", reportFileUrl: "" });

    async function loadOrders() {
        const data = await apiRequest("/lab/orders");
        setOrders(data.labOrders || []);
    }

    useEffect(() => {
        loadOrders();
    }, []);

    async function updateStatus(id, status) {
        await apiRequest(`/lab/orders/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status })
        });
        loadOrders();
    }

    async function uploadReport(id) {
        await apiRequest(`/lab/orders/${id}/report`, {
            method: "PATCH",
            body: JSON.stringify(report)
        });
        setReport({ reportTitle: "", resultSummary: "", reportFileUrl: "" });
        loadOrders();
    }

    return (
        <div>
            <PageHeader title="Lab" subtitle="Lab orders, sample collection, report upload" />

            <Panel title="Lab Orders">
                <Table
                    columns={["Token", "Patient", "Tests", "Priority", "Status", "Actions"]}
                    rows={orders}
                    renderRow={(o) => (
                        <tr key={o._id}>
                            <td>{o.labTokenNumber}</td>
                            <td>{o.patient?.name}</td>
                            <td>{o.tests?.join(", ")}</td>
                            <td>{o.priority}</td>
                            <td>{o.status}</td>
                            <td className="actions">
                                <button onClick={() => updateStatus(o._id, "Sample Collected")}>Sample</button>
                                <button onClick={() => uploadReport(o._id)}>Upload Report</button>
                            </td>
                        </tr>
                    )}
                />
            </Panel>

            <Panel title="Report Details">
                <div className="form-grid">
                    <Field label="Report Title"><input value={report.reportTitle} onChange={(e) => setReport({ ...report, reportTitle: e.target.value })} /></Field>
                    <Field label="Summary"><textarea value={report.resultSummary} onChange={(e) => setReport({ ...report, resultSummary: e.target.value })} /></Field>
                    <Field label="File URL"><input value={report.reportFileUrl} onChange={(e) => setReport({ ...report, reportFileUrl: e.target.value })} /></Field>
                </div>
            </Panel>
        </div>
    );
}

export default Lab;
