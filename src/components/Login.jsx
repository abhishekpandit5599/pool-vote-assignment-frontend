import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API from '../APIs/API';
import useAuthRedirect from '../hooks/useAuthRedirect';

const Login = () => {
  useAuthRedirect();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await API.post('/api/v1/auth/login', { email, password });
      Cookies.set('token', response.data.result.token);
      toast.success('Login successful');
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid email or password');
      toast.error('Invalid email or password');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <form 
        className="w-full max-w-sm bg-white p-8 rounded shadow-md"
        onSubmit={handleLogin}
      >
        <h1 className="text-2xl font-bold mb-6">Login</h1>
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
        <div className="mb-4">
          <label className="block mb-2 text-gray-700">Password</label>
          <input
            className="w-full p-2 border border-gray-300 rounded"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <div className="flex justify-between items-center mb-4">
          <Link to="/forgot-password" className="text-blue-500 hover:underline">Forgot Password?</Link>
        </div>
        <button 
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          type="submit"
        >
          Login
        </button>
        {error && <p className="text-red-500 mt-4">{error}</p>}
        <div className="mt-4 text-center">
          <span>Don't have an account? </span>
          <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
        </div>
      </form>
      <ToastContainer />
    </div>
  );
};

export default Login;
