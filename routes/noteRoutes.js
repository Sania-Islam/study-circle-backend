const express = require("express");
const {
  uploadNote,
  getNotesForCourse,
  downloadNote,
  deleteNote,
} = require("../controllers/noteController");
const { protect } = require("../middleware/auth");
const { upload } = require("../middleware/upload");
const router = express.Router();
router.get("/courses/:id/notes", getNotesForCourse);
router.post("/courses/:id/notes", protect, upload.single("file"), uploadNote);
router.get("/notes/:id/download", downloadNote);
router.delete("/notes/:id", protect, deleteNote);
module.exports = router;
