const express = require("express");
const jwt = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");
const Transcript = require("../models/Transcript");
const { AssemblyAI } = require("assemblyai");

const router = express.Router();

// Middleware to verify JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};

const client = new AssemblyAI({
  apiKey: process.env.ASSEMBLYAI_API_KEY,
});

// Upload and transcribe audio
router.post("/upload", verifyToken, async (req, res) => {
  try {
    const { audio, title } = req.body;

    if (!audio) {
      return res.status(400).json({ error: "No audio data provided" });
    }

    // Convert base64 to buffer
    const base64Payload = audio.split(",")[1];
    if (!base64Payload) {
      return res.status(400).json({ error: "Invalid audio payload" });
    }
    
    // Detect audio format from base64 header
    const mimeMatch = audio.match(/^data:(audio\/[^;]+);base64,/);
    let extension = "wav"; // default
    if (mimeMatch) {
      const mimeType = mimeMatch[1];
      const formatMap = {
        "audio/wav": "wav",
        "audio/wave": "wav",
        "audio/x-wav": "wav",
        "audio/mp3": "mp3",
        "audio/mpeg": "mp3",
        "audio/mp4": "m4a",
        "audio/x-m4a": "m4a",
        "audio/m4a": "m4a",
        "audio/aac": "aac",
        "audio/ogg": "ogg",
        "audio/webm": "webm",
        "audio/flac": "flac",
        "video/mp4": "mp4",
        "video/webm": "webm",
      };
      extension = formatMap[mimeType] || mimeType.split("/")[1] || "wav";
    }
    
    const audioBuffer = Buffer.from(base64Payload, "base64");
    const filename = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}.${extension}`;
    const filepath = path.join(__dirname, "../uploads", filename);

    // Save audio file
    fs.writeFileSync(filepath, audioBuffer);

    // Create transcript record
    const transcript = new Transcript({
      userId: req.userId,
      title: title || "Untitled Transcript",
      audioUrl: `/uploads/${filename}`,
      status: "processing",
    });

    await transcript.save();

    // Transcribe audio asynchronously
    transcribeAudio(filepath, transcript._id).catch(console.error);

    res.json({
      message: "Transcription started",
      transcriptId: transcript._id,
      status: "processing",
    });
  } catch (error) {
    console.error("Upload error:", error.message);
    res.status(500).json({ error: error.message });
  }
});

// Transcribe audio using AssemblyAI
async function transcribeAudio(filepath, transcriptId) {
  try {
    const uploadUrl = await client.files.upload(fs.createReadStream(filepath));

    const transcript = await client.transcripts.transcribe({
      audio_url: uploadUrl,
    });

    // Update transcript record with results
    await Transcript.findByIdAndUpdate(transcriptId, {
      text: transcript.text,
      status: transcript.status === "completed" ? "completed" : "failed",
      confidence: transcript.confidence,
    });
  } catch (error) {
    console.error("Transcription error:", error.message);
    await Transcript.findByIdAndUpdate(transcriptId, {
      status: "failed",
    });
  }
}

// Get user's transcripts
router.get("/list", verifyToken, async (req, res) => {
  try {
    const transcripts = await Transcript.find({ userId: req.userId }).sort({
      createdAt: -1,
    });
    res.json(transcripts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single transcript
router.get("/:id", verifyToken, async (req, res) => {
  try {
    const transcript = await Transcript.findById(req.params.id);

    if (!transcript) {
      return res.status(404).json({ error: "Transcript not found" });
    }

    if (transcript.userId.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.json(transcript);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete transcript
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const transcript = await Transcript.findById(req.params.id);

    if (!transcript) {
      return res.status(404).json({ error: "Transcript not found" });
    }

    if (transcript.userId.toString() !== req.userId) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Delete audio file
    const filepath = path.join(__dirname, "../" + transcript.audioUrl);
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath);
    }

    await Transcript.findByIdAndDelete(req.params.id);
    res.json({ message: "Transcript deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
