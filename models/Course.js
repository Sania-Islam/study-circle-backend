const mongoose = require("mongoose");

// A single chat message inside a study group
const messageSchema = new mongoose.Schema(
  {
    username: { type: String, required: true }, // who sent it
    text: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
);

// A study group that belongs to one course (matches the "groups" array
// on each course in your data.js)
const groupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  initials: { type: String, required: true },
  members: [{ type: String }], // usernames
  messages: [messageSchema],
});

// A course belongs to exactly one batch (e.g. "DSA" in "Batch 58")
const courseSchema = new mongoose.Schema({
  key: { type: String, required: true }, // e.g. "dsa"
  name: { type: String, required: true }, // e.g. "Data Structures & Algorithms"
  batchNumber: { type: Number, required: true },
  groups: [groupSchema],
});

module.exports = mongoose.model("Course", courseSchema);
