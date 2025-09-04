
const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    firstName: { type: String, required: true },
    lastName: { type: String },
    emails: { type: [String], required: true },
    phones: { type: [String], required: true },
    company: { type: String },
    jobTitle: { type: String },
    address: { type: String },
    birthday: {
      day: Number,
      month: String,
      year: Number,
    },
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
