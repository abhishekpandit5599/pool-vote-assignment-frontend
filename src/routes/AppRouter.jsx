import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from '../components/Login';
import Register from '../components/Register';
import ForgotPassword from '../components/ForgotPassword';
import Dashboard from '../components/Dashboard';
import PoolDetails from '../components/PoolDetails';
import Chat from '../components/Chat';
import CreatePool from '../components/CreatePool';

const AppRouter = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pool/:id" element={<PoolDetails />} />
      <Route path="/chat/:poolId" element={<Chat />} />
      <Route path="/create-pool" element={<CreatePool />} />
      <Route exact path="/" element={<Login />} />
    </Routes>
  </Router>
);

export default AppRouter;
