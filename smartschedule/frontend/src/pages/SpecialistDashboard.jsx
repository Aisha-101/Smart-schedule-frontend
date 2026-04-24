import { useEffect, useState } from "react";
import API from "../api/api";
import MainLayout from "../layouts/MainLayout";
import { getUser } from "../api/auth";

export default function SpecialistDashboard() {
  const user = getUser();

  const [appointments, setAppointments] = useState([]);
  const [availability, setAvailability] = useState([]);

  // availability form
  const [date, setDate] = useState("");
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");

  // service form
  const [serviceName, setServiceName] = useState("");
  const [price, setPrice] = useState("");

  const load = async () => {
    const appt = await API.get(`/appointments?specialist_id=${user.id}`);
    const avail = await API.get(`/specialists/${user.id}/schedule`);

    setAppointments(appt.data);
    setAvailability(avail.data);
  };

  useEffect(() => {
    load();
  }, []);

  // CREATE AVAILABILITY
  const addAvailability = async () => {
    await API.post(`/specialists/${user.id}/schedule`, {
      date,
      start_time,
      end_time,
    });

    setDate("");
    setStartTime("");
    setEndTime("");

    load();
  };
  
  // CREATE SERVICE
  const addService = async () => {
    await API.post(`/services`, {
      name: serviceName,
      price: price,
      specialist_id: user.id,
    });

    setServiceName("");
    setPrice("");
  };

  return (
    <MainLayout>
      <h1 className="text-2xl mb-6">Specialist Dashboard</h1>

      {/* ================= APPOINTMENTS ================= */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg mb-2">Appointments</h2>

        {appointments.length === 0 && <p>No appointments</p>}

        {appointments.map((a) => (
          <div key={a.id} className="border p-2 mb-2 rounded">
            <div>
              {a.date} | {a.start_time} - {a.end_time}
            </div>
          </div>
        ))}
      </div>

      {/* ================= AVAILABILITY ================= */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg mb-2">Set Availability</h2>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-2 mr-2"
        />

        <input
          type="time"
          value={start_time}
          onChange={(e) => setStartTime(e.target.value)}
          className="border p-2 mr-2"
        />

        <input
          type="time"
          value={end_time}
          onChange={(e) => setEndTime(e.target.value)}
          className="border p-2 mr-2"
        />

        <button
          onClick={addAvailability}
          className="bg-blue-500 text-white px-3 py-2 rounded"
        >
          Add
        </button>

        <div className="mt-4">
          {availability.map((a) => (
            <div key={a.id} className="border p-2 mb-2 rounded">
              {a.date} | {a.start_time} - {a.end_time}
            </div>
          ))}
        </div>
      </div>

      {/* ================= SERVICES ================= */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg mb-2">Create Service</h2>

        <input
          type="text"
          placeholder="Service name"
          value={serviceName}
          onChange={(e) => setServiceName(e.target.value)}
          className="border p-2 mr-2"
        />

        <input
          type="number"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="border p-2 mr-2"
        />

        <button
          onClick={addService}
          className="bg-green-500 text-white px-3 py-2 rounded"
        >
          Add Service
        </button>
      </div>
    </MainLayout>
  );
}