import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faUser, faSearch, faPlus,faCircleUser  } from "@fortawesome/free-solid-svg-icons";
import "./Navbar.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
const Navbar = () => {
  const [isOpen, setIsOpen] = useState(true);
const [loggedInUser, setLoggedInUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);
    const [showModal, setShowModal] = useState(false); // modal state

const navigate= useNavigate()
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("loggedInUser"));
    setLoggedInUser(user);
  }, []);
  return (
    <>
      {/* Top Navbar */}
      <nav className="navbar">
        {/* Left Side */}
        <div className="navbar-left">
          <FontAwesomeIcon
            icon={faBars}
            className="icon"
            onClick={() => setIsOpen(!isOpen)} // toggle sidebar
          />
          <FontAwesomeIcon icon={faUser} className="icon" />
          
          <Link to="/home" style={{ textDecoration: "none", color: "inherit" }}><h2 className="navbar-title">Contacts</h2></Link>
        </div>

        {/* Right Side - Search */}
        <div className="navbar-search">
          <input type="text" placeholder="Search..." />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>

             {/* Right Side - Profile */}
        {loggedInUser && (
          <div className="navbar-right">
            <div className="profile-container">
             
              <FontAwesomeIcon
                icon={faCircleUser}
                className="icon profile-icon"
                onClick={() => setShowUserDetails(!showUserDetails)}
              />
           <span className="navbar-greeting">
                Hi {loggedInUser?.name ? loggedInUser.name.split(" ")[0] : "User"}

              </span>
              {showUserDetails && (
                <div className="user-details-popup">
                  <p><strong>Name:</strong> {loggedInUser.name || "N/A"}</p>
                  <p><strong>Email:</strong> {loggedInUser.email || "N/A"}</p>
                  <button
                    className="logout-btn"
                    onClick={() => {
                      localStorage.removeItem("loggedInUser");
                      setLoggedInUser(null);
                      navigate("/login"); // redirect to login page
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        )}


      </nav>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
        <div className="sidebar-item" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} className="icon" />

          {isOpen && <Link to="/add-contact" style={{ textDecoration: "none", color: "inherit" }}> <h2>Create contact</h2></Link> }
        </div>

        <div className="sidebar-item">
        <FontAwesomeIcon icon={faUser} className="icon" />

          {isOpen && <Link to="/contact" style={{ textDecoration: "none", color: "inherit" }}> <h2>Contacts</h2></Link> }
        </div>
        
      </div>

    </>
  );
};

export default Navbar;
