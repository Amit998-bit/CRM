import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [leads, setLeads] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const res = await axios.get("http://localhost:5000/api/auth/me", {
          headers: { Authorization: token },
        });
        setUser(res.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
        navigate("/login");
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const fetchLeads = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/leads", {
          headers: { Authorization: token },
        });
        setLeads(res.data);
      } catch (error) {
        console.error("Error fetching leads:", error);
      }
    };

    if (user) {
      fetchLeads();
    }
  }, [user]);

  return (
    <div className="container mt-4">
      <h2>Welcome, {user?.name}!</h2>
      <h4>Role: {user?.role}</h4>
      <h3>Your Leads:</h3>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {leads.length > 0 ? (
            leads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.phone}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">No leads available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
