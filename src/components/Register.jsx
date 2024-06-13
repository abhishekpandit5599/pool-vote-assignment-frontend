import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API from "../APIs/API";
import useAuthRedirect from '../hooks/useAuthRedirect';

const Register = () => {
  useAuthRedirect();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/v1/auth/register", { email, password });
      handleSendOTP();
    } catch (error) {
      toast.error(error.response.data.error ?? "Registration failed");
    }
  };

  const handleSendOTP = async () => {
    try {
      await API.post("/api/v1/auth/send-otp", { email });
      setIsOtpSent(true);
      toast.success("OTP sent to your email!");
    } catch (error) {
      toast.error(error.response.data.error ?? "Registration failed");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/v1/auth/verify-otp", { email, otp });
      toast.success("Registration successful!");
      navigate("/login");
    } catch (error) {
      toast.error(error.response.data.error ?? "OTP verification failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form
        className="w-full max-w-sm bg-white p-8 rounded shadow-md"
        onSubmit={isOtpSent ? handleVerifyOtp : handleRegister}
      >
        <h1 className="text-2xl font-bold mb-6">
          {isOtpSent ? "Verify OTP" : "Register"}
        </h1>
        <div className="mb-4">
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div className="mb-4">
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        {isOtpSent && (
          <div className="mb-4">
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="OTP"
              required
            />
          </div>
        )}
        <button
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          type="submit"
        >
          {isOtpSent ? "Verify OTP" : "Register"}
        </button>
        <div className="mt-4 text-center">
          <span>Already have an account? </span>
          <Link to="/login" className="text-blue-500 hover:underline">
            Login
          </Link>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Register;
