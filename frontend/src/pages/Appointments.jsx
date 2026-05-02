import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import { Field, PageHeader, Panel, Table } from "../components/ui";

function Appointments() {
    const [patients, setPatients] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [form, setForm] = useState({
        patientId: "",
        appointmentType: "Walk-In",
        appointmentDate: "",
        reportingTime: "",
        symptoms: ""
    });

    async function loadData() {
        const patientData = await apiRequest("/patients");
        const appointmentData = await apiRequest("/appointments");
        setPatients(patientData.patients || []);
        setAppointments(appointmentData.appointments || []);
    }

    useEffect(() => {
        loadData();
    }, []);

    function update(name, value) {
        setForm({ ...form, [name]: value });
    }

    async function bookAppointment(e) {
        e.preventDefault();
        await apiRequest("/appointments", {
            method: "POST",
            body: JSON.stringify(form)
        });
        loadData();
    }

    return (
        <div>
            <PageHeader title="Appointments" subtitle="Book online, walk-in, revisit, and emergency appointments" />

            <div className="two-col">
                <Panel title="Book Appointment">
                    <form className="form-grid" onSubmit={bookAppointment}>
                        <Field label="Patient">
                            <select value={form.patientId} onChange={(e) => update("patientId", e.target.value)} required>
                                <option value="">Select patient</option>
                                {patients.map((p) => <option key={p._id} value={p._id}>{p.name}</option>)}
                            </select>
                        </Field>
                        <Field label="Type">
                            <select value={form.appointmentType} onChange={(e) => update("appointmentType", e.target.value)}>
                                <option>Online</option><option>Walk-In</option><option>Revisit</option><option>Emergency</option>
                            </select>
                        </Field>
                        <Field label="Date"><input type="date" value={form.appointmentDate} onChange={(e) => update("appointmentDate", e.target.value)} required /></Field>
                        <Field label="Reporting Time"><input value={form.reportingTime} onChange={(e) => update("reportingTime", e.target.value)} /></Field>
                        <Field label="Symptoms"><textarea value={form.symptoms} onChange={(e) => update("symptoms", e.target.value)} /></Field>
                        <button>Book Appointment</button>
                    </form>
                </Panel>

                <Panel title="Appointments">
                    <Table
                        columns={["Patient", "Department", "Doctor", "Type", "Status"]}
                        rows={appointments}
                        renderRow={(a) => (
                            <tr key={a._id}>
                                <td>{a.patient?.name}</td>
                                <td>{a.department}</td>
                                <td>{a.doctor?.name || "Not assigned"}</td>
                                <td>{a.appointmentType}</td>
                                <td>{a.status}</td>
                            </tr>
                        )}
                    />
                </Panel>
            </div>
        </div>
    );
}

export default Appointments;
