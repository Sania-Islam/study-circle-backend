const CommunityMessage = require("../models/CommunityMessage");

// GET /api/community
const getCommunityMessages = async (req, res, next) => {
  try {
    const messages = await CommunityMessage.find().sort({ createdAt: 1 });
    res.json(messages);
  } catch (error) {
    next(error);
  }
};

// POST /api/community
// Body: { text }
const postCommunityMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const message = await CommunityMessage.create({
      username: req.user.username,
      role: req.user.role,
      text: text.trim().slice(0, 1000),
    });

    res.status(201).json(message);
  } catch (error) {
    next(error);
  }
};

// DELETE /api/community/:id  (admin only)
const deleteCommunityMessage = async (req, res, next) => {
  try {
    const message = await CommunityMessage.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: "Message not found" });
    res.json({ message: "Message deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCommunityMessages, postCommunityMessage, deleteCommunityMessage };
