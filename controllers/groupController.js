const Course = require("../models/Course");

// GET /api/courses/:courseId/groups/:groupId/messages
const getMessages = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const group = course.groups.id(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    res.json(group.messages);
  } catch (error) {
    next(error);
  }
};

// POST /api/courses/:courseId/groups/:groupId/messages
// Body: { text }
const postMessage = async (req, res, next) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message text is required" });
    }

    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const group = course.groups.id(req.params.groupId);
    if (!group) return res.status(404).json({ message: "Group not found" });

    group.messages.push({ username: req.user.username, text: text.trim() });
    await course.save();

    res.status(201).json(group.messages[group.messages.length - 1]);
  } catch (error) {
    next(error);
  }
};

module.exports = { getMessages, postMessage };
