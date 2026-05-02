import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import { Field, PageHeader, Panel, Table } from "../components/ui";

function Patients() {
    const [patients, setPatients] = useState([]);
    const [form, setForm] = useState({
        name: "",
        age: "",
        gender: "Male",
        phone: "",
        address: "",
        symptoms: "",
        visitType: "Fresh"
    });

    async function loadPatients() {
        const data = await apiRequest("/patients");
        setPatients(data.patients || []);
    }

    useEffect(() => {
        loadPatients();
    }, []);

    function update(name, value) {
        setForm({ ...form, [name]: value });
    }

    async function createPatient(e) {
        e.preventDefault();
        await apiRequest("/patients", {
            method: "POST",
            body: JSON.stringify(form)
        });
        setForm({
            name: "",
            age: "",
            gender: "Male",
            phone: "",
            address: "",
            symptoms: "",
            visitType: "Fresh"
        });
        loadPatients();
    }

    return (
        <div>
            <PageHeader title="Patients" subtitle="Register and view patient records" />

            <div className="two-col">
                <Panel title="Register Patient">
                    <form className="form-grid" onSubmit={createPatient}>
                        <Field label="Name"><input value={form.name} onChange={(e) => update("name", e.target.value)} required /></Field>
                        <Field label="Age"><input value={form.age} onChange={(e) => update("age", e.target.value)} required /></Field>
                        <Field label="Gender">
                            <select value={form.gender} onChange={(e) => update("gender", e.target.value)}>
                                <option>Male</option><option>Female</option><option>Other</option>
                            </select>
                        </Field>
                        <Field label="Phone"><input value={form.phone} onChange={(e) => update("phone", e.target.value)} required /></Field>
                        <Field label="Visit Type">
                            <select value={form.visitType} onChange={(e) => update("visitType", e.target.value)}>
                                <option>Fresh</option><option>Revisit</option><option>Emergency</option>
                            </select>
                        </Field>
                        <Field label="Address"><input value={form.address} onChange={(e) => update("address", e.target.value)} /></Field>
                        <Field label="Symptoms"><textarea value={form.symptoms} onChange={(e) => update("symptoms", e.target.value)} required /></Field>
                        <button>Add Patient</button>
                    </form>
                </Panel>

                <Panel title="Patient List">
                    <Table
                        columns={["Name", "Age", "Phone", "Department", "Token", "Status"]}
                        rows={patients}
                        renderRow={(patient) => (
                            <tr key={patient._id}>
                                <td>{patient.name}</td>
                                <td>{patient.age}</td>
                                <td>{patient.phone}</td>
                                <td>{patient.department}</td>
                                <td>{patient.tokenNumber || "-"}</td>
                                <td>{patient.status}</td>
                            </tr>
                        )}
                    />
                </Panel>
            </div>
        </div>
    );
}

export default Patients;
