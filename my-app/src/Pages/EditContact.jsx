

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import axios from "axios";
import "./EditContact.css";

const API_URL = "https://crud-backend-sx8n.onrender.com/api/contacts";

const EditContact = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // contact ID from URL

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emails, setEmails] = useState([""]);
  const [phones, setPhones] = useState([""]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    if (!token) {
      alert("Please login first.");
      navigate("/login");
      return;
    }

    const fetchContact = async () => {
      try {
        const res = await axios.get(`${API_URL}/${id}`, config);
        const contact = res.data;

        setFirstName(contact.firstName || "");
        setLastName(contact.lastName || "");
        setEmails(contact.emails?.length ? contact.emails : [""]);
        setPhones(contact.phones?.length ? contact.phones : [""]);
      } catch (err) {
        console.error("Error fetching contact:", err);
        if (err.response?.status === 401) {
          alert("Session expired. Please login again.");
          navigate("/login");
        } else {
          alert("Contact not found!");
          navigate("/contact");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [id, navigate, token]);

  // Emails handlers
  const handleEmailChange = (i, value) => {
    const updated = [...emails];
    updated[i] = value;
    setEmails(updated);
  };
  const addEmailField = () => setEmails([...emails, ""]);
  const removeEmailField = (i) => {
    const updated = emails.filter((_, index) => index !== i);
    setEmails(updated.length ? updated : [""]);
  };

  // Phones handlers
  const handlePhoneChange = (i, value) => {
    const updated = [...phones];
    updated[i] = value;
    setPhones(updated);
  };
  const addPhoneField = () => setPhones([...phones, ""]);
  const removePhoneField = (i) => {
    const updated = phones.filter((_, index) => index !== i);
    setPhones(updated.length ? updated : [""]);
  };

  // Save updated contact
  const handleSave = async () => {
    const invalidPhone = phones.some((p) => p.replace(/\D/g, "").length < 10);
    if (invalidPhone) {
      alert("Please enter valid phone numbers with at least 10 digits.");
      return;
    }

    const updatedContact = { firstName, lastName, emails, phones };

    try {
      await axios.put(`${API_URL}/${id}`, updatedContact, config);
      alert("Contact updated successfully!");
      navigate("/contact");
    } catch (err) {
      console.error("Error updating contact:", err);
      if (err.response?.status === 401) {
        alert("Session expired. Please login again.");
        navigate("/login");
      } else {
        alert("Error updating contact!");
      }
    }
  };

  if (loading) return <p style={{ textAlign: "center" }}>Loading contact...</p>;

  return (
    <div className="edit-container">
      <div className="edit-card">
        <h2>Edit Contact</h2>

        {/* First Name */}
        <div className="form-group">
          <label>First Name</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </div>

        {/* Last Name */}
        <div className="form-group">
          <label>Last Name</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

        {/* Emails */}
        <div className="form-group">
          <label>Emails</label>
          {emails.map((email, i) => (
            <div key={i} className="email-row">
              <input
                type="email"
                value={email}
                onChange={(e) => handleEmailChange(i, e.target.value)}
              />
              <button type="button" onClick={() => removeEmailField(i)}>❌</button>
            </div>
          ))}
          <button type="button" onClick={addEmailField}>+ Add Email</button>
        </div>

        {/* Phones */}
        <div className="form-group">
          <label>Phones</label>
          {phones.map((phone, i) => (
            <div key={i} className="phone-row">
              <PhoneInput
                country="in"
                value={phone}
                onChange={(value) => handlePhoneChange(i, value)}
                inputClass="phone-input"
                containerClass="phone-container"
              />
              <button type="button" onClick={() => removePhoneField(i)}>❌</button>
            </div>
          ))}
          <button type="button" onClick={addPhoneField}>+ Add Phone</button>
        </div>

        {/* Buttons */}
        <div className="button-group">
          <button type="button" className="save-btn" onClick={handleSave}>
            Save
          </button>
          <button type="button" className="cancel-btn" onClick={() => navigate("/contact")}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditContact;




