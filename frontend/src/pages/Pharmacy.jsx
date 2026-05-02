import { useEffect, useState } from "react";
import { apiRequest } from "../api/api";
import { PageHeader, Panel, Table } from "../components/ui";

function Pharmacy() {
    const [orders, setOrders] = useState([]);

    async function loadOrders() {
        const data = await apiRequest("/pharmacy/orders");
        setOrders(data.orders || []);
    }

    useEffect(() => {
        loadOrders();
    }, []);

    async function updateStatus(id, status) {
        await apiRequest(`/pharmacy/orders/${id}/status`, {
            method: "PATCH",
            body: JSON.stringify({ status })
        });
        loadOrders();
    }

    return (
        <div>
            <PageHeader title="Pharmacy" subtitle="Prescription orders and medicine dispensing" />

            <Panel title="Pharmacy Orders">
                <Table
                    columns={["Patient", "Doctor", "Medicines", "Amount", "Status", "Action"]}
                    rows={orders}
                    renderRow={(o) => (
                        <tr key={o._id}>
                            <td>{o.patient?.name}</td>
                            <td>{o.doctor?.name}</td>
                            <td>{o.medicines?.map((m) => m.medicineName).join(", ")}</td>
                            <td>₹{o.totalAmount}</td>
                            <td>{o.status}</td>
                            <td className="actions">
                                <button onClick={() => updateStatus(o._id, "Ready")}>Ready</button>
                                <button onClick={() => updateStatus(o._id, "Dispensed")}>Dispense</button>
                            </td>
                        </tr>
                    )}
                />
            </Panel>
        </div>
    );
}

export default Pharmacy;
