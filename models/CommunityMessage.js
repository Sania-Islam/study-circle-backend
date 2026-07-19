const mongoose = require("mongoose");

const communityMessageSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    role: { type: String, enum: ["student", "admin"], required: true },
    text: { type: String, required: true, maxlength: 1000 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CommunityMessage", communityMessageSchema);
