const express = require("express");
const { getMessages, postMessage } = require("../controllers/groupController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.get("/courses/:courseId/groups/:groupId/messages", getMessages);
router.post("/courses/:courseId/groups/:groupId/messages", protect, postMessage);

module.exports = router;
