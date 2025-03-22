import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TrueFocus from "./TrueFocus";

const LeaveApplication = () => {
  const userId = localStorage.getItem("userId");
  const [userRole, setUserRole] = useState(null);

  const [formData, setFormData] = useState({
    userId: userId,
    leaveType: 'EL',
    startDate: '',
    endDate: '',
    reason: '',
  });

  const [message, setMessage] = useState('');
  const [leaveStatus, setLeaveStatus] = useState(null);
  const [leaveApplications, setLeaveApplications] = useState([]);
  const [userLeaves, setUserLeaves] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/leaves/apply', formData);
      setMessage('Leave applied successfully!');
      console.log(response.data);
      // Fetch the leave status after applying
      fetchLeaveStatus(response.data._id);
      fetchUserLeaves();
    } catch (error) {
      setMessage('Error applying leave. Please try again.');
      console.error(error);
    }
  };

  const fetchLeaveStatus = async (leaveId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/leaves/user/${userId}`);
      const leave = response.data.find(leave => leave._id === leaveId);
      if (leave) {
        setLeaveStatus(leave.status);
      }
    } catch (error) {
      console.error('Error fetching leave status:', error);
    }
  };

  const fetchAllLeaveApplications = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/leaves');
      setLeaveApplications(response.data);
    } catch (error) {
      console.error('Error fetching leave applications:', error);
    }
  };

  const fetchUserLeaves = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/leaves/user/${userId}`);
      setUserLeaves(response.data);
    } catch (error) {
      console.error('Error fetching user leaves:', error);
    }
  };

  const handleApproveReject = async (leaveId, status) => {
    try {
      await axios.put(`http://localhost:5000/api/leaves/update/${leaveId}`, { status });
      fetchAllLeaveApplications();
      fetchUserLeaves();
      setMessage(`Leave ${status} successfully!`);
    } catch (error) {
      setMessage('Error updating leave status. Please try again.');
      console.error(error);
    }
  };

  const fetchUserRole = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/users/${userId}`);
      setUserRole(response.data.role);
    } catch (error) {
      console.error('Error fetching user role:', error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchLeaveStatus();
      fetchUserRole();
      fetchUserLeaves();
    }
    if (userRole === 'Admin' || userRole === 'SuperAdmin') {
      fetchAllLeaveApplications();
    }
  }, [userId, userRole]);

  return (
    <div className="container mt-5">
      {/* <TrueFocus
        sentence="Apply for Leave!"
        manualMode={false}
        blurAmount={5}
        borderColor="red"
        animationDuration={2}
        pauseBetweenAnimations={1}
      /> */}
      <h3>Apply for Leave!</h3>
      <hr />
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="leaveType" className="form-label">Leave Type</label>
          <select
            className="form-select"
            id="leaveType"
            name="leaveType"
            value={formData.leaveType}
            onChange={handleChange}
            required
          >
            <option value="EL">Earned Leave (EL)</option>
            <option value="CL">Casual Leave (CL)</option>
            <option value="SL">Sick Leave (SL)</option>
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="startDate" className="form-label">Start Date</label>
          <input
            type="date"
            className="form-control"
            id="startDate"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="endDate" className="form-label">End Date</label>
          <input
            type="date"
            className="form-control"
            id="endDate"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="reason" className="form-label">Reason</label>
          <textarea
            className="form-control"
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Apply</button>
      </form>
      {message && <div className="mt-3 alert alert-info">{message}</div>}
      {leaveStatus && (
        <div className="mt-3 alert alert-success">
          Leave Status: {leaveStatus}
        </div>
      )}
      {userRole !== 'Admin' && userRole !== 'SuperAdmin' && (
        <div className="mt-5">
          <h2 className="mb-4">Your Leave Applications</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {userLeaves.map(leave => (
                <tr key={leave._id}>
                  <td>{leave.leaveType}</td>
                  <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td>{leave.reason}</td>
                  <td>{leave.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {(userRole === 'Admin' || userRole === 'SuperAdmin') && (
        <div className="mt-5">
          <h2 className="mb-4">Leave Applications</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Leave Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {leaveApplications.map(leave => (
                <tr key={leave._id}>
                  <td>{leave.user.name}</td>
                  <td>{leave.leaveType}</td>
                  <td>{new Date(leave.startDate).toLocaleDateString()}</td>
                  <td>{new Date(leave.endDate).toLocaleDateString()}</td>
                  <td>{leave.reason}</td>
                  <td>{leave.status}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleApproveReject(leave._id, 'Approved')}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleApproveReject(leave._id, 'Rejected')}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LeaveApplication;
