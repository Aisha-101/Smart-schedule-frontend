import { useEffect, useState } from "react";
import API from "../api/api";
import MainLayout from "../layouts/MainLayout";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [services, setServices] = useState([]);
  const [editingService, setEditingService] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    duration: "",
    price: "",
  });

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [serviceToDelete, setServiceToDelete] = useState(null);

  const loadStatistics = async (customFrom = fromDate, customTo = toDate) => {
    setError("");
    setMessage("");

    try {
      const params = new URLSearchParams();

      if (customFrom) params.append("from", customFrom);
      if (customTo) params.append("to", customTo);

      const res = await API.get(`/statistics?${params.toString()}`);

      setStats(res.data);
      setMessage("Statistics loaded successfully.");
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Failed to load statistics.");
    }
  };

  const loadAppointments = async ()=> {
    setError("");
    try {
      const res = await API.get("/appointments");
      setAppointments(res.data);
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Failed to load appointments.");
    }
  };

  const loadServices = async () => {
    const res = await API.get("/services");
    setServices(res.data);
  };

  const startEditService = (service) => {
    setEditingService(service.id);
    setEditForm({
      name: service.name,
      duration: service.duration,
      price: service.price,
    });
  };

  const updateService = async (id) => {
    setError("");
    setMessage("");

    try {
      await API.put(`/services/${id}`, {
        name: editForm.name,
        duration: Number(editForm.duration),
        price: Number(editForm.price),
      });

      setMessage("Service updated successfully.");
      setEditingService(null);
      loadServices();
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Failed to update service.");
    }
  };

  const deleteService = async (id) => {
    setError("");
    setMessage("");

    try {
      await API.delete(`/services/${id}`);

      setMessage("Service deleted successfully.");
      loadServices();
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Failed to delete service.");
    }
  };
  useEffect(() => {
    loadStatistics();
    loadServices();
    loadAppointments();
  }, []);

  const card = (title, value, subtitle = "") => (
    <div className="bg-white p-5 rounded-lg shadow border">
      <p className="text-sm text-gray-500">{title}</p>
      <h3 className="text-2xl font-semibold mt-1">{value}</h3>
      {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
    </div>
  );

  const filteredAppointments =
  statusFilter === "ALL"
    ? appointments
    : appointments.filter((a) => a.status === statusFilter);

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
  return (
    <MainLayout>
      <h1 className="text-2xl font-semibold mb-6">Admin Dashboard</h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
      <h2 className="text-lg font-semibold mb-4">Filter Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium mb-1">From</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">To</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        <div className="flex items-end">
          <button
            onClick={() => loadStatistics()}
            className="bg-blue-600 text-white px-4 py-2 rounded w-full hover:bg-blue-700 transition"
          >
            Apply Filter
          </button>
        </div>
      </div>

      {(fromDate || toDate) && (
        <button
          onClick={() => {
            setFromDate("");
            setToDate("");
            loadStatistics("", "");
          }}
          className="text-sm text-blue-600 hover:underline mt-3"
        >
          Clear date filter
        </button>
      )}
    </div>
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

      {!stats ? (
        <p className="text-gray-500">Loading statistics...</p>
      ) : (
        <>
          {/* SUMMARY */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">System Statistics</h2>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {card("Total Appointments", stats.summary.total_appointments)}
              {card("Scheduled", stats.summary.scheduled)}
              {card("Completed", stats.summary.completed)}
              {card("Canceled", `${stats.summary.canceled_percentage}%`, `${stats.summary.canceled} canceled`)}
              {card("No-show", `${stats.summary.no_show_percentage}%`, `${stats.summary.no_shows} no-shows`)}
              {card("Late", `${stats.summary.late_percentage}%`, `${stats.summary.late} late appointments`)}
              {card("Average Delay", `${stats.summary.average_delay_minutes} min`)}
              {card("Services", stats.summary.services_count)}
              {card("Clients", stats.summary.clients_count)}
              {card("Specialists", stats.summary.specialists_count)}
            </div>
          </div>

          {/* SPECIALIST LOAD */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-lg font-semibold mb-4">Specialist Load</h2>

            {stats.specialist_load.length === 0 ? (
              <p className="text-gray-500 italic">No appointment data yet.</p>
            ) : (
              stats.specialist_load.map((item) => (
                <div
                  key={item.id}
                  className="border p-4 mb-3 rounded-lg bg-blue-50 border-blue-300"
                >
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-blue-700">
                        👤 {item.name}
                      </div>
                      <div className="text-sm text-gray-700">
                        {item.email}
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-semibold">
                        {item.appointment_count}
                      </div>
                      <div className="text-xs text-gray-500">
                        appointments
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* BUSY HOURS */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-4">Busiest Hours</h2>

            {stats.busy_hours.length === 0 ? (
              <p className="text-gray-500 italic">No appointment data yet.</p>
            ) : (
              stats.busy_hours.map((hour) => (
                <div
                  key={hour.hour}
                  className="border p-4 mb-3 rounded-lg bg-green-50 border-green-300"
                >
                  <div className="flex justify-between items-center">
                    <div className="font-semibold text-green-700">
                      🕐 {String(hour.hour).padStart(2, "0")}:00
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-semibold">
                        {hour.count}
                      </div>
                      <div className="text-xs text-gray-500">
                        appointments
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* SERVICES MANAGEMENT */}
          <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-lg font-semibold mb-4">Services Management</h2>

          {services.length === 0 ? (
            <p className="text-gray-500 italic">No services found.</p>
          ) : (
            services.map((service) => (
              <div
                key={service.id}
                className="border p-4 mb-3 rounded-lg bg-blue-50 border-blue-300"
              >
                {editingService === service.id ? (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <input
                      value={editForm.name}
                      onChange={(e) =>
                        setEditForm({ ...editForm, name: e.target.value })
                      }
                      className="border p-2 rounded"
                    />

                    <input
                      type="number"
                      value={editForm.duration}
                      onChange={(e) =>
                        setEditForm({ ...editForm, duration: e.target.value })
                      }
                      className="border p-2 rounded"
                    />

                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) =>
                        setEditForm({ ...editForm, price: e.target.value })
                      }
                      className="border p-2 rounded"
                    />

                    <div className="flex gap-2">
                      <button
                        onClick={() => updateService(service.id)}
                        className="bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Save
                      </button>

                      <button
                        onClick={() => setEditingService(null)}
                        className="bg-gray-500 text-white px-3 py-1 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div>
                      <div className="font-semibold text-blue-700">
                        ✂ {service.name}
                      </div>

                      <div className="text-sm text-gray-700">
                        Specialist: {service.specialist?.name || "-"}
                      </div>

                      <div className="text-sm text-gray-700">
                        ⏱ {service.duration} mins
                      </div>

                      <div className="text-sm text-gray-700">
                        💶 €{service.price}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEditService(service)}
                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => setServiceToDelete(service)}
                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
        </>
      )}
      {serviceToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
            <h3 className="text-lg font-semibold mb-2">Delete Service</h3>

            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete{" "}
              <strong>{serviceToDelete.name}</strong>? This action cannot be undone.
            </p>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setServiceToDelete(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition"
              >
                Cancel
              </button>

              <button
                onClick={async () => {
                  await deleteService(serviceToDelete.id);
                  setServiceToDelete(null);
                }}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">All Appointments</h2>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="ALL">All statuses</option>
            <option value="SCHEDULED">Scheduled</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELED">Canceled</option>
            <option value="NO_SHOW">No-show</option>
            <option value="LATE">Late</option>
          </select>
        </div>

        {filteredAppointments.length === 0 ? (
          <p className="text-gray-500">No appointments found.</p>
        ) : (
          filteredAppointments.map((a) => (
            <div key={a.id} className="border p-4 mb-3 rounded-lg bg-blue-50">
              <div className="font-semibold text-blue-700">
                📅 {formatDate(a.start_time)}
                <br />
                🕐 {formatTime24(a.start_time)} - {formatTime24(a.end_time)}
              </div>

              <div className="text-sm">Client: {a.client?.name || "-"}</div>
              <div className="text-sm">Specialist: {a.specialist?.name || "-"}</div>
              <div className="text-sm">Status: {a.status}</div>

              {a.status === "LATE" && (
                <div className="text-sm text-yellow-700">
                  Delay: {a.delay_minutes} min
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </MainLayout>
  );
}