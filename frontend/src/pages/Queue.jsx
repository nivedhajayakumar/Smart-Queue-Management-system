import { useState } from "react";
import { apiRequest } from "../api/api";
import { Field, PageHeader, Panel, Table } from "../components/ui";

function Queue() {
    const [department, setDepartment] = useState("General Medicine");
    const [queue, setQueue] = useState([]);
    const [missed, setMissed] = useState([]);

    async function loadQueue() {
        const data = await apiRequest(`/queue/department/${department}`);
        setQueue(data.queue || []);
    }

    async function callNext() {
        await apiRequest(`/queue/department/${department}/call-next`, { method: "PATCH" });
        loadQueue();
    }

    async function markMissed(id) {
        await apiRequest(`/queue/token/${id}/missed`, { method: "PATCH" });
        loadQueue();
        loadMissed();
    }

    async function complete(id) {
        await apiRequest(`/queue/token/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status: "Completed" })
        });
        loadQueue();
    }

    async function loadMissed() {
        const data = await apiRequest("/queue/missed");
        setMissed(data.queue || []);
    }

    async function revalidate(id) {
        await apiRequest(`/queue/token/${id}/revalidate`, { method: "PATCH" });
        loadMissed();
        loadQueue();
    }

    return (
        <div>
            <PageHeader title="Queue" subtitle="Department tokens, calling flow, missed queue" />

            <Panel title="Department Queue">
                <div className="toolbar">
                    <Field label="Department">
                        <select value={department} onChange={(e) => setDepartment(e.target.value)}>
                            <option>General Medicine</option>
                            <option>Cardiology</option>
                            <option>Dermatology</option>
                            <option>Orthopedics</option>
                            <option>Pediatrics</option>
                            <option>Emergency</option>
                        </select>
                    </Field>
                    <button onClick={loadQueue}>Load Queue</button>
                    <button onClick={callNext}>Call Next</button>
                    <button onClick={loadMissed}>Missed Queue</button>
                </div>

                <Table
                    columns={["Token", "Patient", "Doctor", "Priority", "Wait", "Status", "Action"]}
                    rows={queue}
                    renderRow={(t) => (
                        <tr key={t._id}>
                            <td>{t.tokenNumber || "-"}</td>
                            <td>{t.patient?.name}</td>
                            <td>{t.doctor?.name || "-"}</td>
                            <td>{t.priority}</td>
                            <td>{t.estimatedWaitMinutes} min</td>
                            <td>{t.status}</td>
                            <td className="actions">
                                <button onClick={() => markMissed(t._id)}>Missed</button>
                                <button onClick={() => complete(t._id)}>Complete</button>
                            </td>
                        </tr>
                    )}
                />
            </Panel>

            <Panel title="Missed Tokens">
                <Table
                    columns={["Token", "Patient", "Department", "Status", "Action"]}
                    rows={missed}
                    renderRow={(t) => (
                        <tr key={t._id}>
                            <td>{t.tokenNumber}</td>
                            <td>{t.patient?.name}</td>
                            <td>{t.department}</td>
                            <td>{t.status}</td>
                            <td><button onClick={() => revalidate(t._id)}>Revalidate</button></td>
                        </tr>
                    )}
                />
            </Panel>
        </div>
    );
}

export default Queue;
