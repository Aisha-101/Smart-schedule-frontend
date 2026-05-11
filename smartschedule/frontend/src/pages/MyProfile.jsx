import { useState } from "react";
import MainLayout from "../layouts/MainLayout";
import API from "../api/api";
import { getUser } from "../api/auth";

export default function MyProfile() {
  const currentUser = getUser();
  const [form, setForm] = useState({
    name: currentUser?.name || "",
    email: currentUser?.email || "",
    specialization: currentUser?.specialist?.specialization || "",
    password: "",
    password_confirmation: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const updateProfile = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const payload = { name: form.name, email: form.email };

    if (currentUser?.role === "SPECIALIST") {
      payload.specialization = form.specialization;
    }

    if (form.password) {
      payload.password = form.password;
      payload.password_confirmation = form.password_confirmation;
    }

    try {
      const res = await API.put("/me", payload);
      localStorage.setItem("user", JSON.stringify(res.data));
      setMessage("Profile updated successfully.");
      setForm((prev) => ({ ...prev, password: "", password_confirmation: "" }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    }
  };

  return (
    <MainLayout>
      <h1 className="text-2xl font-semibold mb-6">My Profile</h1>
      {message && <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">✅ {message}</div>}
      {error && <div className="bg-red-100 text-red-700 p-3 mb-4 rounded">❌ {error}</div>}

      <form onSubmit={updateProfile} className="bg-white shadow rounded p-6 max-w-xl space-y-4">
        <div>
          <label className="block text-sm mb-1">Name</label>
          <input
            className="border p-2 rounded w-full"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            className="border p-2 rounded w-full"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
        </div>

        {currentUser?.role === "SPECIALIST" && (
          <div>
            <label className="block text-sm mb-1">Specialization</label>
            <input
              className="border p-2 rounded w-full"
              value={form.specialization}
              onChange={(e) =>
                setForm({ ...form, specialization: e.target.value })
              }
            />
          </div>
        )}
        <div>
          <label className="block text-sm mb-1">New password (optional)</label>
          <input
            type="password"
            className="border p-2 rounded w-full"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Confirm password</label>
          <input
            type="password"
            className="border p-2 rounded w-full"
            value={form.password_confirmation}
            onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
          />
        </div>

        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Update profile</button>
      </form>
    </MainLayout>
  );
}