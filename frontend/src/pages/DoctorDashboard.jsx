import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import { Field, PageHeader, Panel, Table } from "../components/ui";

function DoctorDashboard() {
    const [doctors, setDoctors] = useState([]);
    const [doctorId, setDoctorId] = useState("");
    const [dashboard, setDashboard] = useState(null);
    const [consultationId, setConsultationId] = useState("");
    const [selected, setSelected] = useState(null);

    const [consult, setConsult] = useState({ symptoms: "", diagnosis: "", notes: "" });
    const [medicine, setMedicine] = useState({
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
        quantity: 1,
        price: 0
    });
    const [labTests, setLabTests] = useState("");

    useEffect(() => {
        apiRequest("/doctors").then((data) => setDoctors(data.doctors || []));
    }, []);

    async function loadDashboard() {
        const data = await apiRequest(`/consultations/doctor/${doctorId}/dashboard`);
        setDashboard(data);
    }

    async function startConsultation(token) {
        setSelected(token);
        const data = await apiRequest("/consultations/start", {
            method: "POST",
            body: JSON.stringify({
                patientId: token.patient._id,
                doctorId,
                tokenId: token._id,
                symptoms: consult.symptoms || token.patient.symptoms,
                diagnosis: consult.diagnosis,
                notes: consult.notes
            })
        });
        setConsultationId(data.consultation._id);
        loadDashboard();
    }

    async function addPrescription() {
        await apiRequest("/consultations/prescription", {
            method: "POST",
            body: JSON.stringify({
                consultationId,
                patientId: selected.patient._id,
                doctorId,
                medicines: [medicine],
                advice: "Follow dosage instructions"
            })
        });
    }

    async function requestLab() {
        await apiRequest("/consultations/lab-order", {
            method: "POST",
            body: JSON.stringify({
                consultationId,
                patientId: selected.patient._id,
                doctorId,
                tests: labTests.split(",").map((x) => x.trim()),
                priority: "Routine",
                amount: 500
            })
        });
    }

    async function completeConsultation() {
        await apiRequest(`/consultations/${consultationId}/complete`, { method: "PATCH" });
        setConsultationId("");
        setSelected(null);
        loadDashboard();
    }

    return (
        <div>
            <PageHeader title="Doctor Dashboard" subtitle="Queue, diagnosis, prescription, lab request" />

            <Panel title="Select Doctor">
                <div className="toolbar">
                    <Field label="Doctor">
                        <select value={doctorId} onChange={(e) => setDoctorId(e.target.value)}>
                            <option value="">Select doctor</option>
                            {doctors.map((d) => <option key={d._id} value={d._id}>{d.name} - {d.department}</option>)}
                        </select>
                    </Field>
                    <button onClick={loadDashboard}>Load</button>
                </div>
            </Panel>

            <Panel title="Doctor Queue">
                <Table
                    columns={["Token", "Patient", "Symptoms", "Status", "Action"]}
                    rows={dashboard?.queue || []}
                    renderRow={(token) => (
                        <tr key={token._id}>
                            <td>{token.tokenNumber}</td>
                            <td>{token.patient?.name}</td>
                            <td>{token.patient?.symptoms}</td>
                            <td>{token.status}</td>
                            <td><button onClick={() => setSelected(token)}>Select</button></td>
                        </tr>
                    )}
                />
            </Panel>

            {selected && (
                <Panel title={`Consultation: ${selected.patient.name}`}>
                    <div className="form-grid">
                        <Field label="Symptoms"><textarea value={consult.symptoms} onChange={(e) => setConsult({ ...consult, symptoms: e.target.value })} /></Field>
                        <Field label="Diagnosis"><textarea value={consult.diagnosis} onChange={(e) => setConsult({ ...consult, diagnosis: e.target.value })} /></Field>
                        <Field label="Notes"><textarea value={consult.notes} onChange={(e) => setConsult({ ...consult, notes: e.target.value })} /></Field>
                        {!consultationId && <button onClick={() => startConsultation(selected)}>Start Consultation</button>}
                    </div>

                    {consultationId && (
                        <>
                            <h3 className="panel-title">Prescription</h3>
                            <div className="form-grid">
                                <Field label="Medicine"><input value={medicine.medicineName} onChange={(e) => setMedicine({ ...medicine, medicineName: e.target.value })} /></Field>
                                <Field label="Dosage"><input value={medicine.dosage} onChange={(e) => setMedicine({ ...medicine, dosage: e.target.value })} /></Field>
                                <Field label="Frequency"><input value={medicine.frequency} onChange={(e) => setMedicine({ ...medicine, frequency: e.target.value })} /></Field>
                                <Field label="Duration"><input value={medicine.duration} onChange={(e) => setMedicine({ ...medicine, duration: e.target.value })} /></Field>
                                <Field label="Quantity"><input value={medicine.quantity} onChange={(e) => setMedicine({ ...medicine, quantity: Number(e.target.value) })} /></Field>
                                <Field label="Price"><input value={medicine.price} onChange={(e) => setMedicine({ ...medicine, price: Number(e.target.value) })} /></Field>
                                <button onClick={addPrescription}>Add Prescription</button>
                            </div>

                            <h3 className="panel-title">Lab Request</h3>
                            <div className="toolbar">
                                <Field label="Tests, comma separated">
                                    <input value={labTests} onChange={(e) => setLabTests(e.target.value)} />
                                </Field>
                                <button onClick={requestLab}>Request Lab</button>
                                <button onClick={completeConsultation}>Complete Consultation</button>
                            </div>
                        </>
                    )}
                </Panel>
            )}
        </div>
    );
}

export default DoctorDashboard;
