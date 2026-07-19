require("dotenv").config();
const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const batchRoutes = require("./routes/batchRoutes");
const noteRoutes = require("./routes/noteRoutes");
const groupRoutes = require("./routes/groupRoutes");
const communityRoutes = require("./routes/communityRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Study Circle API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api", batchRoutes); // /api/batches, /api/batches/:number/courses, /api/courses/:id
app.use("/api", noteRoutes); // /api/courses/:id/notes, /api/notes/:id/download
app.use("/api", groupRoutes); // /api/courses/:courseId/groups/:groupId/messages
app.use("/api/community", communityRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

// "0.0.0.0" lets other devices on the same WiFi reach this server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Study Circle API running on port ${PORT}`);
});
