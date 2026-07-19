const User = require("../models/User");

// GET /api/admin/users  (all students, so admin panel can show pending/approved/rejected)
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ requestedAt: -1 });
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/users/:username/approve
const approveUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username.toLowerCase() },
      { status: "approved" },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// POST /api/admin/users/:username/reject
const rejectUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username.toLowerCase() },
      { status: "rejected" },
      { new: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/admin/users/:username  (matches removeUser() - fully deletes them)
const removeUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndDelete({ username: req.params.username.toLowerCase() });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User removed" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, approveUser, rejectUser, removeUser };
