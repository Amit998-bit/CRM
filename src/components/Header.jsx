import React, { useState, useEffect } from "react";
import axios from "axios";
import logo from "../logo.png"
import user from "./image.png"
import { Link } from 'react-router-dom';
const Header = () => {
  const userId = localStorage.getItem("userId");
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [userName, setUserName] = useState(""); // State to store the user name

  const fetchUsers = async () => {
    try {
      const res = await axios.get("https://crm.hxbindia.com/api/users");
      setUsers(res.data);

      // Find logged-in user details
      const loggedInUser = res.data.find(user => user._id === userId);
      setCurrentUser(loggedInUser);

      // Store the user name in the variable
      if (loggedInUser) {
        setUserName(loggedInUser.name);
      }

      console.log(loggedInUser);

    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);



  return (
    <header className='sticky-top'>
      {/* Navbar */}
      <nav class="navbar navbar-expand-lg navbar-light bg-light mask-custom">
  <div class="container-fluid">
    <Link class="navbar-brand" to={"/"}><img src={logo} className='navbar-brand' style={{width:"80px"}}/></Link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarSupportedContent">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">
          <Link class="nav-link active" aria-current="page" to={"/"}>Home</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to={"/role-leads"}>Lead Creation</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to={"/leads"}>My Leads</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to={"/followup"}>Follow Up</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to={"/existing"}>Existing Leads</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to={"/leave"}>Apply Leave</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to={"/HR-policy"}>HR Policy</Link>
        </li>
        <li class="nav-item">
          <Link class="nav-link" to={"/brochure"}>Company Brochure</Link>
        </li>
        {/* <li class="nav-item">
          <a class="nav-link disabled" href="#" tabindex="-1" aria-disabled="true">Disabled</a>
        </li> */}
      </ul>
      <form class="d-flex">
      <img src={user} style={{width:'60px'}} alt="" /><p className="mt-3"><b>{userName}</b> </p>
      </form>
    </div>
  </div>
</nav>
      {/* Navbar */}

      {/* Section: Design Block */}
     
    </header>
  );
};

export default Header;
