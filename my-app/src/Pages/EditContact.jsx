

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
        console.error("❌ Error fetching contact:", err);
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
      alert("⚠️ Please enter valid phone numbers with at least 10 digits.");
      return;
    }

    const updatedContact = { firstName, lastName, emails, phones };

    try {
      await axios.put(`${API_URL}/${id}`, updatedContact, config);
      alert("✅ Contact updated successfully!");
      navigate("/contact");
    } catch (err) {
      console.error("❌ Error updating contact:", err);
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




// // EditContact.js
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import axios from "axios";
// import "./EditContact.css"; // your CSS

// const API_URL = "https://crud-backend-sx8n.onrender.com/api/contacts";

// const EditContact = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { contactToEdit } = location.state || {};

//   // Redirect if no contact data is found
//   useEffect(() => {
//     if (!contactToEdit) {
//       navigate("/contact");
//     }
//   }, [contactToEdit, navigate]);

//   const [firstName, setFirstName] = useState(contactToEdit?.firstName || "");
//   const [lastName, setLastName] = useState(contactToEdit?.lastName || "");
//   const [emails, setEmails] = useState(contactToEdit?.emails || [""]);
//   const [phones, setPhones] = useState(contactToEdit?.phones || [""]);

//   // Email handlers
//   const handleEmailChange = (i, value) => {
//     const updated = [...emails];
//     updated[i] = value;
//     setEmails(updated);
//   };
//   const addEmailField = () => setEmails([...emails, ""]);

//   // Phone handlers
//   const handlePhoneChange = (i, value) => {
//     const updated = [...phones];
//     updated[i] = value;
//     setPhones(updated);
//   };
//   const addPhoneField = () => setPhones([...phones, ""]);

//   // Save updated contact with backend
//   const handleSave = async () => {
//     // Validation: all numbers should have at least 10 digits
//     const invalidPhone = phones.some((p) => p.replace(/\D/g, "").length < 10);
//     if (invalidPhone) {
//       alert("Please enter valid phone numbers with at least 10 digits.");
//       return;
//     }

//     const updatedContact = {
//       firstName,
//       lastName,
//       emails,
//       phones,
//     };

//     try {
//       await axios.put(`${API_URL}/${contactToEdit._id}`, updatedContact);
//       alert("Contact updated successfully!");
//       navigate("/contact");
//     } catch (err) {
//       console.error(err);
//       alert("Error updating contact!");
//     }
//   };

//   return (
//     <div className="edit-container">
//       <div className="edit-card">
//         <h2>Edit Contact</h2>

//         {/* Name Fields */}
//         <div className="form-group">
//           <label>First Name</label>
//           <input
//             type="text"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//           />
//         </div>

//         <div className="form-group">
//           <label>Last Name</label>
//           <input
//             type="text"
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//           />
//         </div>

//         {/* Email Fields */}
//         <div className="form-group">
//           <label>Email</label>
//           {emails.map((email, i) => (
//             <input
//               key={i}
//               type="email"
//               value={email}
//               onChange={(e) => handleEmailChange(i, e.target.value)}
//             />
//           ))}
//           <button type="button" className="add-btn" onClick={addEmailField}>
//             + Add Email
//           </button>
//         </div>

//         {/* Phone Fields */}
//         <div className="form-group">
//           <label>Phone</label>
//           {phones.map((phone, i) => (
//             <PhoneInput
//               key={i}
//               country="in"
//               value={phone}
//               onChange={(value) => handlePhoneChange(i, value)}
//               inputClass="phone-input"
//               containerClass="phone-container"
//             />
//           ))}
//           <button type="button" className="add-btn" onClick={addPhoneField}>
//             + Add Phone
//           </button>
//         </div>

//         {/* Buttons */}
//         <div className="button-group">
//           <button type="button" className="save-btn" onClick={handleSave}>
//             Save
//           </button>
//           <button
//             type="button"
//             className="cancel-btn"
//             onClick={() => navigate("/contact")}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditContact;










// // EditContact.js
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import axios from "axios";
// import "./EditContact.css";

// const API_URL = "https://crud-backend-sx8n.onrender.com/api/contacts";

// const EditContact = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { contactToEdit } = location.state || {};

//   useEffect(() => {
//     if (!contactToEdit) {
//       navigate("/contact");
//     }
//   }, [contactToEdit, navigate]);

//   const [firstName, setFirstName] = useState(contactToEdit?.firstName || "");
//   const [lastName, setLastName] = useState(contactToEdit?.lastName || "");
//   const [emails, setEmails] = useState(contactToEdit?.emails || [""]);
//   const [phones, setPhones] = useState(contactToEdit?.phones || [""]);

//   // Email handlers
//   const handleEmailChange = (i, value) => {
//     const updated = [...emails];
//     updated[i] = value;
//     setEmails(updated);
//   };
//   const addEmailField = () => setEmails([...emails, ""]);

//   // Phone handlers
//   const handlePhoneChange = (i, value) => {
//     const updated = [...phones];
//     updated[i] = value;
//     setPhones(updated);
//   };
//   const addPhoneField = () => setPhones([...phones, ""]);

//   // Save updated contact
//   const handleSave = async () => {
//     const invalidPhone = phones.some((p) => p.replace(/\D/g, "").length < 10);  //The regex /\D/g matches all non-digit characters 
//                                                                                 //check exact length = 10, not just < 10
//     if (invalidPhone) {
//       alert("Please enter valid phone numbers with at least 10 digits.");
//       return;
//     }

// //     const handleSave = async () => {
// //   const invalidPhone = phones.some((p) => {
// //     const cleaned = p.replace(/\D/g, ""); // remove all non-digits
// //     // must be exactly 10 digits AND must start with 6–9
// //     return cleaned.length !== 10 || !/^[6-9]/.test(cleaned);
// //   });

// //   if (invalidPhone) {
// //     alert("Please enter valid phone numbers: exactly 10 digits, starting with 6–9.");
// //     return;
// //   }

// //   // If phone is valid, continue saving
// //   try {
// //     // your save logic here (e.g., API call)
// //     console.log("Phones are valid:", phones);
// //   } catch (error) {
// //     console.error("Error saving:", error);
// //   }
// // };

//     const updatedContact = {
//       ...contactToEdit,
//       firstName,
//       lastName,
//       emails,
//       phones,
//     };

//     try {
//       await axios.put(`${API_URL}/${contactToEdit._id}`, updatedContact);
//       alert("Contact updated successfully!");
//       navigate("/contact");
//     } catch (err) {
//       console.error(err);
//       alert("Error updating contact");
//     }
//   };

//   return (
//     <div className="edit-container">
//       <div className="edit-card">
//         <h2>Edit Contact</h2>

//         {/* Name */}
//         <div className="form-group">
//           <label>First Name</label>
//           <input
//             type="text"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//           />
//         </div>

//         <div className="form-group">
//           <label>Last Name</label>
//           <input
//             type="text"
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//           />
//         </div>

//         {/* Emails */}
//         <div className="form-group">
//           <label>Email</label>
//           {emails.map((email, i) => (
//             <input
//               key={i}
//               type="email"
//               value={email}
//               onChange={(e) => handleEmailChange(i, e.target.value)}
//             />
//           ))}
//           <button type="button" onClick={addEmailField}>+ Add Email</button>
//         </div>

//         {/* Phones */}
//         <div className="form-group">
//           <label>Phone</label>
//           {phones.map((phone, i) => (
//             <PhoneInput
//               key={i}
//               country={"in"}
//               value={phone}
//               onChange={(value) => handlePhoneChange(i, value)}
//               enableSearch={true}
//               countryCodeEditable={true}
//               disableCountryCode={false}
//               inputProps={{
//                 name: "phone",
//                 required: true,
//                 autoFocus: i === 0,
//                 style: { width: "100%" },
//               }}
//               containerClass="phone-container"
//               inputClass="phone-input"
//             />
//           ))}
//           <button type="button" onClick={addPhoneField}>+ Add Phone</button>
//         </div>

//         {/* Buttons */}
//         <div className="button-group">
//           <button type="button" onClick={handleSave} style={{backgroundColor:"green", color:"white"}}>Save</button>
//           <button type="button" onClick={() => navigate("/contact")} style={{backgroundColor:"red", color:"white"}}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditContact;


// EditContact.js
// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import axios from "axios";
// import "./EditContact.css";

// const API_URL = "https://crud-backend-sx8n.onrender.com/api/contacts";

// const EditContact = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { contactToEdit } = location.state || {};

//   const [firstName, setFirstName] = useState(contactToEdit?.firstName || "");
//   const [lastName, setLastName] = useState(contactToEdit?.lastName || "");
//   const [emails, setEmails] = useState(contactToEdit?.emails || [""]);
//   const [phones, setPhones] = useState(contactToEdit?.phones || [""]);
//   const [loading, setLoading] = useState(false);

//   // Redirect if no contact
//   useEffect(() => {
//     if (!contactToEdit) navigate("/contact");
//   }, [contactToEdit, navigate]);

//   // Email handlers
//   const handleEmailChange = (i, value) => {
//     const updated = [...emails];
//     updated[i] = value;
//     setEmails(updated);
//   };
//   const addEmailField = () => setEmails([...emails, ""]);

//   // Phone handlers
//   const handlePhoneChange = (i, value) => {
//     const updated = [...phones];
//     updated[i] = value;
//     setPhones(updated);
//   };
//   const addPhoneField = () => setPhones([...phones, ""]);

//   // Save contact
//   const handleSave = async () => {
//     // Strict phone validation
//     const invalidPhone = phones.some((p) => {
//       const cleaned = p.replace(/\D/g, "");
//       return cleaned.length !== 10 || !/^[6-9]/.test(cleaned);
//     });
//     if (invalidPhone) {
//       alert("Please enter valid phone numbers: 10 digits starting with 6-9.");
//       return;
//     }

//     // Clean empty emails/phones
//     const cleanedEmails = emails.filter((e) => e.trim() !== "");
//     const cleanedPhones = phones.filter((p) => p.trim() !== "");

//     const updatedContact = {
//       firstName,
//       lastName,
//       emails: cleanedEmails,
//       phones: cleanedPhones,
//     };

//     setLoading(true);
//     try {
//       await axios.put(`${API_URL}/${contactToEdit._id}`, updatedContact);
//       alert("Contact updated successfully!");
//       navigate("/contact");
//     } catch (err) {
//       console.error(err);
//       alert("Error updating contact!");
//     }
//     setLoading(false);
//   };

//   return (
//     <div className="edit-container">
//       <div className="edit-card">
//         <h2>Edit Contact</h2>

//         {/* Name Fields */}
//         <div className="form-group">
//           <label>First Name</label>
//           <input
//             type="text"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//           />
//         </div>

//         <div className="form-group">
//           <label>Last Name</label>
//           <input
//             type="text"
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//           />
//         </div>

//         {/* Emails */}
//         <div className="form-group">
//           <label>Email</label>
//           {emails.map((email, i) => (
//             <input
//               key={i}
//               type="email"
//               value={email}
//               onChange={(e) => handleEmailChange(i, e.target.value)}
//             />
//           ))}
//           <button type="button" onClick={addEmailField}>
//             + Add Email
//           </button>
//         </div>

//         {/* Phones */}
//         <div className="form-group">
//           <label>Phone</label>
//           {phones.map((phone, i) => (
//             <PhoneInput
//               key={i}
//               country="in"
//               value={phone}
//               onChange={(value) => handlePhoneChange(i, value)}
//               enableSearch={true}
//               countryCodeEditable={true}
//               disableCountryCode={false}
//               inputProps={{
//                 name: "phone",
//                 required: true,
//                 autoFocus: i === 0,
//                 style: { width: "100%" },
//               }}
//               containerClass="phone-container"
//               inputClass="phone-input"
//             />
//           ))}
//           <button type="button" onClick={addPhoneField}>
//             + Add Phone
//           </button>
//         </div>

//         {/* Buttons */}
//         <div className="button-group">
//           <button
//             type="button"
//             onClick={handleSave}
//             style={{ backgroundColor: "green", color: "white" }}
//             disabled={loading}
//           >
//             {loading ? "Saving..." : "Save"}
//           </button>
//           <button
//             type="button"
//             onClick={() => navigate("/contact")}
//             style={{ backgroundColor: "red", color: "white" }}
//             disabled={loading}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditContact;



// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import axios from "axios";
// import "./EditContact.css";

// const API_URL = "http://localhost:6060/api/contacts";

// const EditContact = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { contactToEdit } = location.state || {};

//   const [firstName, setFirstName] = useState(contactToEdit?._id ? contactToEdit.firstName : "");
//   const [lastName, setLastName] = useState(contactToEdit?.lastName || "");
//   const [emails, setEmails] = useState(contactToEdit?.emails || [""]);
//   const [phones, setPhones] = useState(contactToEdit?.phones || [""]);
//   const [loading, setLoading] = useState(false);

//   const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
//   const token = localStorage.getItem("token");

//   const config = { headers: { Authorization: `Bearer ${token}` } };

//   // Redirect if no contact
//   useEffect(() => {
//     if (!contactToEdit?._id) navigate("/contact");

//     // Only allow admin or owner to edit
//     if (
//       loggedInUser?.role !== "admin" &&
//       contactToEdit?.userId !== loggedInUser?.id
//     ) {
//       alert("You are not allowed to edit this contact.");
//       navigate("/contact");
//     }
//   }, [contactToEdit, navigate, loggedInUser]);

//   // Email handlers
//   const handleEmailChange = (i, value) => {
//     const updated = [...emails];
//     updated[i] = value;
//     setEmails(updated);
//   };
//   const addEmailField = () => setEmails([...emails, ""]);

//   // Phone handlers
//   const handlePhoneChange = (i, value) => {
//     const updated = [...phones];
//     updated[i] = value;
//     setPhones(updated);
//   };
//   const addPhoneField = () => setPhones([...phones, ""]);

//   // Save contact
//   const handleSave = async () => {
//     const invalidPhone = phones.some((p) => {
//       const cleaned = p.replace(/\D/g, "");
//       return cleaned.length !== 10 || !/^[6-9]/.test(cleaned);
//     });
//     if (invalidPhone) {
//       alert("Please enter valid phone numbers: 10 digits starting with 6-9.");
//       return;
//     }

//     const cleanedEmails = emails.filter((e) => e.trim() !== "");
//     const cleanedPhones = phones.filter((p) => p.trim() !== "");

//     const updatedContact = {
//       firstName,
//       lastName,
//       emails: cleanedEmails,
//       phones: cleanedPhones,
//     };

//     setLoading(true);
//     try {
//       await axios.put(`${API_URL}/${contactToEdit._id}`, updatedContact, config);
//       alert("Contact updated successfully!");
//       navigate("/contact");
//     } catch (err) {
//       console.error(err);
//       alert("Error updating contact!");
//     }
//     setLoading(false);
//   };

//   // Delete contact
//   const handleDelete = async () => {
//     if (window.confirm("Are you sure you want to delete this contact?")) {
//       try {
//         await axios.delete(`${API_URL}/${contactToEdit._id}`, config);
//         alert("Contact deleted successfully!");
//         navigate("/contact");
//       } catch (err) {
//         console.error(err);
//         alert("Error deleting contact!");
//       }
//     }
//   };

//   return (
//     <div className="edit-container">
//       <div className="edit-card">
//         <h2>Edit Contact</h2>

//         <div className="form-group">
//           <label>First Name</label>
//           <input
//             type="text"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//           />
//         </div>

//         <div className="form-group">
//           <label>Last Name</label>
//           <input
//             type="text"
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//           />
//         </div>

//         <div className="form-group">
//           <label>Email</label>
//           {emails.map((email, i) => (
//             <input
//               key={i}
//               type="email"
//               value={email}
//               onChange={(e) => handleEmailChange(i, e.target.value)}
//             />
//           ))}
//           <button type="button" onClick={addEmailField}>
//             + Add Email
//           </button>
//         </div>

//         <div className="form-group">
//           <label>Phone</label>
//           {phones.map((phone, i) => (
//             <PhoneInput
//               key={i}
//               country="in"
//               value={phone}
//               onChange={(value) => handlePhoneChange(i, value)}
//               enableSearch={true}
//               countryCodeEditable={true}
//               disableCountryCode={false}
//               inputProps={{ name: "phone", required: true, autoFocus: i === 0 }}
//               containerClass="phone-container"
//               inputClass="phone-input"
//             />
//           ))}
//           <button type="button" onClick={addPhoneField}>
//             + Add Phone
//           </button>
//         </div>

//         <div className="button-group">
//           <button
//             type="button"
//             onClick={handleSave}
//             style={{ backgroundColor: "green", color: "white" }}
//             disabled={loading}
//           >
//             {loading ? "Saving..." : "Save"}
//           </button>
//           <button
//             type="button"
//             onClick={handleDelete}
//             style={{ backgroundColor: "red", color: "white", marginLeft: "10px" }}
//             disabled={loading}
//           >
//             Delete
//           </button>
//           <button
//             type="button"
//             onClick={() => navigate("/contact")}
//             style={{ backgroundColor: "gray", color: "white", marginLeft: "10px" }}
//             disabled={loading}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditContact;


// import React, { useState, useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";
// import PhoneInput from "react-phone-input-2";
// import "react-phone-input-2/lib/style.css";
// import axios from "axios";
// import "./EditContact.css";

// const API_URL = "https://crud-backend-sx8n.onrender.com/api/contacts";

// const EditContact = ({ onUpdate }) => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { contactToEdit } = location.state || {};

//   const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
//   const token = localStorage.getItem("token");
//   const config = { headers: { Authorization: `Bearer ${token}` } };

//   const [firstName, setFirstName] = useState(contactToEdit?.firstName || "");
//   const [lastName, setLastName] = useState(contactToEdit?.lastName || "");
//   const [emails, setEmails] = useState(contactToEdit?.emails || [""]);
//   const [phones, setPhones] = useState(contactToEdit?.phones || [""]);
//   const [loading, setLoading] = useState(false);

//   // Redirect if invalid contact or unauthorized
//   useEffect(() => {
//     if (!contactToEdit?._id) {
//       alert("No contact selected.");
//       navigate("/contact");
//     } else if (
//       loggedInUser?.role !== "admin" &&
//       String(contactToEdit?.userId) !== String(loggedInUser?.id)
//     ) {
//       alert("You are not allowed to edit this contact.");
//       navigate("/contact");
//     }
//   }, [contactToEdit, navigate, loggedInUser]);

//   // Email handlers
//   const handleEmailChange = (i, value) => {
//     const updated = [...emails];
//     updated[i] = value;
//     setEmails(updated);
//   };
//   const addEmailField = () => setEmails([...emails, ""]);

//   // Phone handlers
//   const handlePhoneChange = (i, value) => {
//     const updated = [...phones];
//     updated[i] = value;
//     setPhones(updated);
//   };
//   const addPhoneField = () => setPhones([...phones, ""]);

//   // Save contact
//   const handleSave = async () => {
//     const invalidPhone = phones.some((p) => {
//       const cleaned = p.replace(/\D/g, "");
//       return cleaned.length !== 10 || !/^[6-9]/.test(cleaned);
//     });
//     if (invalidPhone) {
//       alert("Please enter valid phone numbers: 10 digits starting with 6-9.");
//       return;
//     }

//     const cleanedEmails = emails.filter((e) => e.trim() !== "");
//     const cleanedPhones = phones.filter((p) => p.trim() !== "");

//     const updatedContact = {
//       firstName,
//       lastName,
//       emails: cleanedEmails,
//       phones: cleanedPhones,
//       userId: contactToEdit.userId, // preserve ownership
//     };

//     setLoading(true);
//     try {
//       const res = await axios.put(
//         `${API_URL}/${contactToEdit._id}`,
//         updatedContact,
//         config
//       );

//       alert("Contact updated successfully!");
//       // Update parent state if callback provided
//       if (onUpdate) onUpdate(res.data);

//       navigate("/contact", { replace: true });
//     } catch (err) {
//       console.error(err);
//       alert("Error updating contact!");
//     }
//     setLoading(false);
//   };

//   // Delete contact
//   const handleDelete = async () => {
//     if (window.confirm("Are you sure you want to delete this contact?")) {
//       try {
//         await axios.delete(`${API_URL}/${contactToEdit._id}`, config);
//         alert("Contact deleted successfully!");
//         if (onUpdate) onUpdate(null, contactToEdit._id); // notify parent to remove
//         navigate("/contact", { replace: true });
//       } catch (err) {
//         console.error(err);
//         alert("Error deleting contact!");
//       }
//     }
//   };

//   return (
//     <div className="edit-container">
//       <div className="edit-card">
//         <h2>Edit Contact</h2>

//         <div className="form-group">
//           <label>First Name</label>
//           <input
//             type="text"
//             value={firstName}
//             onChange={(e) => setFirstName(e.target.value)}
//             required
//           />
//         </div>

//         <div className="form-group">
//           <label>Last Name</label>
//           <input
//             type="text"
//             value={lastName}
//             onChange={(e) => setLastName(e.target.value)}
//           />
//         </div>

//         <div className="form-group">
//           <label>Email</label>
//           {emails.map((email, i) => (
//             <input
//               key={i}
//               type="email"
//               value={email}
//               onChange={(e) => handleEmailChange(i, e.target.value)}
//             />
//           ))}
//           <button type="button" onClick={addEmailField}>
//             + Add Email
//           </button>
//         </div>

//         <div className="form-group">
//           <label>Phone</label>
//           {phones.map((phone, i) => (
//             <PhoneInput
//               key={i}
//               country="in"
//               value={phone}
//               onChange={(value) => handlePhoneChange(i, value)}
//               enableSearch={true}
//               countryCodeEditable={true}
//               disableCountryCode={false}
//               inputProps={{ name: "phone", required: true, autoFocus: i === 0 }}
//               containerClass="phone-container"
//               inputClass="phone-input"
//             />
//           ))}
//           <button type="button" onClick={addPhoneField}>
//             + Add Phone
//           </button>
//         </div>

//         <div className="button-group">
//           <button
//             type="button"
//             onClick={handleSave}
//             style={{ backgroundColor: "green", color: "white" }}
//             disabled={loading}
//           >
//             {loading ? "Saving..." : "Save"}
//           </button>
//           <button
//             type="button"
//             onClick={handleDelete}
//             style={{ backgroundColor: "red", color: "white", marginLeft: "10px" }}
//             disabled={loading}
//           >
//             Delete
//           </button>
//           <button
//             type="button"
//             onClick={() => navigate("/contact")}
//             style={{ backgroundColor: "gray", color: "white", marginLeft: "10px" }}
//             disabled={loading}
//           >
//             Cancel
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default EditContact;
