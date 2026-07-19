const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // original file name
    author: { type: String, required: true }, // uploader's username
    type: { type: String, enum: ["PDF", "DOCX", "IMG", "FILE"], default: "FILE" },
    size: { type: String, required: true }, // human-readable, e.g. "1.2 MB"
    filePath: { type: String, required: true }, // where it's stored on disk
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
