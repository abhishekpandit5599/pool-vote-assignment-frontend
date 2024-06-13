import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import socketIOClient from "socket.io-client";
import API from "../APIs/API";
import { toast, ToastContainer } from "react-toastify";
import { v4 as uuidV4 } from "uuid";

const PoolDetails = () => {
  const { id } = useParams();
  const [pool, setPool] = useState(null);
  const [voted, setVoted] = useState(false);
  const [vote, setVote] = useState("");
  const socket = socketIOClient("https://pool-vote-assignment-backend.onrender.com");

  useEffect(() => {
    const fetchPool = async () => {
      try {
        const token = Cookies.get("token");
        const response = await API.get(`/api/v1/pool/getPool/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setPool(response.data.result);
        setVoted(response.data.result.voted); // Adjust based on how you determine if the user has voted
      } catch (error) {
        toast.error(error.response?.data?.error ?? "Failed to fetch pool");
      }
    };

    fetchPool();

    const peerId = uuidV4();
    socket.emit("join-pool", { roomId: id, peerId: peerId });
    socket.on("polling-results-updated", (updatedVotes) => {
      setPool((prevPool) => ({
        ...prevPool,
        votes: updatedVotes,
      }));
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  const handleVote = async () => {
    try {
      const token = Cookies.get("token");
      await API.post(
        `/api/v1/pool/vote`,
        {
          poolId: id,
          option: vote,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setVoted(true);
      toast.success("Vote submitted successfully!");
    } catch (error) {
      toast.error(
        error.response?.data?.error ??
          "Failed to submit vote. Please try again."
      );
    }
  };

  if (!pool) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-lg">
        <h1 className="text-3xl font-bold mb-4">{pool.topic}</h1>
        <div className="mb-4">
          {pool.options.map((option) => (
            <div key={option} className="flex items-center mb-2">
              <span className="text-lg font-medium mr-2">•</span>
              <span>{option}</span> &nbsp; &nbsp;
              <span>{pool.votes[option]}</span>
            </div>
          ))}
        </div>
        {voted ? (
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Results</h2>
            <ul>
              {Object.entries(pool.votes).map(([option, count]) => (
                <li key={option}>
                  {option}: {count}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Vote</h2>
            <select
              value={vote}
              onChange={(e) => setVote(e.target.value)}
              className="block w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-500"
            >
              <option value="">Select an option</option>
              {pool.options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button
              onClick={handleVote}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring focus:border-blue-500"
            >
              Submit Vote
            </button>
          </div>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default PoolDetails;
