const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { AssemblyAI } = require("assemblyai");
const auth = require("../middleware/auth");
const Transcription = require("../models/Transcription");

const router = express.Router();

// Configure multer for file storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = "uploads/";
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimes = ["audio/wav", "audio/mpeg", "audio/mp3", "audio/ogg", "audio/webm", "audio/mp4", "audio/x-m4a", "audio/aac"];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only audio files are allowed"));
    }
  },
});

const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });

// POST: Transcribe audio file
router.post("/", auth, upload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No audio file provided" });
    }

    const filePath = req.file.path;
    const fileName = req.file.originalname;

    // Read the audio file and transcribe using AssemblyAI
    const audioData = fs.readFileSync(filePath);
    
    const transcript = await client.transcripts.transcribe({
      audio: audioData,
    });

    if (transcript.status === "error") {
      fs.unlinkSync(filePath); // Clean up failed upload
      return res.status(400).json({ error: transcript.error });
    }

    // Save transcription to database
    const saved = await Transcription.create({
      userId: req.userId,
      audioPath: filePath,
      fileName: fileName,
      text: transcript.text || "",
      status: "completed",
    });

    res.json({ 
      id: saved._id,
      fileName: saved.fileName,
      text: saved.text,
      createdAt: saved.createdAt,
    });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path); // Clean up on error
    }
    res.status(500).json({ error: error.message || "Transcription failed" });
  }
});

// GET: Fetch all transcriptions for user
router.get("/", auth, async (req, res) => {
  try {
    const data = await Transcription.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE: Delete a transcription
router.delete("/:id", auth, async (req, res) => {
  try {
    const transcription = await Transcription.findById(req.params.id);
    
    if (!transcription) {
      return res.status(404).json({ error: "Transcription not found" });
    }

    if (transcription.userId.toString() !== req.userId.toString()) {
      return res.status(403).json({ error: "Not authorized" });
    }

    // Delete audio file if it exists
    if (transcription.audioPath && fs.existsSync(transcription.audioPath)) {
      fs.unlinkSync(transcription.audioPath);
    }

    await Transcription.findByIdAndDelete(req.params.id);
    res.json({ message: "Transcription deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;