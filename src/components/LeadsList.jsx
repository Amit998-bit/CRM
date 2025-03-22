import React, { useState, useEffect } from "react";
import axios from "axios";

const LeadsList = () => {
  const [leads, setLeads] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to format date to YYYY-MM-DDT00:00:00.000Z
  const formatDateToISO = (date) => {
    return new Date(date).toISOString();
  };

  // Fetch leads from API
  const fetchLeads = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = {};
      if (startDate) params.startDate = formatDateToISO(startDate); 
      if (endDate) params.endDate = formatDateToISO(endDate);
  
      console.log("Fetching with Params:", params); // Debugging

      const res = await axios.get("http://localhost:5000/api/leads", { params });

      console.log("API Response:", res.data); // Debugging
      setLeads(res.data);
    } catch (error) {
      setError("Failed to fetch leads");
      console.error("Error fetching leads:", error);
    }
    setLoading(false);
  };

  // Fetch all leads on first load
  useEffect(() => {
    fetchLeads();
  }, []);

  return (
    <div className="container mt-4">
      <h2>Leads List</h2>
      <div className="row mb-3">
        <div className="col-md-4">
          <label>Start Date:</label>
          <input
            type="date"
            className="form-control"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <label>End Date:</label>
          <input
            type="date"
            className="form-control"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
        <div className="col-md-4 d-flex align-items-end">
          <button className="btn btn-primary" onClick={fetchLeads}>
            Filter
          </button>
        </div>
      </div>

      {loading && <p>Loading leads...</p>}
      {error && <p className="text-danger">{error}</p>}

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Assigned To</th>
            <th>Date Created</th>
          </tr>
        </thead>
        <tbody>
          {leads.length > 0 ? (
            leads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.name}</td>
                <td>{lead.email}</td>
                <td>{lead.assignedTo ? lead.assignedTo.name : "Unassigned"}</td>
                <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No leads found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeadsList;
