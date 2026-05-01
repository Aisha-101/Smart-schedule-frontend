import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../api/api";
import { useNavigate } from "react-router-dom";

export default function VerifyEmail() {
  const [params] = useSearchParams();
  const nav = useNavigate();

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");


  useEffect(() => {
    const verify = async () => {
        const id = params.get("id");
        const hash = params.get("hash");
      try {
        const res = await API.get(
          `/email/verify/${id}/${hash}`
        );

        setStatus("success");
        setMessage(res.data.message || "Email verified successfully!");

        setTimeout(() => {
            nav("/login");
        }, 3000);

      } catch (err) {
        console.log(err.response?.data);

        setStatus("error");
        setMessage(
          err.response?.data?.message || "Verification failed"
        );
      }
    };

    verify();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md text-center w-96">

        {status === "loading" && (
          <p className="text-gray-600">Verifying your email...</p>
        )}

        {status === "success" && (
          <div className="text-green-600">
            <h2 className="text-xl font-semibold mb-2">✅ Success</h2>
            <p>{message}</p>
          </div>
        )}

        {status === "error" && (
          <div className="text-red-600">
            <h2 className="text-xl font-semibold mb-2">❌ Error</h2>
            <p>{message}</p>
          </div>
        )}

      </div>
    </div>
  );
}