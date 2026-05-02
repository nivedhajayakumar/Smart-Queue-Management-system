import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";

function Topbar() {
    const { user, logout } = useAuth();

    return (
        <header className="topbar">
            <div>
                <h1>Hospital Management System</h1>
                <p>{user.name} / {user.role}</p>
            </div>

            <button className="logout-btn" onClick={logout}>
                <LogOut size={18} />
                Logout
            </button>
        </header>
    );
}

export default Topbar;
