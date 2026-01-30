const mongoose = require("mongoose");

const transcriptionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    audioPath: String,
    fileName: String,
    text: { type: String, required: true },
    duration: Number,
    status: { type: String, enum: ["pending", "completed", "failed"], default: "completed" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transcription", transcriptionSchema);