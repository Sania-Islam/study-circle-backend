const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true }, // e.g. 58
  name: { type: String, required: true }, // e.g. "Batch 58"
});

module.exports = mongoose.model("Batch", batchSchema);
