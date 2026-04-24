import { useState } from 'react';
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const nav = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();

        try{
        const res = await API.post("/login",{
            email,
            password
        });

        localStorage.setItem("token",res.data.token);
        localStorage.setItem("user",JSON.stringify(res.data.user));

        const role = res.data.user.role;

        if(role === "SPECIALIST"){
            nav("/specialist");
        }
        else if(role === "ADMIN"){
            nav("/admin");
        }
        else{
            nav("/dashboard");
        }

        } catch(err){
            console.log(err);
        }
    }

    return (
        <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-xl shadow w-80">
            <h2 className="text-xl mb-4">Login</h2>

            <input
                className="border w-full p-2 mb-2"
                placeholder="Email"
                onChange={(e) => setEmail(e.target.value)}
            />

            <input
                className="border w-full p-2 mb-2"
                type="password"
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
            />

            <button
          onClick={handleLogin}
          className="bg-blue-500 text-white w-full p-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
