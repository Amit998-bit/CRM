import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const Layout = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleSidebar}
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <a className="navbar-brand" href="#">Mantis</a>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <a className="nav-link" href="#">Dashboard</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Profile</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className="nav-link active" href="#">
              <i className="bi bi-house-door"></i> Dashboard
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              <i className="bi bi-pencil-square"></i> Typography
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              <i className="bi bi-palette"></i> Color
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              <i className="bi bi-patch-question"></i> Icons
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              <i className="bi bi-box-arrow-in-right"></i> Login
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              <i className="bi bi-person-plus"></i> Register
            </a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="content">
        <h1>Welcome to the Dashboard</h1>
        <p>This is the main content area.</p>
      </div>

      {/* Styles */}
      <style jsx>{`
        .sidebar {
          width: 250px;
          position: fixed;
          top: 0;
          left: 0;
          height: 100%;
          background-color: #f8f9fa;
          transition: transform 0.3s ease;
          transform: ${isOpen ? 'translateX(0)' : 'translateX(-100%)'};
        }
        .sidebar.open {
          transform: translateX(0);
        }
        .content {
          margin-left: 250px;
          padding: 20px;
          transition: margin-left 0.3s ease;
        }
        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .content {
            margin-left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default Layout;
