import React, { useState, useEffect } from "react";
import axios from "axios";

const Register = () => {
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        role: "executive",
        assignedAdmin: "",
    });

    const [admins, setAdmins] = useState([]); // List of admins for assignment
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchAdmins(); // Load available admins for assignment
    }, []);

    const fetchAdmins = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/users/admins");
            setAdmins(response.data);
        } catch (error) {
            console.error("Error fetching admins:", error);
        }
    };

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        try {
            const response = await axios.post("http://localhost:5000/api/auth/register", user, {
                headers: { "Content-Type": "application/json" }
            });
            setMessage(response.data.message);
            setUser({ name: "", email: "", password: "", role: "executive", assignedAdmin: "" });
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="container mt-5">
            <h2>Register New User</h2>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit} className="mb-4">
                <input type="text" name="name" placeholder="Name" value={user.name} onChange={handleChange} required className="form-control mb-2" />
                <input type="email" name="email" placeholder="Email" value={user.email} onChange={handleChange} required className="form-control mb-2" />
                <input type="password" name="password" placeholder="Password" value={user.password} onChange={handleChange} required className="form-control mb-2" />

                <select name="role" value={user.role} onChange={handleChange} required className="form-control mb-2">
                    <option value="superadmin">Super Admin</option>
                    <option value="admin">Admin</option>
                    <option value="executive">Executive</option>
                </select>

                {user.role === "executive" && (
                    <select name="assignedAdmin" value={user.assignedAdmin} onChange={handleChange} className="form-control mb-2">
                        <option value="">Select Admin</option>
                        {admins.map(admin => (
                            <option key={admin._id} value={admin._id}>{admin.name}</option>
                        ))}
                    </select>
                )}

                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        </div>
    );
};

export default Register;
