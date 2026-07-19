const User = require("../models/User");

function localDateString(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
}

function daysBetween(a, b) {
  return Math.round((new Date(b + "T00:00:00") - new Date(a + "T00:00:00")) / 86400000);
}

// Call this whenever a student uploads note(s). Mirrors your frontend's
// recordUpload(username, fileCount) exactly (streak logic included).
async function recordUpload(username, fileCount = 1) {
  const user = await User.findOne({ username });
  if (!user) return null;

  user.notesUploaded = (user.notesUploaded || 0) + fileCount;
  const today = localDateString(new Date());

  if (!user.lastUploadDate) {
    user.currentStreak = 1;
  } else {
    const gap = daysBetween(user.lastUploadDate, today);
    if (gap === 1) user.currentStreak = (user.currentStreak || 0) + 1;
    else if (gap > 1) user.currentStreak = 1;
    // gap === 0 (same day): no change
  }

  user.lastUploadDate = today;
  user.longestStreak = Math.max(user.longestStreak || 0, user.currentStreak);
  await user.save();
  return user;
}

module.exports = { recordUpload };
