import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../api/api";

export default function AppointmentEmailConfirm() {
  const { id, hash } = useParams();
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("Confirming your appointment...");

  useEffect(() => {
    const confirmByEmail = async () => {
      try {
        const res = await API.get(`/appointments/${id}/confirm-email/${hash}`);
        setStatus("success");
        setMessage(
          res.data?.message || "Appointment confirmed successfully by email."
        );
      } catch (err) {
        setStatus("error");
        setMessage(
          err.response?.data?.message || "Unable to confirm appointment link."
        );
      }
    };

    confirmByEmail();
  }, [id, hash]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-xl shadow p-6 max-w-md w-full text-center">
        <h1 className="text-xl font-semibold mb-3">Appointment Confirmation</h1>

        {status === "loading" && (
          <p className="text-blue-600">⏳ Confirming your appointment...</p>
        )}

        {status === "success" && <p className="text-green-700">✅ {message}</p>}

        {status === "error" && <p className="text-red-700">❌ {message}</p>}

        <div className="mt-5">
          <Link to="/login" className="text-blue-600 hover:underline">
            Go to Login
          </Link>
        </div>
      </div>
    </div>
  );
}