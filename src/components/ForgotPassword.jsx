import React, { useState } from 'react';
import API from '../APIs/API';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/v1/auth/forgot-password', { email });
      setIsOtpSent(true);
      toast.success('OTP sent to your email');
    } catch (error) {
      toast.error(error.response.data.error ?? 'Failed to send OTP');
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await API.post('/api/v1/auth/reset-password', { email, otp, newPassword });
      toast.success('Password reset successful');
      navigate('/login');
    } catch (error) {
      toast.error(error.response.data.error ?? 'Password reset failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form 
        className="w-full max-w-sm bg-white p-8 rounded shadow-md"
        onSubmit={isOtpSent ? handleResetPassword : handleSendOtp}
      >
        <h1 className="text-2xl font-bold mb-6">Forgot Password</h1>
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Email</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        {isOtpSent && (
          <>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700">OTP</label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="OTP"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block mb-2 text-gray-700">New Password</label>
              <input
                className="w-full p-2 border border-gray-300 rounded"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                required
              />
            </div>
          </>
        )}
        <button 
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          type="submit"
        >
          {isOtpSent ? 'Reset Password' : 'Send OTP'}
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default ForgotPassword;
