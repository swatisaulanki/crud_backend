
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; 
import "./Auth.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Call backend API
      const { data } = await axios.post("https://crud-backend-sx8n.onrender.com/api/auth/login", {
        email,
        password,
      });

      // Save token & user in localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("loggedInUser", JSON.stringify(data.user));

      setMessage("Login successful!");

      setTimeout(() => {
        navigate("/home"); // Redirect to home
      }, 2000);
    } catch (error) {
      console.error(error);
      setMessage(
        error.response?.data?.message || "Login failed. Please check your credentials."
      );
      setShowPopup(true);
    }
  };

  const handleForgotPassword = () => {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find((u) => u.email === forgotEmail);

    if (!user) {
      setMessage("Email not registered!");
      return;
    }

    const newPassword = prompt("Enter your new password:");
    if (newPassword) {
      user.password = newPassword;
      localStorage.setItem("users", JSON.stringify(users));
      setMessage("Password reset successful! You can now login");
      setShowForgot(false);
    }
  };

  return (
    <div className="auth-container">
      {message && <p style={{ color: "red" }}>{message}</p>}

      <h2>Login</h2>
      <form onSubmit={handleLogin}>
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

        <button type="submit">Login</button>
      </form>

      <p>
        <span className="link" onClick={() => setShowForgot(true)}>
          Forgot Password?
        </span>
      </p>

      <p>
        Don’t have an account?{" "}
        <span className="link" onClick={() => navigate("/register")}>
          Create Account
        </span>
      </p>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <p>Login failed! Please check your email and password.</p>
            <button onClick={() => setShowPopup(false)}>Close</button>
          </div>
        </div>
      )}

      {showForgot && (
        <div className="popup">
          <div className="popup-content">
            <h3>Reset Password</h3>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
            <button onClick={handleForgotPassword}>Reset Password</button>
            <button onClick={() => setShowForgot(false)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;

// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "./Auth.css";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [message, setMessage] = useState("");

//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       // ✅ Call backend API
//       const { data } = await axios.post(
//         "https://crud-backend-sx8n.onrender.com/api/auth/login",
//         { email, password }
//       );

//       // ✅ Save token & user in localStorage
//       localStorage.setItem("token", data.token);
//       localStorage.setItem("loggedInUser", JSON.stringify(data.user));

//       setMessage("✅ Login successful!");

//       // ✅ Redirect after short delay
//       setTimeout(() => {
//         navigate("/home");
//       }, 1000);
//     } catch (error) {
//       console.error(error);
//       setMessage(
//         error.response?.data?.message || "❌ Login failed. Please try again."
//       );
//     }
//   };

//   return (
//     <div className="auth-container">
//       <h2>Login</h2>

//       {/* ✅ Message on browser */}
//       {message && <p className="message">{message}</p>}

//       <form onSubmit={handleLogin}>
//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           required
//         />

//         <button type="submit">Login</button>
//       </form>

//       <p>
//         Don’t have an account?{" "}
//         <span className="link" onClick={() => navigate("/register")}>
//           Create Account
//         </span>
//       </p>
//     </div>
//   );
// };

// export default Login;
