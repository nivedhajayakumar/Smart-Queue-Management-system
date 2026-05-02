import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import { PageHeader, Panel, Table } from "../components/ui";

function Reports() {
    const [queues, setQueues] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [revenue, setRevenue] = useState([]);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        apiRequest("/reports/department-queues").then((d) => setQueues(d.report || []));
        apiRequest("/reports/doctor-utilization").then((d) => setDoctors(d.report || []));
        apiRequest("/reports/revenue").then((d) => setRevenue(d.report || []));
        apiRequest("/reports/audit-logs").then((d) => setLogs(d.logs || []));
    }, []);

    return (
        <div>
            <PageHeader title="Reports" subtitle="Admin analytics, revenue, queues, audit logs" />

            <Panel title="Department Queue Report">
                <Table
                    columns={["Department", "Status", "Count"]}
                    rows={queues}
                    renderRow={(r, index) => (
                        <tr key={index}>
                            <td>{r._id.department}</td>
                            <td>{r._id.status}</td>
                            <td>{r.count}</td>
                        </tr>
                    )}
                />
            </Panel>

            <Panel title="Doctor Utilization">
                <Table
                    columns={["Doctor", "Total", "Completed"]}
                    rows={doctors}
                    renderRow={(r, index) => (
                        <tr key={index}>
                            <td>{r._id?.name || "Unknown"}</td>
                            <td>{r.totalConsultations}</td>
                            <td>{r.completedConsultations}</td>
                        </tr>
                    )}
                />
            </Panel>

            <Panel title="Revenue">
                <Table
                    columns={["Mode", "Payments", "Amount"]}
                    rows={revenue}
                    renderRow={(r) => (
                        <tr key={r._id}>
                            <td>{r._id}</td>
                            <td>{r.totalPayments}</td>
                            <td>₹{r.totalAmount}</td>
                        </tr>
                    )}
                />
            </Panel>

            <Panel title="Audit Logs">
                <Table
                    columns={["User", "Role", "Action", "Status"]}
                    rows={logs}
                    renderRow={(log) => (
                        <tr key={log._id}>
                            <td>{log.user?.name || "-"}</td>
                            <td>{log.role}</td>
                            <td>{log.action}</td>
                            <td>{log.statusCode}</td>
                        </tr>
                    )}
                />
            </Panel>
        </div>
    );
}

export default Reports;
