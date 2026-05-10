import { useEffect, useState } from "react";
import API from "../api/api";
import MainLayout from "../layouts/MainLayout";
import { useNavigate } from "react-router-dom";

export default function ClientAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  const formatDate = (value) => {
    if (!value) return "-";
    const str = String(value);

    if (str.includes(" ")) return str.split(" ")[0];
    if (str.includes("T")) return str.split("T")[0];

    return str;
  };

  const formatTime24 = (value) => {
    if (!value) return "-";
    const str = String(value);

    if (str.includes(" ")) return str.split(" ")[1].slice(0, 5);
    if (str.includes("T")) return str.split("T")[1].slice(0, 5);

    return str.slice(0, 5);
  };

  const loadAppointments = async () => {
    setError("");

    try {
      const res = await API.get("/appointments/my");
      setAppointments(res.data);
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Failed to load appointments.");
    }
  };

  const cancelAppointment = async (id) => {
    setError("");
    setMessage("");

    try {
      await API.delete(`/appointments/${id}`);

      setMessage("Appointment cancelled successfully.");
      setAppointmentToCancel(null);
      loadAppointments();
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Failed to cancel appointment.");
    }
  };

  const requestEmailConfirmation = async (id) => {
    setError("");
    setMessage("");

    try {
      await API.post(`/appointments/${id}/confirm-email`);
      setMessage("Confirmation email sent. Please check your inbox to confirm.");
    } catch (err) {
      console.log(err.response?.data);
      setError(
        err.response?.data?.message || "Failed to send confirmation email."
      );
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  return (
    <MainLayout>
      <h1 className="text-2xl font-semibold mb-6">My Appointments</h1>

      {message && (
        <div className="bg-green-100 text-green-700 p-3 mb-4 rounded-lg border border-green-300">
          ✅ {message}
        </div>
      )}

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-lg border border-red-300">
          ❌ {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Appointment History</h2>

        {appointments.length === 0 ? (
            <p className="text-gray-500">No appointments yet.</p>
            ) : (
            appointments.map((a) => (
                <div key={a.id} className="border p-4 mb-3 rounded-lg bg-blue-50">
                <div className="font-semibold text-blue-700">
                    📅 {formatDate(a.start_time)}
                </div>

                <div className="text-sm mt-2">
                    🕐 {formatTime24(a.start_time)} - {formatTime24(a.end_time)}
                </div>

                <div className="text-sm">
                    👤 Specialist: {a.specialist?.name || "-"}
                </div>

                <div className="text-sm">📍 Status: {a.status}</div>

                {a.status === "LATE" && (
                    <div className="text-sm text-yellow-700">
                    ⏱ Delay: {a.delay_minutes} min
                    </div>
                )}

                {["SCHEDULED", "CONFIRMED"].includes(a.status) && (
                    <div className="flex gap-2 mt-3">
                    {a.status === "SCHEDULED" && (
                      <button
                        onClick={() => requestEmailConfirmation(a.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                      >
                        Confirm by Email
                      </button>
                    )}
                    <button
                        onClick={() => setAppointmentToCancel(a)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={() => {
                        localStorage.setItem("rescheduleAppointment", JSON.stringify(a));
                        nav("/dashboard");
                        }}
                        className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                    >
                        Reschedule
                    </button>
                    </div>
                )}
                </div>
            ))
            )}
        </div>
        {appointmentToCancel && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h3 className="text-lg font-semibold mb-2">Cancel Appointment</h3>

              <p className="text-sm text-gray-600 mb-4">
                Are you sure you want to cancel this appointment?
              </p>

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setAppointmentToCancel(null)}
                  className="bg-gray-500 text-white px-4 py-2 rounded"
                >
                  No
                </button>

                <button
                  onClick={() => cancelAppointment(appointmentToCancel.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded"
                >
                  Yes, cancel
                </button>
              </div>
            </div>
          </div>
        )}
    </MainLayout>
  );
}