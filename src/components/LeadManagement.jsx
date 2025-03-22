import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";

const LeadManagement = () => {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [leadData, setLeadData] = useState({
    name: "",
    contact: "",
    address: "",
    description: "",
    progress: "",
    payment: "",
    balPayment: "",
    comment: "",
    date: "",
    assignedTo: "",
  });
  const [editingLead, setEditingLead] = useState(null);

  useEffect(() => {
    fetchLeads();
    fetchUsers();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("https://crm.hxbindia.com/api/leads");
      setLeads(res.data);
    } catch (error) {
      setError("Error fetching leads");
      console.error("Error fetching leads", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://crm.hxbindia.com/api/users");
      setUsers(res.data);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const createLead = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post("https://crm.hxbindia.com/api/leads", leadData);
      setLeadData({
        name: "",
        contact: "",
        address: "",
        description: "",
        progress: "",
        payment: "",
        balPayment: "",
        comment: "",
        date: "",
        assignedTo: "",
      });
      fetchLeads();
    } catch (error) {
      setError("Error creating lead");
      console.error("Error creating lead", error);
    }
  };

  const updateLead = async (id) => {
    setError("");
    try {
      await axios.put(`https://crm.hxbindia.com/api/leads/${id}`, leadData);
      setEditingLead(null);
      setLeadData({
        name: "",
        contact: "",
        address: "",
        description: "",
        progress: "",
        payment: "",
        balPayment: "",
        comment: "",
        date: "",
        assignedTo: "",
      });
      fetchLeads();
    } catch (error) {
      setError("Error updating lead");
      console.error("Error updating lead", error);
    }
  };

  const deleteLead = async (id) => {
    setError("");
    try {
      await axios.delete(`https://crm.hxbindia.com/api/leads/${id}`);
      fetchLeads();
    } catch (error) {
      setError("Error deleting lead");
      console.error("Error deleting lead", error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Lead Management</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form
        className="mb-4"
        onSubmit={editingLead ? (e) => { e.preventDefault(); updateLead(editingLead); } : createLead}
      >
        <div className="row g-3">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder=" Name"
              value={leadData.name}
              onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Contact"
              value={leadData.contact}
              onChange={(e) => setLeadData({ ...leadData, contact: e.target.value })}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Address"
              value={leadData.address}
              onChange={(e) => setLeadData({ ...leadData, address: e.target.value })}
              required
            />
          </div>
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Description"
              value={leadData.description}
              onChange={(e) => setLeadData({ ...leadData, description: e.target.value })}
              
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-control"
              value={leadData.progress}
              onChange={(e) => setLeadData({ ...leadData, progress: e.target.value })}
             
            >
              <option value="new lead">New Lead</option>
              <option value="follow up">Follow Up</option>
              <option value="converted">Converted</option>
            </select>
          </div>
          <div className="col-md-4">
            <input
              type="date"
              className="form-control"
              value={leadData.date}
              onChange={(e) => setLeadData({ ...leadData, date: e.target.value })}
              
            />
          </div>
          <div className="col-md-4">
            <textarea
              className="form-control"
              value={leadData.comment}
              onChange={(e) => setLeadData({ ...leadData, comment: e.target.value })}
              placeholder="Comments"
            
            />
          </div>
          <div className="col-md-4">
            <input
              type="number"
              className="form-control"
              placeholder="Payment"
              value={leadData.payment}
              onChange={(e) => setLeadData({ ...leadData, payment: e.target.value })}
             
            />
          </div>
          <div className="col-md-4">
            <input
              type="number"
              className="form-control"
              placeholder="Received Payment"
              value={leadData.balPayment}
              onChange={(e) => setLeadData({ ...leadData, balPayment: e.target.value })}
              
            />
          </div>
          <div className="col-md-4">
            <select
              className="form-select"
              value={leadData.assignedTo}
              onChange={(e) => setLeadData({ ...leadData, assignedTo: e.target.value })}
         
            >
              <option value="">Select Assignee</option>
              {users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.name} ({user.role})
                </option>
              ))}
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          {editingLead ? "Update Lead" : "Create Lead"}
        </button>
      </form>

      {loading ? (
        <p>Loading leads...</p>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Address</th>
              <th>Description</th>
              <th>Progress</th>
              <th>Follow Up Date</th>
              <th>Comments</th>
              <th>Payment</th>
              <th>Received</th>
              <th>Balance Payment</th>
              <th>Assigned To</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id}>
                <td>{lead.name}</td>
                <td>{lead.contact}</td>
                <td>{lead.address}</td>
                <td>{lead.description}</td>
                <td>{lead.progress}</td>
                <td>{lead.date}</td>
                <td>{lead.comment}</td>
                <td>{lead.payment}</td>
                <td>{lead.balPayment}</td>
                <td>{lead.payment - lead.balPayment}</td>
                <td>{lead.assignedTo?.name || "Unassigned"}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => {
                      setEditingLead(lead._id);
                      setLeadData({
                        name: lead.name,
                        contact: lead.contact,
                        address: lead.address,
                        description: lead.description,
                        progress: lead.progress,
                        payment: lead.payment,
                        balPayment: lead.balPayment,
                        comment: lead.comment,
                        date: lead.date,
                        assignedTo: lead.assignedTo?._id || "",
                      });
                    }}
                  >
                    Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => deleteLead(lead._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LeadManagement;
