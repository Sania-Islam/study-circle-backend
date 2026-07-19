const User = require("../models/User");

// GET /api/leaderboard  (matches getLeaderboard())
const getLeaderboard = async (req, res, next) => {
  try {
    const users = await User.find({ role: "student", status: "approved" })
      .select("username notesUploaded currentStreak longestStreak lastUploadDate")
      .sort({ notesUploaded: -1, longestStreak: -1 });

    res.json(users);
  } catch (error) {
    next(error);
  }
};

module.exports = { getLeaderboard };
