const mongoose = require("mongoose");

// This matches your frontend's users.js: students sign up with
// email + studentId + username, and start as "pending" until an
// admin approves them. There is intentionally no password for
// students here, matching your current prototype's behavior.
//
// NOTE: this means anyone who knows a username can "log in" as them.
// That's fine for a class project, but if you ever want real security,
// add a password field + bcrypt hashing later - just ask.
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, trim: true, lowercase: true },
    studentId: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    role: { type: String, enum: ["student"], default: "student" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    requestedAt: { type: Date, default: Date.now },

    // Gamification (matches getLeaderboard() / recordUpload() in your frontend)
    notesUploaded: { type: Number, default: 0 },
    currentStreak: { type: Number, default: 0 },
    longestStreak: { type: Number, default: 0 },
    lastUploadDate: { type: String, default: null }, // "YYYY-MM-DD" local date string
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
