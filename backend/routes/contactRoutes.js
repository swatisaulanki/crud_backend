// const express = require("express");
// const router = express.Router();
// const {
//   createContact,
//   getContacts,
//   getContact,
//   updateContact,
//   deleteContact,
// } = require("../controllers/contactController");

// // CRUD routes
// router.post("/", createContact);
// router.get("/", getContacts);
// router.get("/:id", getContact);
// router.put("/:id", updateContact);
// router.delete("/:id", deleteContact);

// module.exports = router;





// const express = require("express");
// const router = express.Router();

// const {
//   createContact,
//   getContacts,
//   getContact,
//   updateContact,
//   deleteContact,
// } = require("../controllers/contactController");

// const { protect } = require("../middlewares/authMiddleware");
// const { admin } = require("../middlewares/roleMiddleware"); // optional

// // All routes protected by JWT
// router.post("/", protect, createContact);         // create contact
// router.get("/", protect, getContacts);           // get own contacts (or all if admin)
// router.get("/:id", protect, getContact);         // get single contact (owner or admin)
// router.put("/:id", protect, updateContact);      // update contact (owner or admin)
// router.delete("/:id", protect, deleteContact);   // delete contact (owner or admin)

// // Optional admin-only route
// // router.get("/all", protect, admin, getContacts); // admin sees all contacts

// module.exports = router;


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

router.post("/", protect, createContact);
router.get("/", protect, getContacts);
router.get("/:id", protect, getContact);
router.put("/:id", protect, updateContact);
router.delete("/:id", protect, deleteContact);

module.exports = router;
