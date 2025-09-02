
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Auth.css";

const Register = () => {
  const [name, setName] = useState("");  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      // Call backend API
      const { data } = await axios.post("https://crud-backend-sx8n.onrender.com/api/auth/register", {
        name,
        email,
        password,
      });

      // Save token & user in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("loggedInUser", JSON.stringify(data.user));

      setMessage("Account created successfully!");

      setTimeout(() => {
        navigate("/login"); // Redirect to home
      }, 2000);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      {message && <p className="message">{message}</p>}

      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

