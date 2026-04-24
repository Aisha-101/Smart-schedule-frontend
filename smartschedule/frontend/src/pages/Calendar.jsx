import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useEffect, useState } from "react";
import API from "../api/api";
import MainLayout from "../layouts/MainLayout";

export default function Calendar() {
  const [events, setEvents] = useState([]);

  const loadAppointments = async () => {
    const res = await API.get("/appointments");

    setEvents(
      res.data.map((a) => ({
        id: a.id,
        title: "Visit",
        start: a.start_time,
        end: a.end_time,
      }))
    );
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  // 🔥 CREATE BY CLICK
  const handleDateClick = async (info) => {
    try {
      await API.post("/appointments", {
        specialist_id: 1,
        start_time: info.dateStr,
        services: [1],
      });

      loadAppointments();
    } catch (err) {
      alert(err.response?.data?.error || "Cannot create");
    }
  };

  // 🔥 DRAG
  const handleEventDrop = async (info) => {
    try {
      await API.put(`/appointments/${info.event.id}`, {
        start_time: info.event.start,
      });
    } catch (err) {
      alert("Conflict or error");
      info.revert();
    }
  };

  // 🔥 RESIZE
  const handleEventResize = async (info) => {
    try {
      await API.put(`/appointments/${info.event.id}`, {
        start_time: info.event.start,
      });
    } catch {
      alert("Resize failed");
      info.revert();
    }
  };

  // 🔥 DELETE
  const handleEventClick = async (info) => {
    if (confirm("Delete appointment?")) {
      await API.delete(`/appointments/${info.event.id}`);
      loadAppointments();
    }
  };

  return (
    <MainLayout>
      <div className="bg-white rounded-xl shadow p-4">
        <FullCalendar
          plugins={[timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          editable={true}
          selectable={true}
          events={events}
          dateClick={handleDateClick}
          eventDrop={handleEventDrop}
          eventResize={handleEventResize}
          eventClick={handleEventClick}
          height="80vh"
        />
      </div>
    </MainLayout>
  );
}