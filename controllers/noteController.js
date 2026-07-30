const cloudinary = require("../config/cloudinary");
const Note = require("../models/Note");
const Course = require("../models/Course");
const { classifyFile, formatSize } = require("../middleware/upload");
const { recordUpload } = require("../utils/gamification");

const uploadNote = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: "Course not found" });
    if (!req.file) return res.status(400).json({ message: "No file was uploaded" });

    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { resource_type: "auto", folder: "studycircle-notes" },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(req.file.buffer);
    });

    const note = await Note.create({
      title: req.file.originalname,
      author: req.user.username,
      type: classifyFile(req.file.originalname),
      size: formatSize(req.file.size),
      fileUrl: uploadResult.secure_url,
      cloudinaryId: uploadResult.public_id,
      course: course._id,
    });

    const updatedUser = await recordUpload(req.user.username, 1);
    res.status(201).json({ note, streak: updatedUser?.currentStreak, notesUploaded: updatedUser?.notesUploaded });
  } catch (error) {
    next(error);
  }
};

const getNotesForCourse = async (req, res, next) => {
  try {
    const notes = await Note.find({ course: req.params.id }).sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    next(error);
  }
};

const downloadNote = async (req, res, next) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    res.redirect(note.fileUrl);
  } catch (error) {
    next(error);
  }
};

module.exports = { uploadNote, getNotesForCourse, downloadNote };
