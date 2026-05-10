import { useEffect, useState } from "react";
import API from "../api/api";
import MainLayout from "../layouts/MainLayout";
import { getUser } from "../api/auth";


export default function SpecialistDashboard() {
  const user = getUser();
  const userId = user?.id;

  const [availability, setAvailability] = useState([]);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate()+1);
  const [date,setDate] = useState(tomorrow.toISOString().split("T")[0]);
  const [start_time, setStartTime] = useState("");
  const [end_time, setEndTime] = useState("");
  const [serviceName, setServiceName] = useState("");
  const [duration, setDuration] = useState("");
  const [price, setPrice] = useState("");
  const [error, setError] = useState("");
  const [services, setServices] = useState([]);
  const [message, setMessage] = useState("");

  const statusLabel = (status) => {
    const labels = {
      COMPLETED: "completed",
      LATE: "late",
      NO_SHOW: "no-show",
      CANCELED: "canceled",
      SCHEDULED: "scheduled",
    };
    return labels[status] || status;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";

    return new Date(dateStr)
    .toISOString()
    .split("T")[0];
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

  const load = async () => {
    try {
      const avail = await API.get(`/specialists/${userId}/schedule`);

      const servicesRes = await API.get("/my-services");
      
      
      setAvailability(avail.data);
      setServices(servicesRes.data);

    } catch (err) {
      console.error("Error loading data:", err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // CREATE AVAILABILITY
  const addAvailability = async () => {
    setError("");
    setMessage("");

    if (!date || !start_time || !end_time) {
        setError("All fields are required");
      return;
    }

    
    if (start_time >= end_time) {
        setError("End time must be after start time");
      return;
    }

    try {
      console.log("Sending:", { date, start_time, end_time });

      await API.post(`/specialists/${userId}/schedule`, {
        date,
        start_time,
        end_time,
      });

      setDate(tomorrow.toISOString().split("T")[0]);
      setStartTime("");
      setEndTime("");
      setMessage("Availability slot added successfully.");
      load();
    } catch (err) {
        console.error("Full error:", err.response);
        setError(err.response?.data?.error || "Failed to add availability");
    }
    };

  const generateTimes = () => {
    let times = [];

    for(let h=8; h<=20; h++){
    ["00","30"].forEach(m=>{
        times.push(
            `${String(h).padStart(2,"0")}:${m}`
        );
    });
    }

    return times;
    };

const timeOptions = generateTimes();
  // CREATE SERVICE
  const addService = async () => {
    setError("");
    setMessage("");

    if (!serviceName || !duration || !price) {
      setError("All service fields are required");
      return;
    }

    try {
      await API.post(`/services`, {
        name: serviceName,
        duration: parseInt(duration),
        price: parseFloat(price),
      });

      setServiceName("");
      setDuration("");
      setPrice("");
      setError("");
      setMessage("Service created successfully.");
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create service");
    }
  };


  const today = new Date().toISOString().split("T")[0];

  const futureAvailability = availability.filter((slot) => {
    return slot.date >= today;
  });
    

  return (
    <MainLayout>
      <h1 className="text-2xl font-semibold mb-6">Specialist Dashboard</h1>

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
      

      {/* ================= AVAILABILITY ================= */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Set Availability</h2>



        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              📅 Date 
            </label>
            <input
                type="date"
                value={date}
                min={tomorrow.toISOString().split("T")[0]}
                onChange={(e)=>setDate(e.target.value)}
            />
            {date && (
              <small className="text-gray-600">{formatDate(date)}</small>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
                🕐 Start Time
            </label>

            <select
                value={start_time}
                onChange={(e)=>setStartTime(e.target.value)}
                className="border p-2 w-full rounded"
            >
            <option value="">Select time</option>

            {timeOptions.map(t=>(
                <option key={t} value={t}>
                {t}
                </option>
            ))}

            </select>
            </div>

          <div>
            <label className="block text-sm font-medium mb-1">
                🕐 End Time
            </label>

            <select
                value={end_time}
                onChange={(e)=>setEndTime(e.target.value)}
                className="border p-2 w-full rounded"
            >
            <option value="">Select time</option>

            {timeOptions.map(t=>(
                <option key={t} value={t}>
                {t}
                </option>
            ))}

            </select>
            </div>

          <div className="flex items-end">
            <button
              onClick={addAvailability}
              className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-600 transition font-semibold"
            >
              ➕ Add Slot
            </button>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="font-semibold mb-3 text-gray-800">
            Your Available Slots:
          </h3>
          {futureAvailability.length === 0 ? (
            <p className="text-gray-500 italic">No availability set</p>
          ) : (
            futureAvailability.map((a) => (
              <div
                key={a.id}
                className="border p-4 mb-3 rounded-lg bg-green-50 border-green-300"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-semibold text-green-700">
                      📅 {formatDate(a.date)}
                    </span>
                    <span className="ml-4 text-gray-700">
                      🕐 {formatTime24(a.start_time)} - {formatTime24(a.end_time)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ================= SERVICES ================= */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Create Service</h2>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          <input
            type="text"
            placeholder="Service Name"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
            className="border p-2 rounded"
          />

          <input
            type="number"
            placeholder="Duration (minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="border p-2 rounded"
            min="15"
            step="15"
          />

          <input
            type="number"
            placeholder="Price (€)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="border p-2 rounded"
            min="0"
            step="0.01"
          />

          <button
            onClick={addService}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition font-semibold col-span-1 md:col-span-2"
          >
            ➕ Add Service
          </button>
        </div>

        <div className="mt-6">
            <h3 className="font-semibold mb-3 text-gray-800">
                Your Services:
            </h3>

            {services.length === 0 ? (
            <p className="text-gray-500 italic">
                No services created yet
            </p>
            ) : (
                services.map(service => (
                <div
                key={service.id}
                className="border p-4 mb-3 rounded-lg bg-blue-50 border-blue-300"
                >
                    <div className="flex justify-between items-center">
                        <div>
                            <div className="font-semibold text-blue-700">
                                ✂ {service.name}
                            </div>

                            <div className="text-sm text-gray-700 mt-1">
                            ⏱ {service.duration} mins
                            </div>

                            <div className="text-sm text-gray-700">
                            💶 €{service.price}
                            </div>

                         </div>
                    </div>
                </div>
                ))
                )}
            </div>
      </div>
    </MainLayout>
  );
}