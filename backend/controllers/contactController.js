const Contact = require("../models/Contact");
const validatePhone = require("../utils/validatePhone");
const validateEmail = require("../utils/validateEmail");

// Create new contact
exports.createContact = async (req, res) => {
  try {
    let { firstName, lastName, emails, phones } = req.body;

    // Ensure emails and phones are arrays
    if (!Array.isArray(emails)) emails = [emails];
    if (!Array.isArray(phones)) phones = [phones];

    // Validate phones
    for (let phone of phones) {
      if (!validatePhone(phone)) {
        return res.status(400).json({ message: `Invalid phone: ${phone}` });
      }
    }

    // Validate emails
    for (let email of emails) {
      if (!validateEmail(email)) {
        return res.status(400).json({ message: `Invalid email: ${email}` });
      }
    }

    const contact = await Contact.create({ ...req.body, emails, phones });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all contacts
exports.getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get single contact
exports.getContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update contact
exports.updateContact = async (req, res) => {
  try {
    const updates = req.body;

    // Validate phones if provided
    if (updates.phones) {
      if (!Array.isArray(updates.phones)) updates.phones = [updates.phones];
      for (let phone of updates.phones) {
        if (!validatePhone(phone)) {
          return res.status(400).json({ message: `Invalid phone: ${phone}` });
        }
      }
    }

    // Validate emails if provided
    if (updates.emails) {
      if (!Array.isArray(updates.emails)) updates.emails = [updates.emails];
      for (let email of updates.emails) {
        if (!validateEmail(email)) {
          return res.status(400).json({ message: `Invalid email: ${email}` });
        }
      }
    }

    // Update contact
    const contact = await Contact.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true }
    );

    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete contact
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findByIdAndDelete(req.params.id);
    if (!contact) return res.status(404).json({ message: "Contact not found" });
    res.json({ message: "Contact deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
