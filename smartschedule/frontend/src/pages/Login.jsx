import { useState } from 'react';
import API from "../api/api";
import { Link, useNavigate } from "react-router-dom";


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
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

        {/* TITLE */}
        <h2 className="text-2xl font-semibold text-center mb-6">
            Welcome Back
        </h2>

        {/* EMAIL */}
        <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
            Email
            </label>
            <input
            type="email"
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            />
        </div>

        {/* PASSWORD */}
        <div className="mb-2">
            <label className="block text-sm text-gray-600 mb-1">
            Password
            </label>
            <input
            type="password"
            className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            />
        </div>

        {/* FORGOT PASSWORD */}
        <div className="text-right mb-4">
            <Link
            to="/forgot-password"
            className="text-sm text-blue-500 hover:underline"
            >
            Forgot password?
            </Link>
        </div>

        {/* LOGIN BUTTON */}
        <button
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
        >
            Sign In
        </button>

        {/* DIVIDER */}
        <div className="my-6 flex items-center">
            <div className="flex-1 h-px bg-gray-300"></div>
            <span className="px-3 text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        {/* REGISTER */}
        <p className="text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <span
            onClick={() => nav("/register")}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
            >
            Register
            </span>
        </p>

        </div>
    </div>
    );
      
        
}
