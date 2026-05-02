import { useEffect, useState } from "react";
import { Activity, CreditCard, Stethoscope, TestTube, Users } from "lucide-react";
import { apiRequest } from "../api/api";
import { PageHeader } from "../components/ui";

function Dashboard() {
    const [summary, setSummary] = useState(null);

    useEffect(() => {
        apiRequest("/reports/summary")
            .then(setSummary)
            .catch(() => setSummary(null));
    }, []);

    const cards = [
        ["Total Patients", summary?.totalPatients || 0, Users],
        ["Today Patients", summary?.todayPatients || 0, Activity],
        ["Doctors", summary?.totalDoctors || 0, Stethoscope],
        ["Active Tokens", summary?.activeTokens || 0, Activity],
        ["Pending Lab", summary?.pendingLabOrders || 0, TestTube],
        ["Revenue Today", `₹${summary?.totalRevenueToday || 0}`, CreditCard]
    ];

    return (
        <div>
            <PageHeader title="Dashboard" subtitle="Live hospital operation summary" />

            <div className="stats-grid">
                {cards.map(([label, value, Icon]) => (
                    <div className="stat-card" key={label}>
                        <Icon />
                        <span>{label}</span>
                        <strong>{value}</strong>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Dashboard;
