import { useState } from "react";
import API from "../api/api";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    try {
      const res = await API.post("/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("Login successful. Redirecting...");

      const role = res.data.user.role;

      setTimeout(() => {
        if (role === "SPECIALIST") {
          nav("/specialist");
        } else if (role === "ADMIN") {
          nav("/admin");
        } else {
          nav("/dashboard");
        }
      }, 700);
    } catch (err) {
      console.log(err.response?.data);

      if (err.response?.status === 401) {
        setError("Invalid email or password.");
      } else if (err.response?.status === 403) {
        setError(err.response?.data?.error || "Please verify your email before logging in.");
      } else {
        setError(err.response?.data?.message || "Login failed.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

        <h2 className="text-2xl font-semibold text-center mb-6">
          Welcome Back
        </h2>

        {message && (
          <div className="bg-green-100 text-green-700 p-3 mb-4 rounded-lg border border-green-300 text-sm">
            {message}
          </div>
        )}

        {error && (
          <div className="bg-red-100 text-red-600 p-3 mb-4 rounded-lg border border-red-300 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm text-gray-600 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="text-right mb-4">
            <Link
              to="/forgot-password"
              className="text-sm text-blue-500 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Sign In
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-3 text-gray-400 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

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