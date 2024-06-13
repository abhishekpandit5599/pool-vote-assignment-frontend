import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../APIs/API";
import { toast, ToastContainer } from "react-toastify";
import Cookies from 'js-cookie';

const CreatePool = () => {
  const [topic, setTopic] = useState("");
  const [options, setOptions] = useState([""]); // Initialize with one empty option
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = Cookies.get('token'); // Get token from cookies
      const response = await API.post("/api/v1/pool/create", {
        topic,
        options: options.filter((opt) => opt.trim() !== ""), // Filter out empty options
      }, {
        headers: {
          Authorization: `Bearer ${token}`, // Set Authorization header
        }
      });
      console.log("Pool created:", response.data);
      navigate("/dashboard"); // Redirect to dashboard after successful creation
    } catch (error) {
      toast.error(error.response?.data?.error ?? "Failed to create pool");
    }
  };

  const handleAddOption = () => {
    setOptions([...options, ""]); // Add a new empty option
  };

  const handleRemoveOption = (index) => {
    const newOptions = [...options];
    newOptions.splice(index, 1); // Remove option at index
    setOptions(newOptions);
  };

  const handleChangeOption = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value; // Update option at index
    setOptions(newOptions);
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Create Pool</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="topic" className="block text-gray-700 font-bold mb-2">
            Topic:
          </label>
          <input
            type="text"
            id="topic"
            className="w-full px-3 py-2 border rounded-lg text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter topic"
            required
          />
        </div>
        <div className="mb-6">
          <label
            htmlFor="options"
            className="block text-gray-700 font-bold mb-2"
          >
            Options:
          </label>
          {options.map((opt, index) => (
            <div key={index} className="flex mb-2">
              <input
                type="text"
                className="w-full px-3 py-2 border rounded-lg text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                value={opt}
                onChange={(e) => handleChangeOption(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required
              />
              <button
                type="button"
                className="ml-2 px-4 py-2 bg-red-500 text-white font-bold rounded-lg focus:outline-none focus:shadow-outline"
                onClick={() => handleRemoveOption(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button
            type="button"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            onClick={handleAddOption}
          >
            Add Option
          </button>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Pool
        </button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default CreatePool;
