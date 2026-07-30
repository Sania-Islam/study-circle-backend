const multer = require("multer");

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 MB max per file
});

function classifyFile(originalName) {
  const ext = (originalName.split(".").pop() || "").toLowerCase();
  if (ext === "pdf") return "PDF";
  if (["doc", "docx", "txt"].includes(ext)) return "DOCX";
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(ext)) return "IMG";
  return "FILE";
}

function formatSize(bytes) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

module.exports = { upload, classifyFile, formatSize };
