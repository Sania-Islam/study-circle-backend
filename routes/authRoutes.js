const express = require("express");
const { signup, studentLogin, adminLogin, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", studentLogin);
router.post("/admin-login", adminLogin);
router.get("/me", protect, getMe);

module.exports = router;
