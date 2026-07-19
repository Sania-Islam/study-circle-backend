const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    // Prefix with a timestamp so two people uploading "notes.pdf" don't collide
    const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${unique}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max per file
});

// Classifies a file's type the same way your frontend's classifyFile() does
function classifyFile(originalName) {
  const ext = (originalName.split(".").pop() || "").toLowerCase();
  if (ext === "pdf") return "PDF";
  if (["doc", "docx", "txt"].includes(ext)) return "DOCX";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "IMG";
  return "FILE";
}

// Formats bytes the same way your frontend's formatSize() does
function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

module.exports = { upload, classifyFile, formatSize };
