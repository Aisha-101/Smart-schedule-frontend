import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import API from "../api/api";

export default function ResetPassword() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [password_confirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    setError("");
    setMessage("");

    try {
      await API.post("/reset-password", {
        token,
        email,
        password,
        password_confirmation,
      });

      setMessage("Password reset successful!");

      setTimeout(() => {
        nav("/");
      }, 2000);

    } catch (err) {
      console.log(err.response?.data);

      setError(
        err.response?.data?.message ||
        "Failed to reset password"
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

        <h2 className="text-2xl font-semibold text-center mb-6">
          Reset Password
        </h2>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-600 p-3 mb-4 rounded">
            {error}
          </div>
        )}

        <input
          type="password"
          placeholder="New password"
          className="w-full border p-2 rounded mb-3 focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm password"
          className="w-full border p-2 rounded mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
          onChange={(e) => setPasswordConfirmation(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Reset Password
        </button>

      </div>
    </div>
  );
}