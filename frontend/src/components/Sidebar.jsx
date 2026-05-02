import { NavLink } from "react-router-dom";
import {
    Activity,
    BarChart3,
    CalendarDays,
    ClipboardList,
    CreditCard,
    LayoutDashboard,
    Pill,
    Stethoscope,
    TestTube,
    Users
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const navItems = [
    {
        label: "Dashboard",
        path: "/",
        icon: LayoutDashboard,
        roles: ["ADMIN", "RECEPTIONIST", "DOCTOR"]
    },
    {
        label: "Patients",
        path: "/patients",
        icon: Users,
        roles: ["ADMIN", "RECEPTIONIST", "DOCTOR"]
    },
    {
        label: "Appointments",
        path: "/appointments",
        icon: CalendarDays,
        roles: ["ADMIN", "RECEPTIONIST"]
    },
    {
        label: "Queue",
        path: "/queue",
        icon: Activity,
        roles: ["ADMIN", "RECEPTIONIST", "DOCTOR"]
    },
    {
        label: "Doctor",
        path: "/doctor",
        icon: Stethoscope,
        roles: ["ADMIN", "DOCTOR"]
    },
    {
        label: "Lab",
        path: "/lab",
        icon: TestTube,
        roles: ["ADMIN", "RECEPTIONIST", "DOCTOR"]
    },
    {
        label: "Pharmacy",
        path: "/pharmacy",
        icon: Pill,
        roles: ["ADMIN", "RECEPTIONIST", "DOCTOR"]
    },
    {
        label: "Billing",
        path: "/billing",
        icon: CreditCard,
        roles: ["ADMIN", "RECEPTIONIST"]
    },
    {
        label: "Reports",
        path: "/reports",
        icon: BarChart3,
        roles: ["ADMIN"]
    }
];

function Sidebar() {
    const { user } = useAuth();

    const visibleItems = navItems.filter((item) => {
        return item.roles.includes(user.role);
    });

    return (
        <aside className="sidebar">
            <div className="brand">
                <ClipboardList size={28} />
                <div>
                    <strong>HMS</strong>
                    <span>Hospital System</span>
                </div>
            </div>

            <nav>
                {visibleItems.map((item) => {
                    const Icon = item.icon;

                    return (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                isActive ? "nav-link active" : "nav-link"
                            }
                        >
                            <Icon size={19} />
                            <span>{item.label}</span>
                        </NavLink>
                    );
                })}
            </nav>
        </aside>
    );
}

export default Sidebar;
