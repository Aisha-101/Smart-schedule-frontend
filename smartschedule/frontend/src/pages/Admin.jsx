import { useEffect, useState } from "react";
import API from "../api/api";
import MainLayout from "../layouts/MainLayout";

export default function Admin() {
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");

  const load = () => {
    API.get("/services").then((res) => setServices(res.data));
  };

  useEffect(load, []);

  const create = async () => {
    await API.post("/services", {
      name,
      duration: 60,
      price: 20,
    });
    setName("");
    load();
  };

  return (
    <MainLayout>
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-xl font-semibold mb-4">Service Management</h1>

        <div className="flex gap-2 mb-4">
          <input
            className="border p-2 flex-1 rounded"
            placeholder="Service name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button
            onClick={create}
            className="bg-blue-500 text-white px-4 rounded"
          >
            Add
          </button>
        </div>

        {services.map((s) => (
          <div key={s.id} className="border p-3 rounded mb-2">
            {s.name}
          </div>
        ))}
      </div>
    </MainLayout>
  );
}