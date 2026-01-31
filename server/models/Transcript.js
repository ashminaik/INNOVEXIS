const mongoose = require("mongoose");

const transcriptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled Transcript",
    },
    audioUrl: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      default: "",
    },
    duration: {
      type: Number,
    },
    language: {
      type: String,
      default: "en",
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed"],
      default: "pending",
    },
    confidence: {
      type: Number,
      min: 0,
      max: 1,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transcript", transcriptSchema);
