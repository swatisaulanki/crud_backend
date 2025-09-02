
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./ContactsPage.css";

const API_URL = "https://crud-backend-sx8n.onrender.com/api/contacts";

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  // Fetch contacts
  const fetchContacts = async () => {
    if (!token || !loggedInUser) {
      setError("No valid session. Please login again.");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(API_URL, config);
      const data = res.data || [];

      // Use backend data directly; backend already filters by user/admin
      setContacts(data);
      setFilteredContacts(data);
      setError("");
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setError("Failed to fetch contacts. Please login again.");
      localStorage.removeItem("token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Search filter
  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = contacts.filter((c) => {
      const phones = c.phones?.join(", ") || "";
      const emails = c.emails?.join(", ") || "";
      const firstName = c.firstName || "";
      const lastName = c.lastName || "";

      return (
        firstName.toLowerCase().includes(lowerTerm) ||
        lastName.toLowerCase().includes(lowerTerm) ||
        phones.toLowerCase().includes(lowerTerm) ||
        emails.toLowerCase().includes(lowerTerm)
      );
    });
    setFilteredContacts(filtered);
  }, [searchTerm, contacts]);

  // Delete contact
  const handleDelete = async (_id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await axios.delete(`${API_URL}/${_id}`, config);
        const updatedContacts = contacts.filter((c) => c._id !== _id);
        setContacts(updatedContacts);
        setFilteredContacts(updatedContacts);
      } catch (err) {
        console.error(err);
        setError("Error deleting contact. Please try again.");
      }
    }
  };

  // Edit contact
  const handleEdit = (contact) => {
    navigate("/edit-contact", { state: { contactToEdit: contact } });
  };

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ textAlign: "center", marginTop: "20px" }}>
        <h3>Contacts</h3>
        <p>
          Total Contacts: <b style={{ color: "red" }}>{contacts.length}</b>
        </p>

        {error && <p style={{ color: "red" }}>{error}</p>}
        {loading && <p>Loading contacts...</p>}

        <input
          type="text"
          placeholder="Search by name, mobile or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: "8px",
            marginTop: "10px",
            width: "300px",
            borderRadius: "6px",
            border: "1px solid #ccc",
          }}
        />
      </div>

      {filteredContacts.length > 0 ? (
        <table className="contact-table" style={{ marginTop: "20px" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Mobile Number</th>
              <th>Email</th>
              <th>Company</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredContacts.map((c) => (
              <tr key={c._id}>
                <td>{c.firstName} {c.lastName}</td>
                <td>{c.phones?.join(", ")}</td>
                <td>{c.emails?.join(", ")}</td>
                <td>{c.company}</td>
                <td>
                  <button
                    onClick={() => handleEdit(c)}
                    style={{ backgroundColor: "green", color: "white" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(c._id)}
                    style={{ marginLeft: "10px", backgroundColor: "red", color: "white" }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loading && !error && <p style={{ marginTop: "20px" }}>No contacts available.</p>
      )}
    </div>
  );
};

export default ContactsPage;
