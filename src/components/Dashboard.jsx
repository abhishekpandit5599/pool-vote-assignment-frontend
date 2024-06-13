import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import API from "../APIs/API";

const Dashboard = () => {
  const [pools, setPools] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPools = async () => {
      try {
        const token = Cookies.get("token");
        const response = await API.get("/api/v1/pool/getPools", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPools(response.data.result || []);
      } catch (error) {
        console.error("Failed to fetch pools", error);
      }
    };

    fetchPools();
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <nav className="flex-grow p-4">
          <ul>
            <li className="mb-2">
              <Link
                to="/create-pool"
                className="block py-2 px-4 rounded hover:bg-blue-700"
              >
                Create Pool
              </Link>
            </li>
          </ul>
        </nav>
        <div className="p-4">
          <button
            onClick={handleLogout}
            className="w-full py-2 px-4 bg-red-600 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>
      <div className="flex-grow p-8">
        <h1 className="text-3xl font-bold mb-6">Welcome to Your Dashboard</h1>
        <div className="grid grid-cols-1 gap-4">
          {pools.map((pool) => (
            <div key={pool._id} className="bg-white p-4 rounded shadow-md">
              <h2 className="text-xl font-bold">{pool.topic}</h2>
              <p className="text-gray-700">
                {pool.options.map((option) => {
                  return <div>• {option}</div>;
                })}
              </p>
              <div className="mt-2">
                <Link
                  to={`/pool/${pool._id}`}
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
                >
                  View Pool
                </Link>
                <Link
                  to={`/chat/${pool._id}`}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                  Join Chat
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
