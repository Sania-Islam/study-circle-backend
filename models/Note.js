const mongoose = require("mongoose");
const noteSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    type: { type: String, enum: ["PDF", "DOCX", "IMG", "FILE"], default: "FILE" },
    size: { type: String, required: true },
    fileUrl: { type: String, required: true },
    cloudinaryId: { type: String, required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Note", noteSchema);
