import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import "bootstrap/dist/css/bootstrap.min.css";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "Executive",
    parent: [],
  });

  const roles = ["SuperAdmin", "Admin", "Subadmin", "Executive"];

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("http://localhost:5000/api/users");
      setUsers(res.data);
    } catch (error) {
      setError("Error fetching users");
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  const createUser = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const userData = {
        ...formData,
        parent: formData.parent.map(option => option.value), // Extract only the ID
      };
  
      console.log("Final Payload to Backend:", userData); // Debugging line
  
      await axios.post("http://localhost:5000/api/users/register", userData);
      alert("User created successfully");
      setFormData({ name: "", email: "", password: "", role: "Executive", parent: [] });
      fetchUsers();
    } catch (error) {
      setError("Error creating user");
      console.error("Error creating user", error);
    }
  };
  
  

  const updateUser = async (id) => {
    setError("");
    try {
      const userData = {
        ...formData,
        parent: formData.parent.map(option => option.value), // Send only the IDs to the API
      };
      await axios.put(`http://localhost:5000/api/users/${id}`, userData);
      alert("User updated successfully");
      setEditingUser(null);
      setFormData({ name: "", email: "", password: "", role: "Executive", parent: [] });
      fetchUsers();
    } catch (error) {
      setError("Error updating user");
      console.error("Error updating user", error);
    }
  };
  

  const deleteUser = async (id) => {
    setError("");
    try {
      await axios.delete(`http://localhost:5000/api/users/${id}`);
      fetchUsers();
    } catch (error) {
      setError("Error deleting user");
      console.error("Error deleting user", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">User Management</h2>
      {error && <p className="text-danger">{error}</p>}

      {/* Create or Update User Form */}
      <form
        className="mb-4"
        onSubmit={editingUser ? (e) => { e.preventDefault(); updateUser(editingUser); } : createUser}
      >
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>
        <div className="mb-3">
          <input
            type="email"
            className="form-control"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            disabled={editingUser}
          />
        </div>
        <div className="mb-3">
          <input
            type="password"
            className="form-control"
            placeholder="Password (Leave blank to keep current)"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <div className="mb-3">
          <select
            className="form-select"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            required
          >
            {roles.map((role) => (
              <option key={role} value={role}>{role}</option>
            ))}
          </select>
        </div>
        <div className="mb-3">
        <Select
  isMulti
  options={users.map((user) => ({ value: user._id, label: user.name }))} // Map users correctly
  value={formData.parent} // Make sure this is an array of objects
  onChange={(selectedOptions) => {
    console.log("Selected Options:", selectedOptions); // Debugging line
    setFormData({ ...formData, parent: selectedOptions || [] });
  }}
/>


        </div>
        <button type="submit" className="btn btn-primary">
          {editingUser ? "Update User" : "Create User"}
        </button>
      </form>

      {/* User List */}
      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="table table-striped table-bordered">
          <thead className="thead-dark">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Parent</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.parent?.map(parent => parent.name).join(", ") || "N/A"}</td>
                <td>
                  <button className="btn btn-danger btn-sm me-2" onClick={() => deleteUser(user._id)}>
                    Delete
                  </button>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => {
                      setEditingUser(user._id);
                      setFormData({
                        name: user.name,
                        email: user.email,
                        password: "",
                        role: user.role,
                        parent: user.parent?.map(parent => ({ value: parent._id, label: parent.name })) || [],
                      });
                    }}
                    
                  >
                    Edit
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

export default UserManagement;
