import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "js-cookie";
import socketIOClient from "socket.io-client";
import API from "../APIs/API";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { v4 as uuidV4 } from "uuid";

const Chat = () => {
  const { poolId } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const socket = socketIOClient("https://pool-vote-assignment-backend.onrender.com");

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = Cookies.get("token");
        const response = await API.get(`/api/v1/pool/chat/${poolId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data.result || []);
      } catch (error) {
        console.error("Failed to fetch messages", error);
      }
    };

    fetchMessages();
    const peerId = uuidV4();
    socket.emit("join-room", { roomId: poolId, peerId: peerId });

    socket.on("new-message", (newMessage) => {
      let message = {
        poolId,
        message: newMessage,
      };
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.emit("leave-room", { roomId: poolId, peerId: socket.id });
      socket.disconnect();
    };
  }, [poolId]);

  const handleSendMessage = async () => {
    if (message.trim() === "") return;

    try {
      const token = Cookies.get("token");
      await API.post(
        `/api/v1/pool/chat/send`,
        {
          poolId,
          message: {
            content: message,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("");
    } catch (error) {
      console.error("Failed to send message", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white rounded-lg shadow-md p-8 w-full max-w-lg">
        <h1 className="text font-bold mb-4">Chat for Pool {poolId}</h1>
        <div className="mb-4 h-72 overflow-y-auto">
          {messages.map((msg, index) => (
            <div key={index} className="mb-2">
              <strong>{msg.message.sender}: </strong>
              {msg.message.content}
            </div>
          ))}
        </div>
        <div className="flex">
          <input
            type="text"
            className="flex-grow px-4 py-2 border rounded-l-md focus:outline-none focus:ring focus:border-blue-500"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-r-md focus:outline-none focus:ring focus:border-blue-500"
            onClick={handleSendMessage}
          >
            Send
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Chat;
