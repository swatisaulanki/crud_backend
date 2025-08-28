const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const contactRoutes = require("./routes/contactRoutes");
const connectDB = require("./config/db"); // assume you updated db.js as I suggested

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.get("/", (req, res) => {
  res.send(`<h1>🎉 Welcome to the gullysystem_pro backend API! 🚀</h1>`);
});

app.use("/api/contacts", contactRoutes);

// Start server after DB connection
const startServer = async () => {
  try {
    await connectDB(); // await DB connection first
    console.log("Connected to the DB ");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT} 🚀`);
    });
  } catch (err) {
    console.error("Error connecting to the DB ", err);
    process.exit(1);
  }
};

startServer();
