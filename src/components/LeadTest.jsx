import React, { useState } from "react";
import axios from "axios";

const API_URL = "https://crm.hxbindia.com/api"; // Update if needed

const LeadTest = () => {
  const [token, setToken] = useState("");
  const [leads, setLeads] = useState([]);
  const [newLead, setNewLead] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    assignedTo: "",
  });

  // Handle input change
  const handleInputChange = (e) => {
    setNewLead({ ...newLead, [e.target.name]: e.target.value });
  };

  // Login & Get Token
  const handleLogin = async () => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: "admin@example.com", // Replace with valid user
        password: "password123", // Replace with valid password
      });

      setToken(response.data.token);
      alert("✅ Login Successful!");
    } catch (error) {
      alert("❌ Login Failed!");
      console.error(error);
    }
  };

  // Fetch Leads
  const fetchLeads = async () => {
    try {
      const response = await axios.get(`${API_URL}/leads`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setLeads(response.data);
    } catch (error) {
      alert("❌ Failed to fetch leads!");
      console.error(error);
    }
  };

  // Create a New Lead
  const createLead = async () => {
    try {
      await axios.post(`${API_URL}/leads`, newLead, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("✅ Lead Created!");
      fetchLeads(); // Refresh leads list
    } catch (error) {
      alert("❌ Failed to create lead!");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>🚀 API Tester</h2>
      <button onClick={handleLogin}>🔑 Login</button>
      <button onClick={fetchLeads} disabled={!token}>📂 Fetch Leads</button>

      <h3>Create Lead</h3>
      <input type="text" name="name" placeholder="Name" onChange={handleInputChange} />
      <input type="text" name="address" placeholder="Address" onChange={handleInputChange} />
      <input type="text" name="phoneNumber" placeholder="Phone Number" onChange={handleInputChange} />
      <input type="text" name="assignedTo" placeholder="Assigned To (User ID)" onChange={handleInputChange} />
      <button onClick={createLead} disabled={!token}>➕ Create Lead</button>

      <h3>Leads List</h3>
      <ul>
        {leads.map((lead) => (
          <li key={lead._id}>
            {lead.name} - {lead.address} - {lead.phoneNumber} (Assigned: {lead.assignedTo})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeadTest;
