import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Ballpit from "./Ballpit";

const Login1 = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.get("https://crm.hxbindia.com/api/users");
      setUsers(res.data);
    } catch (error) {
      setError("Error fetching users");
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find((user) => user.email === email && user.password === password);
    if (user) {
      setMessage("Login successful!");

      // Save user ID in localStorage
      localStorage.setItem("userId", user._id);

      // Set a timeout to clear the userId after 5 hours (18,000,000 milliseconds)
      const fiveHoursInMilliseconds = 5 * 60 * 60 * 1000;
      setTimeout(() => {
        localStorage.removeItem("userId");
        // Optionally, you can redirect the user to the login page or show a message
        alert("Your session has expired. Please log in again.");
        navigate("/login"); // Adjust the path as needed
      }, fiveHoursInMilliseconds);

      // Navigate to the home page or another protected route
      navigate("/");
    } else {
      setMessage("Invalid email or password");
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-sm-6" style={{ paddingTop: "100px" }}>
          <div className="bg-dark background-login" style={{ position: 'relative', overflow: 'hidden', minHeight: '500px', maxHeight: '500px', width: '100%' }}>
            <Ballpit
              count={200}
              gravity={0.7}
              friction={0.8}
              wallBounce={0.95}
              followCursor={true}
              colors={[0xff0000, 0x00ff00, 0x0000ff]} // Red, Green, Blue
            />
          </div>
        </div>
        <div className="col-sm-6" style={{ paddingTop: "100px" }}>
          <div className="card p-4 shadow w-100 p-5">
            <h2 className="text-center mb-4">Login</h2>
            {loading && <p className="text-center">Loading users...</p>}
            {error && <p className="text-danger text-center">{error}</p>}
            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email:</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Password:</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>
            {message && <p className="mt-3 text-center text-muted">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login1;
