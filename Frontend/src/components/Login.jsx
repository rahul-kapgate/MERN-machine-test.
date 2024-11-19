import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/LogoImage.png";
import { useUser } from "../../context/UserContext.jsx";

const Login = () => {

  const { user, setUser } = useUser();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { username, password }
      );
      // localStorage.setItem("token", response.data.token);
      alert(`${username} Login successful!`);
      setUser({
        ...user, // Preserve the other user properties
        username: username, // Update the username
      });
      navigate("/home");
    } catch (err) {
      if (err.response) {
      switch (err.response.status) {
        case 400:
          alert("Username and password are required.");
          break;
        case 401:
          alert("Invalid username or password.");
          break;
        case 500:
          alert("Internal server error. Please try again later.");
          break;
        default:
          alert("An error occurred. Please try again.");
          break;
      }
    }
  }
}

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-800">
        <div className="max-w-md w-full p-6 bg-gray-900 shadow-lg rounded-lg">
          
          <div className="flex justify-center mb-6">
            <img
              src={logo} 
              alt="Logo"
              className="h-16 w-auto rounded-full"
            />
          </div>

          {/* Login Title */}
          <h2 className="text-3xl font-bold text-center text-indigo-500 mb-6">
            Login
          </h2>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-semibold text-gray-300"
              >
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-4 py-3 mt-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-gray-300"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 mt-2 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 text-black"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 mt-4 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Login
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            {/* Optional: Forgot password or other links */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
