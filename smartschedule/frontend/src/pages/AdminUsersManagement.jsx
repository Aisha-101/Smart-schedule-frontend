import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import API from "../api/api";
import { getUser } from "../api/auth";
import MainLayout from "../layouts/MainLayout";

export default function AdminUsersManagement() {
  const user = getUser();
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      const res = await API.get("/admin/users");
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load users.");
    }
  };

  const deleteUser = async (id) => {
    setMessage("");
    setError("");

    try {
      await API.delete(`/admin/users/${id}`);
      setMessage("User deleted successfully.");
      loadUsers();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to delete user.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  if (user?.role !== "ADMIN") return <Navigate to="/dashboard" />;

  return (
    <MainLayout>
      <h1 className="text-2xl font-semibold mb-6">Admin User Control</h1>

      {message && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">✅ {message}</div>}
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">❌ {error}</div>}

      {users.length === 0 ? (
        <p className="text-gray-500">No users found.</p>
      ) : (
        users.map((u) => (
          <div key={u.id} className="bg-white border rounded p-4 mb-3 shadow-sm">
            <div className="font-semibold">{u.name}</div>
            <div className="text-sm text-gray-700">{u.email}</div>
            <div className="text-sm">Role: {u.role}</div>
            <div className="text-sm">Email verified: {u.email_verified_at ? "Yes" : "No"}</div>
            <button
              onClick={() => deleteUser(u.id)}
              className="mt-3 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Delete user
            </button>
          </div>
        ))
      )}
    </MainLayout>
  );
}