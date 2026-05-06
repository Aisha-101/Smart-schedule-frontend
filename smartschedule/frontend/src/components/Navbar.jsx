import { getUser } from "../api/auth";
import { useNavigate } from "react-router-dom";

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
        <button onClick={() => nav("/dashboard")}>Dashboard</button>
        <button onClick={() => nav("/calendar")}>Calendar</button>

        {user?.role === "ADMIN" && (
          <button onClick={() => nav("/admin")}>Admin</button>
        )}

        {user?.role === "SPECIALIST" && (
          <button onClick={() => nav("/calendar")}>My Schedule</button>
        )}

        <button onClick={logout} className="text-red-500">
          Logout
        </button>
      </div>
    </div>
  );
}