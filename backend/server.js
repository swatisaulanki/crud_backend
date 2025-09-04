
const express = require("express");
const cors = require("cors");
const connection = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const contactRoutes = require("./routes/contactRoutes");
const { configDotenv } = require("dotenv");

configDotenv()

const app = express();

// Middlewares
// app.use(cors());
app.use(
  cors({
    origin: [
      "http://localhost:3000",              
      "https://rbac-user-admin-mern-app.vercel.app", 
    ],
    credentials: true,
  })
);

app.use(express.json()); //before routes

// Root route
app.get("/", (req, res) => {
  res.send(`<h1>🎉 Welcome to the gullysystem_pro backend API! 🚀</h1>`);
});

// Routes
app.use("/api/auth", authRoutes);       // Auth routes first
app.use("/api/contacts", contactRoutes); // Contacts routes

// Start server after DB connection
const PORT = process.env.PORT || 6060;

connection
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error connecting to DB:", err);
  });

