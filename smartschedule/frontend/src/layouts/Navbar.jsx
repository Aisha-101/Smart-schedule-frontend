import { getUser } from "../api/auth";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function Navbar() {
  const nav = useNavigate();
  const user = getUser();

  const logout = () => {
    localStorage.clear();
    nav("/");
  };

  return (
    <div className="bg-white shadow px-6 py-3 flex justify-between">
      <h1 className="font-semibold">SmartSchedule</h1>

      <div className="space-x-4">
        
        {user?.role === "ADMIN" && (
          <button onClick={() => nav("/admin")}>Admin</button>
        )}

        {user?.role === "SPECIALIST" && (
          <>
            <Link to="/specialist" className="hover:text-blue-600">
              Dashboard
            </Link>

            <Link to="/specialist/appointments" className="hover:text-blue-600">
              Appointments
            </Link>

            <Link to="/specialist/schedule" className="hover:text-blue-600">
              My Schedule
            </Link>
          </>
        )}

        {user?.role === "CLIENT" && (
          <>
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-blue-600"
            >
              Dashboard
            </Link>

            <Link
              to="/my-appointments"
              className="text-gray-700 hover:text-blue-600"
            >
              My Appointments
            </Link>
          </>
          
        )}

        <button onClick={logout} className="text-red-500">
          Logout
        </button>
      </div>
    </div>
  );
}