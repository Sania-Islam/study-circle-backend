const express = require("express");
const {
  getAllUsers,
  approveUser,
  rejectUser,
  removeUser,
} = require("../controllers/adminController");
const { protect, adminOnly } = require("../middleware/auth");

const router = express.Router();

router.use(protect, adminOnly); // every route below requires an admin token

router.get("/users", getAllUsers);
router.post("/users/:username/approve", approveUser);
router.post("/users/:username/reject", rejectUser);
router.delete("/users/:username", removeUser);

module.exports = router;
