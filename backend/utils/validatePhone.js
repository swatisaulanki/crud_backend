// utils/validatePhone.js
const validatePhone = (phone) => {
  const digits = phone.replace(/\D/g, ""); // remove non-digits
  return digits.length >= 10; // valid if 10+ digits
};

module.exports = validatePhone;
