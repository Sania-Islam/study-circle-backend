const Course = require("../models/Course");
const Note = require("../models/Note");

// GET /api/courses/:id  (full detail: groups+messages embedded, notes fetched separately)
const getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const notes = await Note.find({ course: course._id }).sort({ createdAt: -1 });

    res.json({
      _id: course._id,
      key: course.key,
      name: course.name,
      batchNumber: course.batchNumber,
      groups: course.groups,
      notes,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getCourseById };
