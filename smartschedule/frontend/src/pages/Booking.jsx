import { useEffect, useState } from "react";
import API from "../api/api";
import MainLayout from "../layouts/MainLayout";

export default function Booking() {
  const [slots, setSlots] = useState([]);

  const loadRecommendations = async () => {
    const res = await API.get(
      "/recommendations?specialist_id=1&service_id=1"
    );
    setSlots(res.data);
  };

  useEffect(() => {
    loadRecommendations();
  }, []);

  const book = async (time) => {
    await API.post("/appointments", {
      specialist_id: 1,
      start_time: time,
      services: [1],
    });

    alert("Booked!");
    loadRecommendations();
  };

  return (
    <MainLayout>
      <h1 className="text-2xl mb-4">Book Appointment</h1>

      {slots.map((s, i) => (
        <div
          key={i}
          className="p-3 border rounded mb-2 flex justify-between items-center"
        >
          <div className={`p-3 border rounded mb-2 ${
            s.score > 0.8
                ? "bg-green-100"
                : s.score > 0.5
                ? "bg-yellow-100"
                : "bg-red-100"
            }`}>
                
            {s.time}
            <span className="ml-2 text-sm text-gray-500">
              Score: {s.score}
            </span>
          </div>

          <button
            onClick={() => book(s.time)}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Book
          </button>
        </div>
      ))}
    </MainLayout>
  );
}