import React, { useState, useEffect } from "react";
import axios from "axios";

const RoleBaseLead = () => {
  const [leads, setLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [executivesUnderAdmin, setExecutivesUnderAdmin] = useState([]);
  const [adminView, setAdminView] = useState("myLeads");
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [newComment, setNewComment] = useState("");
  const [selectedProgress, setSelectedProgress] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
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
    services: [{ name: '', buydate: '', expirydate: '' }],  // Ensure service is initialized as an empty array
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

  useEffect(() => {
    if (!leadData.assignedTo) {
      setLeadData((prevData) => ({ ...prevData, assignedTo: userId }));
    }
  }, [userId]);

  const formatDateToISO = (date) => {
    return new Date(date).toISOString();
  };

 const createLead = async (e) => {
  e.preventDefault();
  setError("");

  try {
    const leadPayload = {
      ...leadData,
      assignedTo: leadData.assignedTo || null,
      services: leadData.services.map(service => ({
        name: service.name || 'Default Service Name',
        buydate: service.buydate || new Date(), // Set default to current date
        expirydate: service.expirydate || new Date('2025-12-31') // Set default to a specific date
      }))
    };

    console.log("Creating lead with data:", leadPayload);  // Debugging log

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
      services: [{ name: 'Default Service Name', buydate: new Date(), expirydate: new Date('2025-12-31') }],  // Reset service array with defaults
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
    alert("Lead Has Been Created!");
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

      console.log("Updating lead with data:", leadPayload);  // Debugging log

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
        services: [],  // Reset service array
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
      setLeads(res.data);
    } catch (error) {
      setError("Failed to fetch leads");
      console.error("Error fetching leads:", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeads(startDate, endDate, selectedProgress);
  }, [startDate, endDate, selectedProgress]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
      const loggedInUser = res.data.find(user => user._id === userId);
      setCurrentUser(loggedInUser);

      const filteredExecutives = res.data.filter(user => user.parent?._id === userId);
      setExecutivesUnderAdmin(filteredExecutives.map(exec => exec._id));
    } catch (error) {
      console.error("Error fetching users", error);
    }
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
      console.log("Updated services:", updatedServices);  // Debugging log
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

  const removeService = (index) => {
    const updatedServices = [...leadData.services];
    updatedServices.splice(index, 1);
    setLeadData({ ...leadData, services: updatedServices });
  };



  // Upload excel files 

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const assignto = userId;
  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleFileUpload = async (assignTo) => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", file);
    formData.append("assignTo", assignto); // Append the assignTo value
  
    try {
      const response = await axios.post("http://localhost:5000/api/leads/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(response.data.message);
    } catch (error) {
      setMessage("Error uploading file: " + error.message);
    }
  };
  
  return (
    <div className="container-fluid mt-5" style={{ marginBottom: "100px" }}>
      <h3>Lead Creation!</h3>
      <hr className="my-4" />

      <div className="container mt-4">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="container ">
      <h6>Upload Leads In Excel</h6>
      <input type="file"  accept=".xlsx, .xls" onChange={handleFileChange} />
      <button className="btn btn-primary mt-3" onClick={handleFileUpload}>
        Upload
      </button>
      {message && <p className="mt-3">{message}</p>}
    </div>

  
          <form className="mb-4" onSubmit={createLead}>
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
                {leadData.services.map((service, index) => (
                  <div key={index} className="mb-3">
                    <div className="row">
                      <div className="col-md-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Service Name"
                          name="name"
                          value={service.name}
                          onChange={(e) => handleServiceChange(index, e)}
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="date"
                          className="form-control"
                          placeholder="Buy Date"
                          name="buydate"
                          value={service.buydate}
                          onChange={(e) => handleServiceChange(index, e)}
                        />
                      </div>
                      <div className="col-md-4">
                        <input
                          type="date"
                          className="form-control"
                          placeholder="Expiry Date"
                          name="expirydate"
                          value={service.expirydate}
                          onChange={(e) => handleServiceChange(index, e)}
                        />
                      </div>
                      <div className="col-md-1">
                        <button
                          type="button"
                          className="btn btn-danger"
                          onClick={() => removeService(index)}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                <button type="button" className="btn btn-secondary" onClick={addService}>
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
              Create Lead
            </button>
          </form>
    
      </div>
    </div>
  );
};

export default RoleBaseLead;
