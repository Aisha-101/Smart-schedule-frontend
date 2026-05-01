import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api";
import { Eye, EyeOff } from "lucide-react";

export default function Register() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const getPasswordFeedback = (password) => {
        const rules = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            number: /[0-9]/.test(password),
            symbol: /[^A-Za-z0-9]/.test(password),
        };

        const missing = [];

        if (!rules.length) missing.push("at least 8 characters");
        if (!rules.uppercase) missing.push("an uppercase letter");
        if (!rules.number) missing.push("a number");
        if (!rules.symbol) missing.push("a symbol (!@#$.)");

        let strength = "Weak";

        const passed = Object.values(rules).filter(Boolean).length;

        if (passed >= 4) strength = "Strong";
        else if (passed >= 3) strength = "Medium";

        return { strength, missing };
    };

  const feedback = getPasswordFeedback(form.password);
  const [showPassword, setShowPassword] = useState(false);
  const passwordsMatch = 
    form.password &&
    form.password_confirmation && 
    form.password === form.password_confirmation;

  const [error, setError] = useState([]);
  const [message, setMessage] = useState("");
  const [emailSent, setEmailSent] = useState(false);
  
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const register = async () => {
    setError([]);
    setMessage("");

    if (feedback.strength !== "Strong") {
        setError(["Password is too weak. Please improve it."]);
        return;
    }

    try {
      await API.post("/register", form);

      setError([]);

      setMessage("Account created! Please check your email to verify your account.");
      setEmailSent(true);
      
    } catch (err) {
      if (err.response?.data?.errors) {
        setError(Object.values(err.response.data.errors).flat());
      } else {
        setError(["Registration failed"]);
      }
    }
  };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gray-100">
    <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-lg">

      <h2 className="text-2xl font-semibold text-center mb-6">
        Create Account
      </h2>

      {/* ERROR */}
      {!emailSent && error.length > 0 && (
        <div className="bg-red-100 text-red-600 p-3 mb-4 rounded-lg text-sm border border-red-300">
            <ul className="space-y-1">
                {error.map((err, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <span>❌</span>
                        <span>{err}</span>
                    </li>
                ))}
            </ul>
        </div>
    )}

      {/* SUCCESS SCREEN */}
      {emailSent ? (
        <div className="text-center">

          <div className="bg-green-100 text-green-700 p-4 rounded-lg border border-green-300 mb-4">
            <h3 className="font-semibold mb-1">✅ Check your email</h3>
            <p className="text-sm">
              We sent a verification link to <b>{form.email}</b>
            </p>
          </div>

          <button
            onClick={async () => {
              await API.post("/email/resend", { email: form.email });
              setMessage("Verification email resent!");
            }}
            className="text-blue-600 text-sm hover:underline"
          >
            Resend verification email
          </button>

          <p className="text-xs text-gray-500 mt-3">
            Didn’t receive it? Check spam folder.
          </p>

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
      ) : (
        <>
          {/* FORM */}

          {/* NAME */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Full Name</label>
            <input
              name="name"
              className="w-full border rounded-lg p-2"
              onChange={handleChange}
            />
          </div>

          {/* EMAIL */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">Email</label>
            <input
              name="email"
              type="email"
              className="w-full border rounded-lg p-2"
              onChange={handleChange}
            />
          </div>

          

          {/* PASSWORD */}
          <div className="mb-3 relative">
            <label className="block text-sm text-gray-600 mb-1">Password</label>

            <input
                name="password"
                type={showPassword ? "text" : "password"}
                onChange={handleChange}
                className="w-full border rounded-lg p-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

           <button
                type="button"
                title={showPassword ? "Hide password" : "Show password"}
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 text-gray-500 hover:text-gray-700 transition"
            >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>



                {form.password && (
                    <div className="mt-2">

                    {/* STRENGTH */}
                    <p
                        className={`text-sm font-medium ${
                        feedback.strength === "Strong"
                            ? "text-green-600"
                            : feedback.strength === "Medium"
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                    >
                        Strength: {feedback.strength}
                    </p>

                    {/* WHAT TO FIX */}
                    {feedback.missing.length > 0 && (
                        <p className="text-xs text-gray-500 mt-1">
                        Add {feedback.missing.join(", ")}
                        </p>
                    )}
                    </div>
                )}
            </div>

          {/* CONFIRM */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Confirm Password
            </label>
            <input
                name="password_confirmation"
                type="password"
                onChange={handleChange}
                className="w-full border rounded-lg p-2"
            />

            {form.password_confirmation && (
                <p
                className={`text-sm mt-1 ${
                    passwordsMatch ? "text-green-600" : "text-red-600"
                }`}
                >
                {passwordsMatch ? "✅ Passwords match" : "❌ Passwords do not match"}
                </p>
            )}
          </div>

          {/* BUTTON */}
          <button
            onClick={register}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create Account
          </button>
        </>
      )}

      {/* LOGIN LINK */}
      {!emailSent && (
        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <span
            onClick={() => nav("/login")}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>
      )}

    </div>
  </div>
);
}