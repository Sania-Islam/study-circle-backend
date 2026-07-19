const express = require("express");
const { getBatches, getCoursesForBatch } = require("../controllers/batchController");
const { getCourseById } = require("../controllers/courseController");

const router = express.Router();

router.get("/batches", getBatches);
router.get("/batches/:number/courses", getCoursesForBatch);
router.get("/courses/:id", getCourseById);

module.exports = router;
