const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const contactRoutes = require("./routes/contactRoutes");
const connection = require("./config/db");

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



app.listen(process.env.PORT, async()=>{

    try{
        await connection
        console.log("connected to the DB")
    }
    catch(err){
        console.log("error while connecting to the db",err)
    }
})