const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Verifies the JWT and attaches { username, role } to req.user.
// Works for both students and admins (the token payload tells us which).
const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.role === "admin") {
      req.user = { username: decoded.username, role: "admin" };
      return next();
    }

    // Student: re-check they still exist and are still approved,
    // in case they were removed/rejected after the token was issued.
    const user = await User.findOne({ username: decoded.username });
    if (!user) {
      return res.status(401).json({ message: "This account no longer exists" });
    }
    if (user.status !== "approved") {
      return res.status(403).json({ message: "Your account is not approved yet" });
    }

    req.user = { username: user.username, role: "student" };
    next();
  } catch (error) {
    return res.status(401).json({ message: "Not authorized, invalid or expired token" });
  }
};

// Use after "protect" to restrict a route to admins only
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access only" });
  }
  next();
};

module.exports = { protect, adminOnly };
