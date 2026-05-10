import { useEffect, useState } from "react";
import API from "../api/api";
import MainLayout from "../layouts/MainLayout";
import { getUser } from "../api/auth";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

import { appointmentStatusColor } from "../utils/calendarHelpers";

export default function SpecialistSchedule() {
  const user = getUser();
  const userId = user?.id;


  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);
  const [error, setError] = useState("");

  const loadSchedule = async () => {
    setError("");

    try {
      const appt = await API.get("/appointments/my");
      const avail = await API.get(`/specialists/${userId}/schedule`);

      setAppointments(appt.data);
      setAvailability(avail.data);
    } catch (err) {
      console.log(err.response?.data);
      setError(err.response?.data?.message || "Failed to load schedule.");
    }
  };

  useEffect(() => {
    loadSchedule();
  }, []);

  const calendarEvents = [
    ...availability.map((slot) => ({
      id: `availability-${slot.id}`,
      title: "Available",
      start: `${slot.date} ${slot.start_time}`,
      end: `${slot.date} ${slot.end_time}`,
      display: "background",
      backgroundColor: "#dcfce7",
      extendedProps: {
        type: "availability",
        availability: slot,
      },
    })),

    ...appointments
      .filter((a) => a.status !== "CANCELED")
      .map((a) => ({
        id: `appointment-${a.id}`,
        title: `${a.client?.name || "Client"} · ${a.status}`,
        start: a.start_time,
        end: a.end_time,
        backgroundColor: appointmentStatusColor(a.status),
        borderColor: appointmentStatusColor(a.status),
        textColor: "#ffffff",
        extendedProps: {
          type: "appointment",
          appointment: a,
        },
      })),
  ];

  return (
    <MainLayout>
      <h1 className="text-2xl font-semibold mb-6">My Schedule</h1>

      {error && (
        <div className="bg-red-100 text-red-700 p-3 mb-4 rounded-lg border border-red-300">
          ❌ {error}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Calendar</h2>

        <div className="mb-4 flex flex-wrap gap-2 text-sm">
          <span className="px-3 py-1 rounded bg-green-100 text-green-700 border border-green-300">
            Availability
          </span>
          <span className="px-3 py-1 rounded bg-blue-100 text-blue-700 border border-blue-300">
            Scheduled
          </span>
          <span className="px-3 py-1 rounded bg-yellow-100 text-yellow-700 border border-yellow-300">
            Late
          </span>
          <span className="px-3 py-1 rounded bg-gray-100 text-gray-700 border border-gray-300">
            No-show
          </span>
        </div>

        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridDay"
          events={calendarEvents}
          height={650}
          contentHeight={650}
          expandRows={false}
          slotMinTime="08:00:00"
          slotMaxTime="21:00:00"
          slotDuration="00:30:00"
          slotLabelInterval="01:00:00"
          allDaySlot={false}
          nowIndicator={true}
          eventTimeFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridDay,timeGridWeek",
          }}
        />
      </div>
    </MainLayout>
  );
}