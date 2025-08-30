const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const { protect, adminOnly } = require("../middlewares/adminMiddleware");
const User = require("../models/User");

//public
router.post("/register", register);
router.post("/login", login);

// Admin only → Get all users
router.get("/all", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;
