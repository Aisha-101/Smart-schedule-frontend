import { useEffect, useState } from "react";
import API from "../api/api";
import MainLayout from "../layouts/MainLayout";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { getScoreColor, getScoreBorderColor, appointmentStatusColor } from "../utils/calendarHelpers";
import { Link } from "react-router-dom";

export default function ClientDashboard() {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const [date, setDate] = useState(tomorrow.toISOString().split("T")[0]);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [mode, setMode] = useState("book");
  const [appointments, setAppointments] = useState([]);
  const [recommendedSlots, setRecommendedSlots] = useState([]);
  const [services, setServices] = useState([]);
  const [specialists, setSpecialists] = useState([]);

  const [serviceId, setServiceId] = useState("");
  const [specialistId, setSpecialistId] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toISOString().split("T")[0];
  };

  const formatTime24 = (value) => {
        if (!value) return "-";

        if (value.includes(" ")) {
            return value.split(" ")[1].slice(0, 5);
        }

        if (value.includes("T")) {
            return value.split("T")[1].slice(0, 5);
        }

        return value.slice(0, 5);
    };

  const formatDateFromDateTime = (dateTime) => {
    if (!dateTime) return "-";
    return dateTime.split(" ")[0] || dateTime.split("T")[0];
  };

  const loadAppointments = async () => {
    try {
      const res = await API.get("/appointments/my");
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load appointments.");
    }
  };

  const loadServices = async () => {
    try {
      const res = await API.get("/services");
      setServices(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load services.");
    }
  };

  const loadSpecialists = async () => {
    try {
      const res = await API.get("/specialists");
      setSpecialists(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load specialists.");
    }
  };

  useEffect(() => {
    loadAppointments();
    loadServices();
    loadSpecialists();

    const saved = localStorage.getItem("rescheduleAppointment");

    if (saved) {
        const appointment = JSON.parse(saved);
        setSelectedAppointment(appointment);
        setSpecialistId(appointment.specialist_id);
        setMode("reschedule");
        setMessage("Select a new date and click Find Best Times to reschedule this appointment.");
        localStorage.removeItem("rescheduleAppointment");
    }
  }, []);

  const getRecommendations = async () => {
    setError("");
    setMessage("");

    if (!serviceId || !specialistId || !date) {
      setError("Please select service, specialist and date.");
      return;
    }

    try {
      const res = await API.get(
        `/recommendations?specialist_id=${specialistId}&service_id=${serviceId}&date=${date}`
      );

      setRecommendedSlots(res.data);

      if (res.data.length === 0) {
        setMessage("No available slots found for the selected date.");
      } else {
        setMessage("Available times loaded successfully.");
      }
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Failed to load available times.");
    }
  };

  const bookSlot = async (slot) => {
    setError("");
    setMessage("");

    try {
      await API.post("/appointments", {
        specialist_id: specialistId,
        start_time: slot.start,
        end_time: slot.end,
        services: [serviceId],
      });

      setMessage("Appointment booked successfully.");
      loadAppointments();
      setRecommendedSlots([]);
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Failed to book appointment.");
    }
  };

  const rescheduleSlot = async (slot) => {
    setError("");
    setMessage("");

    if (!selectedAppointment) {
      setError("Please select an appointment to reschedule.");
      return;
    }

    try {
      await API.put(`/appointments/${selectedAppointment.id}`, {
        start_time: slot.start,
        end_time: slot.end,
      });

      setMessage("Appointment rescheduled successfully.");
      setSelectedAppointment(null);
      setMode("book");
      setRecommendedSlots([]);
      loadAppointments();
    } catch (err) {
      console.log(err.response?.data);
      setError(
        err.response?.data?.message || "Failed to reschedule appointment."
      );
    }
  };

  const cancelAppointment = async (id) => {
    setError("");
    setMessage("");

    try {
      await API.delete(`/appointments/${id}`);

      setMessage("Appointment cancelled successfully.");
      loadAppointments();
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Failed to cancel appointment.");
    }
  };

  const calendarEvents = [
    ...appointments.map((a) => ({
        id: `appointment-${a.id}`,
        title: `${a.status}`,
        start: a.start_time,
        backgroundColor: appointmentStatusColor(a.status),
        borderColor: appointmentStatusColor(a.status),
        textColor: "#ffffff",
        extendedProps: {
            type: "appointment",
            appointment: a,
        },
    })),

    ...recommendedSlots.map((slot, index) => ({
        id: `slot-${index}`,
        title: `${slot.score > 0.8 ? "Best" : slot.score > 0.6 ? "Medium" : "Low"} · ${slot.score}`,
        start: slot.start,
        end: slot.end,
        backgroundColor: getScoreColor(slot.score),
        borderColor: getScoreBorderColor(slot.score),
        textColor: "#111827",
        extendedProps: {
            type: "recommendation",
            slot,
        },
    })),
  ];

  const handleCalendarEventClick = (info) => {
    const type = info.event.extendedProps.type;

    if (type !== "recommendation") return;

    const slot = info.event.extendedProps.slot;

    if (mode === "reschedule") {
        rescheduleSlot(slot);
    } else {
        bookSlot(slot);
    }
  };

  return (
    <MainLayout>
      <h1 className="text-2xl font-semibold mb-6">Client Dashboard</h1>

        <div className="mb-6">
            <Link
                to="/my-appointments"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
                View My Appointments
            </Link>
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

      {/* ================= BOOKING / RESCHEDULE ================= */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">
          {mode === "reschedule" ? "Reschedule Appointment" : "Book Appointment"}
        </h2>

        {mode === "reschedule" && selectedAppointment && (
          <div className="bg-yellow-100 text-yellow-800 p-4 rounded-lg border border-yellow-300 mb-4">
            <div className="font-semibold mb-1">🔁 Rescheduling appointment</div>
            <div className="text-sm">
              Current time:{" "}
              {formatDateFromDateTime(selectedAppointment.start_time)} |{" "}
              {formatTime24(selectedAppointment.start_time)} -{" "}
              {formatTime24(selectedAppointment.end_time)}
            </div>

            <button
              onClick={() => {
                setMode("book");
                setSelectedAppointment(null);
                setRecommendedSlots([]);
                setMessage("");
                setError("");
              }}
              className="mt-2 text-sm underline font-medium"
            >
              Cancel reschedule
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Service
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="border p-2 w-full rounded bg-white"
            >
              <option value="">Select Service</option>
              {services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Specialist
            </label>
            <select
              value={specialistId}
              onChange={(e) => setSpecialistId(e.target.value)}
              className="border p-2 w-full rounded bg-white"
              disabled={mode === "reschedule"}
            >
              <option value="">Select Specialist</option>
              {specialists.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
            {mode === "reschedule" && (
              <small className="text-gray-500">
                Specialist cannot be changed while rescheduling.
              </small>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              min={tomorrow.toISOString().split("T")[0]}
              onChange={(e) => setDate(e.target.value)}
              className="border p-2 w-full rounded bg-white"
            />
            {date && <small className="text-gray-600">{formatDate(date)}</small>}
          </div>

          <div className="flex items-end">
            <button
              onClick={getRecommendations}
              className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-600 transition font-semibold"
            >
              Find Best Times
            </button>
          </div>
        </div>

        {/* RECOMMENDED SLOTS */}
        <div className="mt-6">
          <h3 className="font-semibold mb-3 text-gray-800">
            Recommended Available Times:
          </h3>

          {recommendedSlots.length === 0 ? (
            <p className="text-gray-500 italic">No times loaded yet</p>
          ) : (
            recommendedSlots.map((slot, i) => (
              <div
                key={i}
                className={`border p-4 mb-3 rounded-lg ${
                  slot.score > 0.8
                    ? "bg-green-50 border-green-300"
                    : slot.score > 0.6
                    ? "bg-yellow-50 border-yellow-300"
                    : "bg-red-50 border-red-300"
                }`}
              >
                <div className="flex justify-between items-center gap-3">
                  <div>
                    <div className="font-semibold text-gray-800">
                      📅 {formatDateFromDateTime(slot.start)}
                    </div>
                    <div className="text-sm text-gray-700 mt-1">
                      🕐 {formatTime24(slot.start)} - {formatTime24(slot.end)}
                    </div>
                    <div className="text-sm text-gray-700">
                      ⭐ Score: {slot.score}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (mode === "reschedule") {
                        rescheduleSlot(slot);
                      } else {
                        bookSlot(slot);
                      }
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                  >
                    {mode === "reschedule" ? "Choose New Time" : "Book This Slot"}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Calendar View</h2>

        <div className="mb-3 text-sm text-gray-600">
            <span className="inline-block px-2 py-1 rounded bg-green-100 mr-2">
            Best score
            </span>
            <span className="inline-block px-2 py-1 rounded bg-yellow-100 mr-2">
            Medium score
            </span>
            <span className="inline-block px-2 py-1 rounded bg-red-100 mr-2">
            Low score
            </span>
            <span className="inline-block px-2 py-1 rounded bg-blue-100">
            Your appointments
            </span>
        </div>

        <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            events={calendarEvents}
            eventClick={handleCalendarEventClick}
            height="auto"
            slotMinTime="08:00:00"
            slotMaxTime="21:00:00"
            slotDuration="00:30:00"
            slotLabelInterval="00:30:00"
            allDaySlot={false}
            nowIndicator={true}
            headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
        />
        </div>
    </MainLayout>
  );
}