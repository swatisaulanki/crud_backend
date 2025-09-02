
import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import "./ContactForm.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ContactForm = () => {
  const [emails, setEmails] = useState([""]);
  const [phones, setPhones] = useState([""]);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    jobTitle: "",
    address: "",
    month: "",
    day: "",
    year: "",
    notes: "",
  });
  const [successMessage, setSuccessMessage] = useState(""); // success banner

  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));

  // ✅ Validate login
  useEffect(() => {
    if (!token || !loggedInUser) {
      alert("You must login first");
      navigate("/login");
      return;
    }
  }, [navigate, token, loggedInUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEmailChange = (index, value) => {
    const updated = [...emails];
    updated[index] = value;
    setEmails(updated);
  };
  const addEmailField = () => setEmails([...emails, ""]);

  const handlePhoneChange = (index, value) => {
    const updated = [...phones];
    updated[index] = value;
    setPhones(updated);
  };
  const addPhoneField = () => setPhones([...phones, ""]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone numbers
    const invalidPhone = phones.some((p) => p.replace(/\D/g, "").length < 10);
    if (invalidPhone) {
      alert("Please enter valid phone numbers with at least 10 digits.");
      return;
    }

    const { day, month, year, ...rest } = formData;
    const finalData = {
      ...rest,
      emails,
      phones,
      birthday: { day, month, year },
    };

    try {
      await axios.post(
        "https://crud-backend-sx8n.onrender.com/api/contacts",
        finalData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ Scroll top and show success message
      window.scrollTo({ top: 0, behavior: "smooth" });
      setSuccessMessage("✅ Contact saved successfully!");

      // Hide after 3s
      setTimeout(() => setSuccessMessage(""), 3000);

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        company: "",
        jobTitle: "",
        address: "",
        month: "",
        day: "",
        year: "",
        notes: "",
      });
      setEmails([""]);
      setPhones([""]);
    } catch (error) {
      console.error(error);
      alert(
        error.response?.data?.message ||
          "Error saving contact. Please try again."
      );
    }
  };

  return (
    <div className="contact-container">
      {/* ✅ Success banner */}
      {successMessage && (
        <div className="success-banner">
          {successMessage}
        </div>
      )}

      <form className="contact-form" onSubmit={handleSubmit}>
        <button type="button" className="back-btn" onClick={() => navigate(-1)}>
          ← Back
        </button>

        <div className="profile-pic">
          <div className="avatar"></div>
          <button type="button" className="add-btn">
            +
          </button>
        </div>

        {/* Name */}
        <div className="form-group">
          <label>First name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label>Last name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
        </div>

        {/* Company / Job */}
        <div className="form-group">
          <label>Company</label>
          <input
            type="text"
            name="company"
            value={formData.company}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Job title</label>
          <input
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={handleChange}
          />
        </div>

        {/* Emails */}
        <label>Email</label>
        {emails.map((email, index) => (
          <div key={index} className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => handleEmailChange(index, e.target.value)}
            />
          </div>
        ))}
        <button type="button" className="add-link" onClick={addEmailField}>
          + Add email
        </button>

        {/* Phones */}
        <label>Phone</label>
        {phones.map((phone, index) => (
          <div key={index} className="form-group">
            <PhoneInput
              country={"in"}
              value={phone}
              onChange={(value) => handlePhoneChange(index, value)}
              enableSearch
              countryCodeEditable
              disableCountryCode={false}
              inputProps={{ name: "phone", required: true }}
              containerClass="phone-container"
              inputClass="phone-input"
            />
          </div>
        ))}
        <button type="button" className="add-link" onClick={addPhoneField}>
          + Add phone
        </button>

        {/* Address */}
        <div className="form-group">
          <label>Address</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>

        {/* Birthday */}
        <div className="form-group">
          <label>Birthday</label>
          <div className="birthday">
            <select name="month" value={formData.month} onChange={handleChange}>
              <option value="">Month</option>
              {[
                "January","February","March","April","May","June",
                "July","August","September","October","November","December",
              ].map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
            <input
              type="number"
              name="day"
              placeholder="Day"
              value={formData.day}
              onChange={handleChange}
            />
            <input
              type="number"
              name="year"
              placeholder="Year (optional)"
              value={formData.year}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Notes */}
        <div className="form-group">
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" className="save-btn">
          Save Contact
        </button>
      </form>
    </div>
  );
};

export default ContactForm;
