import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Appointments from "./pages/Appointments";
import Queue from "./pages/Queue";
import DoctorDashboard from "./pages/DoctorDashboard";
import Lab from "./pages/Lab";
import Pharmacy from "./pages/Pharmacy";
import Billing from "./pages/Billing";
import Reports from "./pages/Reports";

function Layout({ children }) {
    return (
        <div className="app-layout">
            <Sidebar />
            <main className="main-area">
                <Topbar />
                <section className="content-area">
                    {children}
                </section>
            </main>
        </div>
    );
}

function App() {
    const { isAuthenticated } = useAuth();

    return (
        <Routes>
            <Route
                path="/login"
                element={
                    isAuthenticated
                        ? <Navigate to="/" replace />
                        : <Login />
                }
            />

            <Route
                path="/"
                element={
                    <ProtectedRoute>
                        <Layout>
                            <Dashboard />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/patients"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN", "RECEPTIONIST", "DOCTOR"]}>
                        <Layout>
                            <Patients />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/appointments"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN", "RECEPTIONIST"]}>
                        <Layout>
                            <Appointments />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/queue"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN", "RECEPTIONIST", "DOCTOR"]}>
                        <Layout>
                            <Queue />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/doctor"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN", "DOCTOR"]}>
                        <Layout>
                            <DoctorDashboard />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/lab"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN", "RECEPTIONIST", "DOCTOR"]}>
                        <Layout>
                            <Lab />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/pharmacy"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN", "RECEPTIONIST", "DOCTOR"]}>
                        <Layout>
                            <Pharmacy />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/billing"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN", "RECEPTIONIST"]}>
                        <Layout>
                            <Billing />
                        </Layout>
                    </ProtectedRoute>
                }
            />

            <Route
                path="/reports"
                element={
                    <ProtectedRoute allowedRoles={["ADMIN"]}>
                        <Layout>
                            <Reports />
                        </Layout>
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

export default App;
