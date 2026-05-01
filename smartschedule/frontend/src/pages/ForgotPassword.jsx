import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import API from '../api/api';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const nav = useNavigate();

    const sendResetLink = async () => {
        setError("");
        setMessage("");

        try
        {
            await API.post("/forgot-password", { email});

            setMessage("Password reset link sent. Check your email.");
            
        }
        catch(err)
        {
            console.log(err.response?.data);

            setError(err.response?.data?.message || "Failed to send reset link");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

            <h2 className="text-2xl font-semibold text-center mb-6">
            Forgot Password
            </h2>

            {message && (
            <div className="bg-green-100 text-green-700 p-3 mb-4 rounded">
                {message}
            </div>
            )}

            {error && (
            <div className="bg-red-100 text-red-600 p-3 mb-4 rounded">
                {error}
            </div>
            )}

            <label className="block text-sm text-gray-600 mb-1">
            Email
            </label>

            <input
            type="email"
            placeholder="Enter your email"
            className="w-full border p-2 rounded mb-4 focus:ring-2 focus:ring-blue-500 outline-none"
            onChange={(e) => setEmail(e.target.value)}
            />

            <button
            onClick={sendResetLink}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
            >
            Send Reset Link
            </button>

            <p className="text-sm text-center mt-4">
            Back to{" "}
            <span
                onClick={() => nav("/login")}
                className="text-blue-500 cursor-pointer"
            >
                Login
            </span>
            </p>

        </div>
        </div>
  );
}