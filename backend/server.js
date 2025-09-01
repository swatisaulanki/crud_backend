// const express = require("express");
// const dotenv = require("dotenv");
// const cors = require("cors");
// const contactRoutes = require("./routes/contactRoutes");
// const connection = require("./config/db");
// const authRoutes = require("./routes/authRoutes")
// dotenv.config();

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());

// // Routes
// app.get("/", (req, res) => {
//   res.send(`<h1>🎉 Welcome to the gullysystem_pro backend API! 🚀</h1>`);
// });

// app.use("/api/contacts", contactRoutes);
// app.use("/api/auth",authRoutes);

// // Start server after DB connection



// app.listen(process.env.PORT, async()=>{

//     try{
//         await connection
//         console.log("connected to the DB")
//     }
//     catch(err){
//         console.log("error while connecting to the db",err)
//     }
// })




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
app.use(cors({
  origin: "http://localhost:3002", // frontend port
  credentials: true,              // if you're using cookies or auth headers
}));
app.use(express.json()); // Must be before routes

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

