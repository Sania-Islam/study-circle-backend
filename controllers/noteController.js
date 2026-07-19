const path = require("path");
const Note = require("../models/Note");
const Course = require("../models/Course");
const { classifyFile, formatSize } = require("../middleware/upload");
const { recordUpload } = require("../utils/gamification");

// POST /api/courses/:id/notes  (multipart/form-data, field name "file")
const uploadNote = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });

    if (!req.file) {
      return res.status(400).json({ message: "No file was uploaded" });
    }

    const note = await Note.create({
      title: req.file.originalname,
      author: req.user.username,
      type: classifyFile(req.file.originalname),
      size: formatSize(req.file.size),
      filePath: req.file.filename, // stored name on disk
      course: course._id,
    });

    const updatedUser = await recordUpload(req.user.username, 1);

    res.status(201).json({ note, streak: updatedUser?.currentStreak, notesUploaded: updatedUser?.notesUploaded });
  } catch (error) {
    next(error);
  }
};

// GET /api/courses/:id/notes
const getNotesForCourse = async (req, res, next) => {
  try {
    const notes = await Note.find({ course: req.params.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

// GET /api/notes/:id/download
const downloadNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });

    const filePath = path.join(__dirname, "..", "uploads", note.filePath);
    res.download(filePath, note.title);
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadNote, getNotesForCourse, downloadNote };
