import { useEffect, useState } from "react";
import API from "../api/api";
import MainLayout from "../layouts/MainLayout";

export default function SpecialistAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  
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

        const sorted = [...res.data].sort(
        (a, b) => new Date(b.start_time) - new Date(a.start_time)
        );

        setAppointments(sorted);
    } catch (err) {
        console.log(err.response?.data);
        setError(err.response?.data?.message || "Failed to load appointments.");
    }
    };

  const statusLabel = (status) => {
    const labels = {
      COMPLETED: "completed",
      LATE: "late",
      NO_SHOW: "no-show",
      CANCELED: "canceled",
      SCHEDULED: "scheduled",
      CONFIRMED: "confirmed",
    };

    return labels[status] || status;
  };

  const updateAppointmentStatus = async (appointmentId, status) => {
    setError("");
    setMessage("");

    try {
      await API.put(`/appointments/${appointmentId}/status`, {
        status,
      });

      setMessage(`Appointment marked as ${statusLabel(status)}.`);
      loadAppointments();
    } catch (err) {
      console.error(err.response?.data);
      setError(
        err.response?.data?.message || "Failed to update appointment status."
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

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Client Appointments</h2>

        {appointments.length === 0 ? (
          <p className="text-gray-500">No appointments</p>
        ) : (
          appointments.map((a) => (
            <div key={a.id} className="border p-4 mb-3 rounded-lg bg-blue-50">
              <div className="font-semibold text-blue-700">
                📅 {formatDate(a.start_time)}
              </div>

              <div className="text-sm mt-2">
                ⏰ {formatTime24(a.start_time)} - {formatTime24(a.end_time)}
              </div>

              <div className="text-sm">👤 Client: {a.client?.name || "-"}</div>
              <div className="text-sm">
                ⭐ Client reliability:{" "}
                {a.client_reliability !== undefined ? a.client_reliability : "-"}
              </div>
              <div className="text-sm">
                ✂️ Services:{" "}
                {a.services?.length > 0
                    ? a.services.map((service) => service.name).join(", ")
                    : "-"}
              </div>
              <div className="text-sm">📍 Status: {a.status}</div>

              {a.status === "LATE" && (
                <div className="text-sm text-yellow-700">
                  ⏱ Delay: {a.delay_minutes} min
                </div>
              )}

              {["SCHEDULED", "CONFIRMED"].includes(a.status) && (
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={() => updateAppointmentStatus(a.id, "COMPLETED")}
                    className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  >
                    Completed
                  </button>

                  <button
                    onClick={() => updateAppointmentStatus(a.id, "LATE")}
                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 transition"
                  >
                    Late
                  </button>

                  <button
                    onClick={() => updateAppointmentStatus(a.id, "NO_SHOW")}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    No-show
                  </button>

                  <button
                    onClick={() => setAppointmentToCancel(a)}
                    className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-800 transition"
                    >
                    Cancel
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
                    Are you sure you want to cancel this appointment? The client will be
                    informed by email.
                </p>

                <div className="text-sm text-gray-700 mb-4">
                    📅 {formatDate(appointmentToCancel.start_time)}
                    <br />
                    ⏰ {formatTime24(appointmentToCancel.start_time)} -{" "}
                    {formatTime24(appointmentToCancel.end_time)}
                    <br />
                    👤 Client: {appointmentToCancel.client?.name || "-"}
                </div>

                <div className="flex justify-end gap-2">
                    <button
                    onClick={() => setAppointmentToCancel(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                    Keep Appointment
                    </button>

                    <button
                    onClick={async () => {
                        await updateAppointmentStatus(appointmentToCancel.id, "CANCELED");
                        setAppointmentToCancel(null);
                    }}
                    className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                    >
                    Cancel Appointment
                    </button>
                </div>
                </div>
            </div>
        )}
    </MainLayout>
  );
}