

const express = require("express");
const router = express.Router();
const { protect } = require("../middlewares/authMiddleware");
const { admin } = require("../middlewares/roleMiddleware");

const {
  createContact,
  getContacts,
  getContact,
  updateContact,
  deleteContact,
} = require("../controllers/contactController");

// Create new contact (user must be logged in)
router.post("/", protect, createContact);

// Get contacts
// Admin → all contacts
// Normal user → only their own contacts
router.get("/", protect, getContacts);

// Get single contact (only if user owns it OR admin)
router.get("/:id", protect, getContact);

// Update contact (only owner or admin)
router.put("/:id", protect, updateContact);

// Delete contact (only owner or admin)
router.delete("/:id", protect, deleteContact);

module.exports = router;
