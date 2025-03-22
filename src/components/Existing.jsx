import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Followup = () => {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [executivesUnderAdmin, setExecutivesUnderAdmin] = useState([]);
  const [adminView, setAdminView] = useState("myLeads");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [newComment, setNewComment] = useState("");
  const [selectedProgress, setSelectedProgress] = useState("");
  const [selectedLeadStatus, setSelectedLeadStatus] = useState("ec");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedExecutive, setSelectedExecutive] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
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
    personname: "",
    email: "",
    clientstatus: "",
    services: [],
    lastdate: "",
    designation: "",
    ownername: "",
    ownerno: "",
    owneremail: "",
    domain: "",
    domainpurchaseby: "",
    domaindate: "",
    domainrenew: "",
    domainid: "",
    domainpass: "",
    domainurl: "",
    assignedTo: userId || ""
  });
  const [editingLead, setEditingLead] = useState(null);
  const [isCreatingLead, setIsCreatingLead] = useState(true);
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [assignTo, setAssignTo] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!leadData.assignedTo) {
      setLeadData((prevData) => ({ ...prevData, assignedTo: userId }));
    }
  }, [userId]);

  const formatDateToISO = (date) => {
    return new Date(date).toISOString();
  };
  const toggleViewMode = () => {
    setAdminView(prevMode =>
      prevMode === "myLeads" ? "executiveLeads" : "myLeads"
    );
    setSelectedExecutive(""); // Reset selected executive
    setSelectedProgress(""); // Reset selected progress
    setSelectedLeadStatus(""); // Reset selected lead status
    setSearchQuery(""); // Reset search query
    setStartDate(""); // Reset start date
    setEndDate(""); // Reset end date
    setSortConfig({ key: null, direction: null }); // Reset sort configuration
  };

  const createLead = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const leadPayload = {
        ...leadData,
        assignedTo: leadData.assignedTo || null,
      };

      await axios.post("http://localhost:5000/api/leads", leadPayload);
      setLeadData({
        name: "",
        contact: "",
        progress: "",
        payment: "",
        balPayment: "",
        assignedTo: "",
        address: "",
        description: "",
        comment: "",
        date: "",
        personname: "",
        email: "",
        clientstatus: "",
        services: [],
        lastdate: "",
        designation: "",
        ownername: "",
        ownerno: "",
        owneremail: "",
        domain: "",
        domainpurchaseby: "",
        domaindate: "",
        domainrenew: "",
        domainid: "",
        domainpass: "",
        domainurl: "",
      });
      fetchLeads();
      setIsCreatingLead(false);
    } catch (error) {
      setError("Error creating lead");
      console.error("Error creating lead", error);
    }
  };

  const updateLead = async (id) => {
    setError("");
    try {
      const leadPayload = {
        ...leadData,
        assignedTo: leadData.assignedTo || null,
      };

      await axios.put(`http://localhost:5000/api/leads/${id}`, leadPayload);
      setEditingLead(null);
      setLeadData({
        name: "",
        contact: "",
        progress: "",
        payment: "",
        balPayment: "",
        assignedTo: "",
        address: "",
        description: "",
        comment: "",
        date: "",
        personname: "",
        email: "",
        clientstatus: "",
        services: [],
        lastdate: "",
        designation: "",
        ownername: "",
        ownerno: "",
        owneremail: "",
        domain: "",
        domainpurchaseby: "",
        domaindate: "",
        domainrenew: "",
        domainid: "",
        domainpass: "",
        domainurl: "",
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
      await axios.delete(`http://localhost:5000/api/leads/${id}`);
      fetchLeads();
    } catch (error) {
      setError("Error deleting lead");
      console.error("Error deleting lead", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const adminId = userId;

  useEffect(() => {
    fetchLeads();
    fetchUsers();
  }, []);

  const fetchLeads = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = { adminId };
      if (startDate) params.startDate = formatDateToISO(startDate);
      if (endDate) params.endDate = formatDateToISO(endDate);

      const res = await axios.get("http://localhost:5000/api/leads", { params });
      const leadsWithServices = res.data.map(lead => ({
        ...lead,
        services: lead.services || []
      }));
      setLeads(leadsWithServices);
      console.log("Fetched Leads:", leadsWithServices);
    } catch (error) {
      setError("Failed to fetch leads");
      console.error("Error fetching leads:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads(startDate, endDate);
  }, [startDate, endDate, selectedProgress]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);

      // Find the logged-in user
      const loggedInUser = res.data.find(user => user._id === userId);
      setCurrentUser(loggedInUser);
      console.log("Logged-in User:", loggedInUser);

      // Filter executives under the admin
      const filteredExecutives = res.data.filter(user =>
        user.role === "Executive" &&
        Array.isArray(user.parent) &&
        user.parent.some(parentId => parentId.toString() === userId.toString())
      );

      // Set the IDs of executives under the admin
      setExecutivesUnderAdmin(filteredExecutives.map(exec => exec._id));
      console.log("Fetched Users:", res.data);
      console.log("Executives Under Admin:", filteredExecutives);

    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const calculateLeadMetrics = () => {
    const filteredLeads = filterLeads();
    const leadCount = filteredLeads.length;
    const totalSales = filteredLeads.reduce((sum, lead) => {
      const payment = parseFloat(lead.balPayment) || 0;
      return sum + payment;
    }, 0);

    return { leadCount, totalSales };
  };

  const filterLeads = () => {
    let filtered = leads;

    if (currentUser?.role === "SuperAdmin") {
      // If the user is a SuperAdmin, include all leads
      filtered = leads;
    } else if (currentUser?.role === "Admin") {
      // If the user is an Admin, filter leads based on the view
      if (adminView === "myLeads") {
        // Show only leads assigned to the Admin themselves
        filtered = leads.filter(lead => lead.assignedTo?._id === adminId);
      } else if (adminView === "executiveLeads") {
        // Show leads assigned to the Admin, their sub-admin executives, and executives under their sub-admins
        filtered = leads.filter(lead =>
          lead.assignedTo?._id === adminId ||
          executivesUnderAdmin.includes(lead.assignedTo?._id) ||
          users.some(user =>
            (user.role === "Executive" || user.role === "Subadmin") &&
            Array.isArray(user.parent) &&
            user.parent.some(parent =>
              parent._id.toString() === adminId.toString() ||
              executivesUnderAdmin.includes(parent._id.toString())
            ) &&
            user._id === lead.assignedTo?._id
          )
        );
      }
    } else if (currentUser?.role === "Subadmin") {
      // If the user is a SubAdmin, filter leads based on the view
      if (adminView === "myLeads") {
        // Show only leads assigned to the SubAdmin themselves
        filtered = leads.filter(lead => lead.assignedTo?._id === adminId);
      } else if (adminView === "executiveLeads") {
        // Show leads assigned to the SubAdmin and their executives
        filtered = leads.filter(lead =>
          lead.assignedTo?._id === adminId ||
          users.some(user =>
            user.role === "Executive" &&
            Array.isArray(user.parent) &&
            user.parent.some(parent => parent._id.toString() === adminId.toString()) &&
            user._id === lead.assignedTo?._id
          )
        );
      }
    } else if (currentUser?.role === "Executive") {
      // If the user is an Executive, show only their own leads
      filtered = leads.filter(lead => lead.assignedTo?._id === adminId);
    }

    // Additional filters based on progress, status, executive, search query, and sorting
    if (selectedProgress) {
      filtered = filtered.filter(lead => lead.progress === selectedProgress);
    }

    if (selectedLeadStatus) {
      filtered = filtered.filter(lead => lead.clientstatus === selectedLeadStatus);
    }

    if (selectedExecutive) {
      filtered = filtered.filter(lead => lead.assignedTo?._id === selectedExecutive);
    }

    if (searchQuery) {
      filtered = filtered.filter(lead =>
        lead.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (new Date(a[sortConfig.key]) < new Date(b[sortConfig.key])) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (new Date(a[sortConfig.key]) > new Date(b[sortConfig.key])) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    // Filter leads with clientstatus "follow up"
    filtered = filtered.filter(lead => lead.progress !== "pg" && lead.progress !== "converted");

    console.log("Filtered Leads:", filtered);
    return filtered;
  };

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updatedComment = leadData.comment
      ? `${leadData.comment}\n${newComment}`
      : newComment;

    const updatedLeadData = { ...leadData, comment: updatedComment };
    setLeadData(updatedLeadData);

    if (editingLead) {
      updateLead(editingLead);
    } else {
      createLead(e, updatedLeadData);
    }

    setNewComment("");
  };

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setSelectedStatus(newStatus);
    setLeadData({ ...leadData, progress: newStatus });
  };

  const handleServiceChange = (index, e) => {
    const { name, value } = e.target;
    setLeadData(prevData => {
      const updatedServices = [...prevData.services];
      updatedServices[index] = {
        ...updatedServices[index],
        [name]: value,
      };
      return { ...prevData, services: updatedServices };
    });
  };

  const removeService = (index) => {
    setLeadData(prevData => {
      const updatedServices = [...prevData.services];
      updatedServices.splice(index, 1);
      return { ...prevData, services: updatedServices };
    });
  };

  const addService = () => {
    setLeadData({
      ...leadData,
      services: [
        ...leadData.services,
        { name: "", buydate: "", expirydate: "" },
      ],
    });
  };

  const handleCheckboxChange = (leadId) => {
    setSelectedLeads((prevSelected) =>
      prevSelected.includes(leadId)
        ? prevSelected.filter((id) => id !== leadId)
        : [...prevSelected, leadId]
    );
  };

  const handleAssign = async () => {
    setError("");
    try {
      const updatePromises = selectedLeads.map(leadId =>
        axios.put(`http://localhost:5000/api/leads/${leadId}`, { assignedTo: assignTo })
      );

      await Promise.all(updatePromises);
      setSelectedLeads([]);
      setAssignTo("");
      fetchLeads();
    } catch (error) {
      setError("Error assigning leads");
      console.error("Error assigning leads", error);
    }
  };

  const deleteSelectedLeads = async () => {
    setError("");
    try {
      const deletePromises = selectedLeads.map(leadId =>
        axios.delete(`http://localhost:5000/api/leads/${leadId}`)
      );

      await Promise.all(deletePromises);
      setSelectedLeads([]);
      fetchLeads();
    } catch (error) {
      setError("Error deleting selected leads");
      console.error("Error deleting selected leads", error);
    }
  };

  const { leadCount, totalSales } = calculateLeadMetrics();

  return (
    <div className="container-fluid mt-5" style={{ marginBottom: "100px" }}>
      <h3>My-Leads</h3>
      {currentUser?.role === "SuperAdmin" && (
        <Link to={"/super-admin-panel"} className="btn btn-primary">
          User Management
        </Link>
      )}
      <hr className="my-4" />

      <div className="d-flex flex-column flex-md-row justify-content-between mb-4">
        <div className="mb-3 mb-md-0">
          <button
            className={`btn btn-primary me-3 mb-3 ${adminView === "myLeads" ? "active" : ""}`}
            onClick={toggleViewMode}
          >
            View My Leads
          </button>

          {currentUser?.role !== "Executive" && (
            <button
              className={`btn btn-primary me-3 mb-3 ${adminView === "executiveLeads" ? "active" : ""}`}
              onClick={() => setAdminView("executiveLeads")}
            >
              View My Executives' Leads
            </button>
          )}
        </div>
        <div className="row">
          <div className="col-sm-6">
            <label className="me-2"><b>Start Date:</b></label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-control me-2"
            />
          </div>
          <div className="col-sm-6">
            <label className="me-2"><b>End Date:</b></label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-control me-2"
            />
          </div>
        </div>
      </div>

      <div className="container-fluid mt-4">
        {error && <div className="alert alert-danger">{error}</div>}

        {!isCreatingLead && (
          <form className="mb-4" onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <label htmlFor="">Company Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Lead Name"
                  value={leadData.name}
                  onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                  disabled={currentUser?.role !== "Admin" && currentUser?.role !== "Super Admin" && !isCreatingLead}
                  required
                />
              </div>

              <div className="col-md-6">
                <label htmlFor="">Owner Name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Owner Name"
                  value={leadData.ownername}
                  onChange={(e) => setLeadData({ ...leadData, ownername: e.target.value })}
                  disabled={currentUser?.role !== "Admin" && currentUser?.role !== "Super Admin" && !isCreatingLead}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="">Owner No.</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Owner number"
                  value={leadData.ownerno}
                  onChange={(e) => setLeadData({ ...leadData, ownerno: e.target.value })}
                  disabled={currentUser?.role !== "Admin" && currentUser?.role !== "Super Admin" && !isCreatingLead}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="">Owner Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Owner Email"
                  value={leadData.owneremail}
                  onChange={(e) => setLeadData({ ...leadData, owneremail: e.target.value })}
                  disabled={currentUser?.role !== "Admin" && currentUser?.role !== "Super Admin" && !isCreatingLead}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="">Contact Person</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Contact Person Name"
                  value={leadData.personname}
                  onChange={(e) => setLeadData({ ...leadData, personname: e.target.value })}
                  disabled={currentUser?.role !== "Admin" && currentUser?.role !== "Super Admin" && !isCreatingLead}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="">Designation</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Designation"
                  value={leadData.designation}
                  onChange={(e) => setLeadData({ ...leadData, designation: e.target.value })}
                  disabled={currentUser?.role !== "Admin" && currentUser?.role !== "Super Admin" && !isCreatingLead}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="">Contact Person Email</label>
                <input
                  type="email"
                  className="form-control"
                  placeholder="Contact Person Email"
                  value={leadData.email}
                  onChange={(e) => setLeadData({ ...leadData, email: e.target.value })}
                  disabled={currentUser?.role !== "Admin" && currentUser?.role !== "Super Admin" && !isCreatingLead}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="">Contact Person Number</label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Contact Person Number"
                  value={leadData.contact}
                  onChange={(e) => setLeadData({ ...leadData, contact: e.target.value })}
                  disabled={currentUser?.role !== "Admin" && currentUser?.role !== "Super Admin" && !isCreatingLead}
                  required
                />
              </div>

              {(currentUser?.role === "Admin" || currentUser?.role === "Super Admin") && (
                <>
                  <div className="col-md-6">
                    <label htmlFor="">Domain</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Domain"
                      value={leadData.domain}
                      onChange={(e) => setLeadData({ ...leadData, domain: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="">Domain Purchase By</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="domainpurchaseby"
                      value={leadData.domainpurchaseby}
                      onChange={(e) => setLeadData({ ...leadData, domainpurchaseby: e.target.value })}
                    />
                  </div>

                  <div className="col-md-6">
                    <label htmlFor="">Domain Purchase Date</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Domain Purchase Date"
                      value={leadData.domaindate}
                      onChange={(e) => setLeadData({ ...leadData, domaindate: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="">Domain Renew Date</label>
                    <input
                      type="date"
                      className="form-control"
                      placeholder="Domain Renew Date"
                      value={leadData.domainrenew}
                      onChange={(e) => setLeadData({ ...leadData, domainrenew: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="">Domain Login URL</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Domain Login URL"
                      value={leadData.domainurl}
                      onChange={(e) => setLeadData({ ...leadData, domainurl: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="">Domain Username</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Domain Username"
                      value={leadData.domainid}
                      onChange={(e) => setLeadData({ ...leadData, domainid: e.target.value })}
                    />
                  </div>
                  <div className="col-md-6">
                    <label htmlFor="">Domain Password</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Domain Password"
                      value={leadData.domainpass}
                      onChange={(e) => setLeadData({ ...leadData, domainpass: e.target.value })}
                    />
                  </div>
                </>
              )}

              <div className="col-md-6">
                <label htmlFor="">Address</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Address"
                  value={leadData.address}
                  onChange={(e) => setLeadData({ ...leadData, address: e.target.value })}
                  disabled={currentUser?.role !== "Admin" && currentUser?.role !== "Super Admin" && !isCreatingLead}
                  required
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="">Discussion</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Discussion"
                  value={leadData.description}
                  onChange={(e) => setLeadData({ ...leadData, description: e.target.value })}
                  disabled={currentUser?.role !== "Admin" && currentUser?.role !== "Super Admin" && !isCreatingLead}
                
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="">Status</label>
                <select
                  className="form-control"
                  value={leadData.progress}
                  onChange={handleStatusChange}
                  required
                >
                  <option value="Select Status">Select Status</option>
                  <option value="callback">Call Back</option>
                  <option value="dmufc">DMUFC</option>
                  <option value="dmufwp">DMUFWP</option>
                  <option value="pg">PG</option>
                  <option value="converted">Converted</option>
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="">Services</label>
                {leadData.services && leadData.services.map((service, index) => (
                  <div key={index} className="mb-3">
                    <div className="row">
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Service Name"
                          name="name"
                          value={service.name || ''}
                          onChange={(e) => handleServiceChange(index, e)}
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="date"
                          className="form-control"
                          placeholder="Buy Date"
                          name="buydate"
                          value={service.buydate || ''}
                          onChange={(e) => handleServiceChange(index, e)}
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="date"
                          className="form-control"
                          placeholder="Expiry Date"
                          name="expirydate"
                          value={service.expirydate || ''}
                          onChange={(e) => handleServiceChange(index, e)}
                        />
                      </div>
                      <div className="col-md-1">
                        <button
                          type="button"
                          className="btn btn-danger mt-2 rounded-5"
                          onClick={() => removeService(index)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-primary" onClick={addService}>
                  Add Service
                </button>
              </div>
              <div className="col-md-6">
                <label htmlFor="">Lead Status</label>
                <select
                  className="form-control"
                  value={leadData.clientstatus}
                  onChange={(e) => setLeadData({ ...leadData, clientstatus: e.target.value })}
                >
                  <option value="Select option">Select option</option>
                  <option value="nc">NC</option>
                  <option value="dc">DC</option>
                  <option value="ec">EC</option>
                </select>
              </div>
              <div className="col-md-6">
                <label htmlFor="">Follow Up Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={leadData.date}
                  onChange={(e) => setLeadData({ ...leadData, date: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="">Last Update Date</label>
                <input
                  type="date"
                  className="form-control"
                  value={leadData.lastdate}
                  onChange={(e) => setLeadData({ ...leadData, lastdate: e.target.value })}
                />
              </div>
              <div className="col-md-6">
                <label htmlFor="">Comments</label>
                <textarea
                  className="form-control"
                  value={leadData.comment}
                  onChange={(e) => setLeadData({ ...leadData, comment: e.target.value })}
                  placeholder="Comments"
                />
              </div>
              {selectedStatus === 'pg' || selectedStatus === 'converted' && (
                <div className="col-md-6">
                  <label htmlFor="">Contract Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Payment"
                    value={leadData.payment}
                    onChange={(e) => setLeadData({ ...leadData, payment: e.target.value })}
                    disabled={currentUser?.role !== "Admin" && currentUser?.role !== "Super Admin" && !isCreatingLead}
                    required
                  />
                </div>
              )}
              {selectedStatus === 'converted' && (
                <div className="col-md-6">
                  <label htmlFor="">Received Amount</label>
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Received Amount"
                    value={leadData.balPayment}
                    onChange={(e) => setLeadData({ ...leadData, balPayment: e.target.value })}
                    required
                  />
                </div>
              )}
              <div className="col-md-6">
                <label htmlFor="">Assign To</label>
                <select
                  className="form-select"
                  value={leadData.assignedTo}
                  onChange={(e) => setLeadData({ ...leadData, assignedTo: e.target.value })}
                  required
                  disabled={currentUser?.role === "Subadmin" || currentUser?.role === "Executive"}
                >
                  <option value={userId}>{currentUser?.name} (Self)</option>
                  {currentUser?.role !== "Subadmin" && currentUser?.role !== "Executive" &&
                    users
                      .filter(user => user._id !== userId)
                      .map(user => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.role})
                        </option>
                      ))
                  }
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              {editingLead ? "Update Lead" : "Create Lead"}
            </button>
          </form>
        )}

        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h6>Lead Metrics</h6>
            <p><strong>Total Leads:</strong> <button className="btn btn-warning">{leadCount}</button></p>
            <p><strong>Total Sales:</strong> <button className="btn btn-danger">₹ {totalSales}/-</button></p>
          </div>
          <hr />
          <div className="d-flex align-items-center ">
            <div className="me-3">
              <div className="d-flex align-items-center">
              {adminView === "executiveLeads" && (
        <div className="me-3 mb-3">
          <label className="me-2"><b>Executive:</b></label>
          <select
            className="form-select"
            value={selectedExecutive}
            onChange={(e) => setSelectedExecutive(e.target.value)}
          >
            <option value="">All Executives</option>
            {users
              .filter(user =>
               ( user.role === "Executive"  || user.role === "Subadmin")  &&
                Array.isArray(user.parent) &&
                user.parent.some(parent => parent._id === userId)
              )
              .map(exec => (
                <option key={exec._id} value={exec._id}>
                  {exec.name}
                </option>
              ))}
          </select>
        </div>
      )}

                <div className="mb-3">
                  <label className="me-2"><b>Lead Status:</b></label>
                  <select
                    className="form-select"
                    value={selectedLeadStatus}
                    onChange={(e) => setSelectedLeadStatus(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="ec">EC</option>
                    <option value="dc">DC</option>
                    <option value="nc">NC</option>
                  </select>
                </div>
                <div className="mb-3 ms-2">
                  <label className="me-2"><b>Progress:</b></label>
                  <select
                    className="form-select"
                    value={selectedProgress}
                    onChange={(e) => setSelectedProgress(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="Select Status">Select Status</option>
                    <option value="callback">Call Back</option>
                    <option value="dmufc">DMUFC</option>
                    <option value="dmufwp">DMUFWP</option>
                    <option value="pg">PG</option>
                    <option value="converted">Converted</option>
                  </select>
                </div>
                <div className="mb-3 ms-2">
                  <label className="me-2"><b>Follow Up:</b></label>
                  <select
                    className="form-select"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="callback">Call Back</option>
                    <option value="dmufc">DMUFC</option>
                    <option value="dmufwp">DMUFWP</option>
                  </select>
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary ms-3"
              onClick={() => setIsCreatingLead(!isCreatingLead)}
            >
              {isCreatingLead ? "Edit Lead" : "Close"}
            </button>
          </div>
        </div>

        <div className="mb-3">
          <label className="me-2"><b>Search Leads:</b></label>
          <input
            type="text"
            className="form-control"
            placeholder="Search by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <p>Loading leads...</p>
        ) : (
          <div className="table-responsive w-100" style={{ height: '900px', overflowY: "auto" }}>
            {selectedLeads.length > 0 && (
              <div className="d-flex align-items-center mb-3">
                <select
                  className="form-select"
                  value={assignTo}
                  onChange={(e) => setAssignTo(e.target.value)}
                  required
                  disabled={currentUser?.role === "Subadmin" || currentUser?.role === "Executive"}
                >
                  <option value={userId}>{currentUser?.name} (Self)</option>
                  {currentUser?.role !== "Subadmin" && currentUser?.role !== "Executive" &&
                    users
                      .filter(user => user._id !== userId)
                      .map(user => (
                        <option key={user._id} value={user._id}>
                          {user.name} ({user.role})
                        </option>
                      ))
                  }
                </select>
                <button className="btn btn-primary" onClick={handleAssign}>
                  Assign Selected
                </button>
                <button className="btn btn-danger ms-2" onClick={deleteSelectedLeads}>
                  Delete Selected
                </button>
              </div>
            )}
            <table className="table  table-responsive fixed-height w-100 table-bordered" style={{ height: '900px', overflowY: "auto" }}>
              <thead className="thead-dark sticky-top">
                <tr >
                  <th>
                    <input
                      type="checkbox"
                      onChange={(e) =>
                        setSelectedLeads(e.target.checked ? leads.map((lead) => lead._id) : [])
                      }
                      checked={selectedLeads.length === leads.length}
                    />
                  </th>
                  <th style={{ minWidth: '180px', Height: '60px', backgroundColor: 'skyblue' }}>Company Name</th>
                  <th style={{ minWidth: '280px', Height: '60px', backgroundColor: 'skyblue' }}>Contact person Details</th>
                  <th style={{ minWidth: '100px', Height: '60px', backgroundColor: 'skyblue' }}>Status</th>
                  <th style={{ minWidth: '280px', height: '60px', backgroundColor: 'skyblue' }}>Service</th>
                  <th style={{ minWidth: '120px', Height: '60px', backgroundColor: 'skyblue' }}>
                    <button onClick={() => requestSort('date')} className="btn btn-link text-dark">
                      Follow Up Date {sortConfig.key === 'date' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </button>
                  </th>
                  <th style={{ minWidth: '120px', backgroundColor: 'skyblue' }}>
                    <button onClick={() => requestSort('lastdate')} className="btn btn-link text-dark">
                      Last Date {sortConfig.key === 'lastdate' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </button>
                  </th>
                  <th style={{ minWidth: '280px', backgroundColor: 'skyblue' }}>Comments</th>
                  <th style={{ backgroundColor: 'skyblue' }}>Assigned To</th>
                  <th style={{ backgroundColor: 'skyblue' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filterLeads().map((lead) => (
                  <tr key={lead._id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedLeads.includes(lead._id)}
                        onChange={() => handleCheckboxChange(lead._id)}
                      />
                    </td>
                    <td className="pt-3 text-center">
                      <button
                        className="btn btn-link text-dark text-decoration-none"
                        data-bs-toggle="modal"
                        data-bs-target={`#companyModal${lead._id}`}
                      >
                        <b>{lead.name}</b>
                      </button>
                      <br /><br />
                      <span className="p-2 rounded-3 bg-warning text-center">{lead.clientstatus}</span>
                    </td>
                    <td>
                      <b>Name:</b>
                      {lead.ownername}

                      <br />
                      <b>Phone No:</b>
                      {(lead.ownerno ? lead.ownerno.split(',') : []).map((sentence, index) =>
                        sentence.trim() && <li key={index}>{sentence.trim()}.</li>
                      )}
                      <b>Email:</b> {lead.owneremail}
                    </td>
                    <td className="pt-4">
                      <span className="p-2 bg-warning rounded-5">{lead.progress}</span>
                    </td>
                    <td className="pt-4">
                      <ul>
                        {lead.services && lead.services.length > 0 ? (
                          lead.services.map((service, index) => (
                            <li key={index}>
                              <b>Service:</b> {service.name}
                              <br />
                              <b>Buy Date:</b> {service.buydate.split('T')[0] || ""}
                              <br />
                              <b>Expiry Date:</b> {service.expirydate.split('T')[0] || ""}
                            </li>
                          ))
                        ) : (
                          <li>No services available</li>
                        )}
                      </ul>
                    </td>
                    <td>{lead.date}</td>
                    <td>{lead.lastdate}</td>
                    <td>
                      <ul>
                        {(lead.comment ? lead.comment.split(',') : []).map((sentence, index) =>
                          sentence.trim() && <li key={index}>{sentence.trim()}.</li>
                        )}
                      </ul>
                    </td>
                    <td>{lead.assignedTo?.name || "Unassigned"}</td>
                    <td className="d-flex justify-content-between">
                      <button
                        className="btn btn-warning rounded-3 me-2 p-2"
                        onClick={() => {
                          setEditingLead(lead._id);
                          setLeadData({
                            name: lead.name,
                            contact: lead.contact,
                            progress: lead.progress,
                            payment: lead.payment,
                            balPayment: lead.balPayment,
                            date: lead.date,
                            comment: lead.comment,
                            address: lead.address,
                            description: lead.description,
                            personname: lead.personname,
                            email: lead.email,
                            lastdate: lead.lastdate,
                            clientstatus: lead.clientstatus,
                            services: lead.services,
                            ownername: lead.ownername,
                            ownerno: lead.ownerno,
                            owneremail: lead.owneremail,
                            domain: lead.domain,
                            domainpurchaseby: lead.domainpurchaseby,
                            domaindate: lead.domaindate,
                            domainrenew: lead.domainrenew,
                            domainid: lead.domainid,
                            domainpass: lead.domainpass,
                            domainurl: lead.domainurl,
                            designation: lead.designation,
                            assignedTo: lead.assignedTo?._id || "",
                          });
                          setIsCreatingLead(false);
                          // Scroll to the top of the page
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
                          <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325" />
                        </svg>
                      </button>
                      {currentUser?.role !== "Subadmin" && currentUser?.role !== "Executive" && (
                        <button
                          className="btn btn-danger rounded-3 p-2"
                          onClick={() => {
                            // eslint-disable-next-line no-restricted-globals
                            const userConfirmed = confirm("Do you want to delete this lead?");
                            if (userConfirmed) {
                              deleteLead(lead._id);
                            }
                          }}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                          </svg>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {filterLeads().map((lead) => (
          <div key={lead._id} className="modal modal-xl fade" id={`companyModal${lead._id}`} tabIndex="-1" aria-hidden="true">
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-danger text-uppercase">{lead.name} Details</h5>
                  <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-sm-6">
                      <h4 className="text-warning">Client Details</h4>
                      <hr />
                      <p><strong>Owner Name:</strong> {lead.ownername}</p>
                      <p><strong>Owner Number:</strong> {lead.ownerno}</p>
                      <p><strong>Owner Email:</strong> {lead.owneremail}</p>
                      <p><strong>Contact Person Name:</strong> {lead.personname}</p>
                      <p><strong>Contact Person Designation:</strong> {lead.designation}</p>
                      <p><strong>Contact Person Email:</strong> {lead.email}</p>
                      <p><strong>Contact Person Phone:</strong>
                        {(lead.contact ? lead.contact.split(',') : []).map((sentence, index) =>
                          sentence.trim() && <li key={index}>{sentence.trim()}.</li>
                        )}
                      </p>
                      <p><strong>Address:</strong> {lead.address}</p>
                      <p><strong>Service:</strong>
                        <ul>
                          {lead.services.map((service, index) => (
                            <li key={index}>
                              <b>Service:</b> {service.name}
                              <br />
                              <b>Buy Date:</b> {service.buydate || ""}
                              <br />
                              <b>Expiry Date:</b> {service.expirydate || ""}
                            </li>
                          ))}
                        </ul>
                      </p>
                    </div>

                    <div className="col-sm-6">
                      <h4 className="text-warning">Domain Details</h4>
                      <hr />
                      {(currentUser?.role === "Admin" || currentUser?.role === "Super Admin") && (
                        <>
                          <p><strong>Domain:</strong> {lead.domain}</p>
                          <p><strong>Domain Purchased By:</strong> {lead.domainpurchaseby}</p>
                          <p><strong>Domain Purchased Date:</strong> {lead.domaindate}</p>
                          <p><strong>Domain Renew Date:</strong> {lead.domainrenew}</p>
                          <p><strong>Domain Login URL:</strong> {lead.domainurl}</p>
                          <p><strong>Domain Username:</strong> {lead.domainid}</p>
                          <p><strong>Domain Password:</strong> {lead.domainpass}</p>
                        </>
                      )}
                      <p><strong>Description</strong> <ul>
                        {(lead.description ? lead.description.split(',') : []).map((sentence, index) =>
                          sentence.trim() && <li key={index}>{sentence.trim()}.</li>
                        )}
                      </ul></p>
                      <p><strong>Status:</strong> {lead.progress}</p>
                      <p><strong>Payment:</strong> {lead.payment}</p>
                      <p><strong>Balance Payment:</strong> {lead.balPayment}</p>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Followup;
