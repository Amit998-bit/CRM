import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import LeadManagement from "./components/LeadManagement";
import "bootstrap/dist/css/bootstrap.min.css";
import LeadTest from "./components/LeadTest";
import UserAuth from "./components/UserAuth";
import CRMTest from "./components/CRMTest";
import RoleBaseLead from "./components/RoleBaseLead";
import Login1 from "./components/Login1";
import LeadsList from "./components/LeadsList";
import Layout from "./components/Layout";
import Header from "./components/Header";
import Home from "./components/Home";
import LeaveApplication from "./components/LeaveApplication";
import HRPolicy from "./components/HRPolicy";
import ProtectedRoute from "./components/ProtectedRoute";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Brochure from "./components/Brochure";
import LeadFilterComponent from "./components/LeadFilterComponent";
import Followup from "./components/Followup";
import Existing from "./components/Existing";
import LeadForm from "./components/LeadForm";
import ExcelLeadUploadForm from "./components/ExcelLeadUploadForm";
import Leads from "./components/Lead";
import UsersList from "./components/UserList";


const App = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isAuthenticated = () => {
    const userId = localStorage.getItem('userId');
    console.log('Checking authentication:', userId);
    return !!userId;
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
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

 
  return (
    <Router>
      <div className="container mt-4">
        <Header />
        <Routes>
          <Route path="/login" element={<Login1 />} />
          <Route path="/HR-policy" element={<HRPolicy />} />
          <Route path="/brochure" element={<Brochure />} />
          <Route path="/test-lead" element={<LeadForm/>} />
          <Route path="/1" element={<Leads/>} />
          <Route path="/excel" element={<ExcelLeadUploadForm/>} />
          <Route path="/2" element={<UsersList/>} />



          <Route
            path="/UserAuth"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated()} redirectPath="/login">
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated()} redirectPath="/login">
                <Register />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated()} redirectPath="/login">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leads"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated()} redirectPath="/login">
                <LeadFilterComponent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/super-admin-panel"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated()} redirectPath="/login">
                <CRMTest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/filter"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated()} redirectPath="/login">
                <LeadsList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated()} redirectPath="/login">
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/leave"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated()} redirectPath="/login">
                <LeaveApplication />
              </ProtectedRoute>
            }
          />
          <Route
            path="/role-leads"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated()} redirectPath="/login">
                <RoleBaseLead />
              </ProtectedRoute>
            }
          />

<Route
            path="/followup"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated()} redirectPath="/login">
                <Followup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/existing"
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated()} redirectPath="/login">
                <Existing />
              </ProtectedRoute>
            }
          />

          {/* Wildcard route to catch undefined routes */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
