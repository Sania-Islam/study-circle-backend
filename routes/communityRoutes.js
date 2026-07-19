const express = require("express");
const {
  getCommunityMessages,
  postCommunityMessage,
  deleteCommunityMessage,
} = require("../controllers/communityController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.get("/", getCommunityMessages);
router.post("/", protect, postCommunityMessage);
router.delete("/:id", protect, adminOnly, deleteCommunityMessage);

module.exports = router;
