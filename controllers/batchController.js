const Batch = require("../models/Batch");
const Course = require("../models/Course");

// GET /api/batches
const getBatches = async (req, res, next) => {
  try {
    const batches = await Batch.find().sort({ number: 1 });
    res.json(batches);
  } catch (error) {
    next(error);
  }
};

// GET /api/batches/:number/courses  (sidebar list - lightweight, no notes/messages)
const getCoursesForBatch = async (req, res, next) => {
  try {
    const courses = await Course.find({ batchNumber: Number(req.params.number) }).select(
      "key name batchNumber"
    );
    res.json(courses);
  } catch (error) {
    next(error);
  }
};

module.exports = { getBatches, getCoursesForBatch };
