import { useEffect, useState } from "react";
import axios from "axios";

const LeadsList = () => {
  const userId = localStorage.getItem("userId");
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [adminView, setAdminView] = useState("myLeads"); // Options: "myLeads", "subAdminExecutiveLeads"

  useEffect(() => {
    // Fetch leads from the API
    axios.get("https://crm.hxbindia.com/api/leads")
      .then(response => {
        filterLeads(response.data);
      })
      .catch(error => console.error("Error fetching leads:", error));

    // Fetch users to identify Executives and SubAdmins
    axios.get("https://crm.hxbindia.com/api/users")
      .then(response => {
        setUsers(response.data);
      })
      .catch(error => console.error("Error fetching users:", error));
  }, [adminView, selectedUser]);

  const filterLeads = (allLeads) => {
    let filtered = allLeads;

    if (adminView === "myLeads") {
      // Show only leads assigned to the current user
      filtered = allLeads.filter(lead => lead.assignedTo?._id === userId);
    } else if (adminView === "subAdminExecutiveLeads") {
      // Show leads assigned to the selected user (Executive or SubAdmin) or all under the current user
      if (selectedUser) {
        filtered = allLeads.filter(lead => lead.assignedTo?._id === selectedUser);
      } else {
        const subAdminExecIds = users
          .filter(user =>
            (user.role === "Executive" || user.role === "Subadmin") &&
            Array.isArray(user.parent) &&
            user.parent.some(parent => parent._id === userId)
          )
          .map(user => user._id);

        filtered = allLeads.filter(lead =>
          lead.assignedTo?._id && subAdminExecIds.includes(lead.assignedTo._id)
        );
      }
    }

    setFilteredLeads(filtered);
  };

  const toggleViewMode = () => {
    setAdminView(prevMode =>
      prevMode === "myLeads" ? "subAdminExecutiveLeads" : "myLeads"
    );
    setSelectedUser(""); // Reset selected user when toggling view mode
  };

  return (
    <div>
      <h2>Leads List</h2>
      <button onClick={toggleViewMode}>
        {adminView === "myLeads" ? "Show SubAdmin/Executive Leads" : "Show My Leads"}
      </button>
      {adminView === "subAdminExecutiveLeads" && (
        <div className="me-3 mb-3">
          <label className="me-2"><b>User:</b></label>
          <select
            className="form-select"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="">All SubAdmins and Executives</option>
            {users
              .filter(user =>
                (user.role === "Executive" || user.role === "Subadmin") &&
                Array.isArray(user.parent) &&
                user.parent.some(parent => parent._id === userId)
              )
              .map(user => (
                <option key={user._id} value={user._id}>
                  {user.name} - {user.role}
                </option>
              ))}
          </select>
        </div>
      )}
      <ul>
        {filteredLeads.map(lead => (
          <li key={lead._id}>
            <strong>Name:</strong> {lead.name} <br />
            <strong>Contact:</strong> {lead.contact} <br />
            <strong>Progress:</strong> {lead.progress} <br />
            <strong>Assigned To:</strong> {lead.assignedTo?.name} <br />
            <strong>Date:</strong> {new Date(lead.date).toLocaleDateString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LeadsList;
