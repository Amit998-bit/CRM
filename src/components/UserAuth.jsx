import React, { useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:5000/api/auth"; // Update if needed

const UserAuth = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "executive", // Default role
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [token, setToken] = useState("");
  const [user, setUser] = useState(null);

  // Handle input change for registration
  const handleRegisterChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle input change for login
  const handleLoginChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  // Register User
  const handleRegister = async () => {
    try {
      const response = await axios.post(`${API_URL}/register`, formData);
      alert("✅ Registration Successful!");
      console.log(response.data);
    } catch (error) {
      alert("❌ Registration Failed!");
      console.error(error.response?.data || error);
    }
  };

  // Login User
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/login`, loginData);
      setToken(response.data.token);
      alert("✅ Login Successful!");
      console.log(response.data);
    } catch (error) {
      alert("❌ Login Failed!");
      console.error(error.response?.data || error);
    }
  };

  // Fetch User Info
  const fetchUserInfo = async () => {
    try {
      const response = await axios.get(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      alert("❌ Failed to fetch user info!");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>🔑 User Authentication</h2>

      {/* Registration Form */}
      <h3>📝 Register</h3>
      <input type="text" name="name" placeholder="Name" onChange={handleRegisterChange} />
      <input type="email" name="email" placeholder="Email" onChange={handleRegisterChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleRegisterChange} />
      <select name="role" onChange={handleRegisterChange}>
        <option value="superadmin">SuperAdmin</option>
        <option value="admin">Admin</option>
        <option value="executive">Executive</option>
      </select>
      <button onClick={handleRegister}>🚀 Register</button>

      {/* Login Form */}
      <h3>🔐 Login</h3>
      <input type="email" name="email" placeholder="Email" onChange={handleLoginChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleLoginChange} />
      <button onClick={handleLogin}>✅ Login</button>

      {/* Fetch User Info */}
      <h3>🆔 User Info</h3>
      <button onClick={fetchUserInfo} disabled={!token}>👤 Get User Info</button>

      {user && (
        <div>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>
      )}
    </div>
  );
};

export default UserAuth;
