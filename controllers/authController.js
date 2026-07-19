const jwt = require("jsonwebtoken");
const User = require("../models/User");

const generateToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// The 2 fixed admin accounts, read from .env (matches your frontend's ADMINS/ADMIN_CREDENTIALS)
const ADMINS = [
  { username: process.env.ADMIN1_USERNAME, password: process.env.ADMIN1_PASSWORD },
  { username: process.env.ADMIN2_USERNAME, password: process.env.ADMIN2_PASSWORD },
];

// POST /api/auth/signup  (student)
// Body: { email, studentId, username }
const signup = async (req, res, next) => {
  try {
    const { email, studentId, username } = req.body;

    if (!email || !studentId || !username) {
      return res.status(400).json({ message: "Email, student ID, and username are required" });
    }

    const existing = await User.findOne({ username: username.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: "That username is already taken" });
    }

    const user = await User.create({
      email,
      studentId,
      username: username.toLowerCase(),
    });

    res.status(201).json({
      message: "Account request submitted. An admin needs to approve you before you can sign in.",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login  (student - matches signInStudent(username), no password)
// Body: { username }
const studentLogin = async (req, res, next) => {
  try {
    const { username } = req.body;
    if (!username) {
      return res.status(400).json({ message: "Username is required" });
    }

    const user = await User.findOne({ username: username.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "No account found with that username" });
    }

    if (user.status === "pending") {
      return res.status(403).json({ message: "Your account is still pending admin approval", status: "pending" });
    }
    if (user.status === "rejected") {
      return res.status(403).json({ message: "Your account request was rejected", status: "rejected" });
    }

    const token = generateToken({ username: user.username, role: "student" });
    res.json({ token, user });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/admin-login
// Body: { username, password }
const adminLogin = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
    }

    const match = ADMINS.find(
      (a) => a.username?.toLowerCase() === username.toLowerCase() && a.password === password
    );

    if (!match) {
      return res.status(401).json({ message: "Invalid admin username or password" });
    }

    const token = generateToken({ username: match.username, role: "admin" });
    res.json({ token, username: match.username, role: "admin" });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/me
const getMe = async (req, res, next) => {
  try {
    if (req.user.role === "admin") {
      return res.json({ username: req.user.username, role: "admin" });
    }
    const user = await User.findOne({ username: req.user.username });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

module.exports = { signup, studentLogin, adminLogin, getMe };
