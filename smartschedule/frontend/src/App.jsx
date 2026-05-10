import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Calendar from "./pages/Calendar";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import Navbar from "./layouts/Navbar";
import Booking from "./pages/Booking";
import SpecialistDashboard from "./pages/SpecialistDashboard";
import ClientDashboard from "./pages/ClientDashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import VerifyEmail from "./pages/VerifyEmail";
import ClientAppointments from "./pages/ClientAppointments";
import SpecialistAppointments from "./pages/SpecialistAppointments";
import SpecialistSchedule from "./pages/SpecialistSchedule";
import AppointmentEmailConfirm from "./pages/AppointmentEmailConfirm";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path ="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-email" element={<VerifyEmail />} /> 
        <Route
          path="/appointments/confirm-email/:id/:hash"
          element={<AppointmentEmailConfirm />}
        />
        <Route path="/booking" element={<Booking />} />
        <Route path="/specialist" element={<SpecialistDashboard />} />
        <Route path="/specialist/appointments" element={<SpecialistAppointments />} />
        <Route path="/specialist/schedule" element={<SpecialistSchedule />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route
          path="/my-appointments"
          element={
            <ProtectedRoute allowedRoles={["CLIENT"]}>
              <ClientAppointments />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ClientDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/calendar"
          element={
            <ProtectedRoute>
              <Calendar />
            </ProtectedRoute>
          }
        />

        
      </Routes>
    </BrowserRouter>
  );
}

export default App;