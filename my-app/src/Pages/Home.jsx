
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Home.css";

const API_URL = "https://crud-backend-sx8n.onrender.com/api/contacts";

const Home = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const res = await axios.get(API_URL, config);
      let data = res.data;

      if (loggedInUser?.role !== "admin") {
        data = data.filter(
          (c) => String(c.userId) === String(loggedInUser._id || loggedInUser.id)
        );
      }

      setContacts(data);
      setFilteredContacts(data);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setMessage("❌ Failed to fetch contacts. Please login again.");
      setTimeout(() => navigate("/login"), 1500);
    }
  };

  useEffect(() => {
    if (!loggedInUser || !token) navigate("/login");
    else fetchContacts();
  }, [loggedInUser, token]);

  const handleContactUpdate = (updatedContact, deletedId) => {
    if (deletedId) {
      const newContacts = contacts.filter(c => c._id !== deletedId && c.id !== deletedId);
      setContacts(newContacts);
      setFilteredContacts(newContacts);
    } else if (updatedContact) {
      const newContacts = contacts.map(c =>
        (c._id === updatedContact._id || c.id === updatedContact.id) ? updatedContact : c
      );
      setContacts(newContacts);
      setFilteredContacts(newContacts);
    }
  };

  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = contacts.filter((c) => {
      const phones = c.phones?.join(", ") || "";
      const emails = c.emails?.join(", ") || "";
      const name = (c.firstName + " " + c.lastName).toLowerCase();
      return (
        name.includes(lowerTerm) ||
        phones.toLowerCase().includes(lowerTerm) ||
        emails.toLowerCase().includes(lowerTerm)
      );
    });
    setFilteredContacts(filtered);
  }, [searchTerm, contacts]);

  // Delete contact
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await axios.delete(`${API_URL}/${id}`, config);
        handleContactUpdate(null, id);
      } catch (err) {
        console.error("❌ Error deleting contact:", err);
        setMessage("❌ Error deleting contact.");
      }
    }
  };

  // Edit contact
  const handleEdit = (c) => {
    // Check if _id exists; fallback to id
    const contactId = c._id || c.id;
    if (!contactId) {
      console.error("Contact ID is missing!", c);
      return;
    }

    navigate(`/edit-contact/${contactId}`, {
      state: { contactToEdit: c }
    });
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ textAlign: "center" }}>Contacts</h2>
      {message && <p style={{ textAlign: "center", color: "red" }}>{message}</p>}
      <p style={{ textAlign: "center" }}>
        Total Contacts: <b style={{ color: "red" }}>{contacts.length}</b>
      </p>

      <div style={{ textAlign: "center", marginBottom: "15px" }}>
        <input
          type="text"
          placeholder="Search by name, mobile, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            width: "300px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {filteredContacts.length > 0 ? (
        <table className="contact-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((c) => (
              <tr key={c._id || c.id}>
                <td>{c.firstName} {c.lastName}</td>
                <td>{c.phones?.join(", ")}</td>
                <td>{c.emails?.join(", ")}</td>
                <td>
                  <button
                    style={{ backgroundColor: "green", color: "white" }}
                    onClick={() => handleEdit(c)}
                  >
                    Edit
                  </button>
                  <button
                    style={{ backgroundColor: "red", color: "white", marginLeft: "10px" }}
                    onClick={() => handleDelete(c._id || c.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p style={{ textAlign: "center" }}>No contacts found.</p>
      )}
    </div>
  );
};

export default Home;
