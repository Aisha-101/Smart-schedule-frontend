import {useEffect,useState} from "react";
import API from "../api/api";
import MainLayout from "../layouts/MainLayout";
import { getUser } from "../api/auth";

export default function ClientDashboard(){

    const [appointments,setAppointments]=useState([]);
    const [recommendedSlots,setRecommendedSlots]=useState([]);
    const [services,setServices]=useState([]);
    const [specialists,setSpecialists]=useState([]);

    const [serviceId,setServiceId]=useState("");
    const [specialistId,setSpecialistId]=useState("");

    const loadAppointments=async()=>{
    const res=await API.get("/appointments/my");
    setAppointments(res.data);
    };

    const loadServices=async()=>{
    const res=await API.get("/services");
    setServices(res.data);
    };

    const loadSpecialists=async()=>{
    const res=await API.get("/specialists");
    setSpecialists(res.data);
    };

    useEffect(()=>{
    loadAppointments();
    loadServices();
    loadSpecialists();
    },[]);


    const getRecommendations=async()=>{

    const res=await API.get(
    `/recommendations?service_id=${serviceId}&specialist_id=${specialistId}`
    );

    setRecommendedSlots(res.data);

    };


    const bookSlot=async(slot)=>{

    await API.post("/appointments",{
        client_id: user.id,
        specialist_id:specialistId,
        services:[serviceId],
        start_time:slot.start,
        end_time:slot.end
    });

    alert("Appointment booked");

    loadAppointments();

    };


    const cancelAppointment=async(id)=>{

    await API.delete(`/appointments/${id}`);

    loadAppointments();

    };



    return(
    <MainLayout>

    <h1 className="text-3xl mb-6">
    Client Dashboard
    </h1>


    {/* BOOKING */}
    <div className="bg-white p-6 rounded shadow mb-8">

    <h2 className="text-xl mb-4">
    Book Appointment
    </h2>

    <select
    value={serviceId}
    onChange={(e)=>setServiceId(e.target.value)}
    className="border p-2 mr-3"
    >
    <option>Select Service</option>

    {services.map(s=>(
    <option key={s.id} value={s.id}>
    {s.name}
    </option>
    ))}

    </select>


    <select
    value={specialistId}
    onChange={(e)=>setSpecialistId(e.target.value)}
    className="border p-2 mr-3"
    >
    <option>Select Specialist</option>

    {specialists.map(s=>(
    <option key={s.id} value={s.id}>
    {s.name}
    </option>
    ))}

    </select>

    <button
    onClick={getRecommendations}
    className="bg-blue-500 text-white px-4 py-2 rounded"
    >
    Find Best Times
    </button>


    <div className="mt-6">

    {recommendedSlots.map((slot,i)=>(

    <div
    key={i}
    className={`border p-3 mb-2 rounded
    ${
    slot.score>.8
    ?"bg-green-100"
    :slot.score>.6
    ?"bg-yellow-100"
    :"bg-red-100"
    }`}
    >

    <div>
    {slot.start}

    <span className="ml-3">
    Score:
    {slot.score}
    </span>

    </div>

    <button
    onClick={()=>bookSlot(slot)}
    className="mt-2 bg-green-600 text-white px-3 py-1 rounded"
    >
    Book This Slot
    </button>

    </div>

    ))}

    </div>

    </div>



    {/* MY APPOINTMENTS */}
    <div className="bg-white p-6 rounded shadow">

    <h2 className="text-xl mb-4">
    My Appointments
    </h2>

    {appointments.map(a=>(

    <div
    key={a.id}
    className="border p-3 mb-3 rounded"
    >

    <div>
    {a.start_time}
    </div>

    <div>
    Specialist:
    {a.specialist?.name}
    </div>

    <button
    onClick={()=>cancelAppointment(a.id)}
    className="bg-red-500 text-white px-3 py-1 mt-2 rounded"
    >
    Cancel
    </button>

    </div>

    ))}

    </div>

    </MainLayout>

    )

}