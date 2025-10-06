import express from "express";
import multer from "multer";
import {db} from "../config/db.js"; // Your MySQL connection

const router = express.Router();

// Multer config for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// GET all events
router.get("/", (req, res) => {
  const query = "SELECT * FROM events ORDER BY created_at DESC";
  db.query(query, (err, results) => {
    if (err) {
      console.error("❌ Error fetching events:", err);
      return res.status(500).json({ message: "Database error", error: err });
    }
    res.json(results);
  });
});
// CREATE event
router.post("/", upload.single("image"), (req, res) => {
  const { title, description, startDate, endDate, college, category } = req.body;
  const image = req.file ? req.file.filename : null;
  const status = "upcoming";

  const query = `INSERT INTO events (title, description, startDate, endDate, college, category, image, status)
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
  db.query(query, [title, description, startDate, endDate, college, category, image, status], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Event created successfully", id: result.insertId });
  });
});

// UPDATE event status
router.patch("/:id/status", (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.query("UPDATE events SET status = ? WHERE id = ?", [status, id], (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Status updated successfully" });
  });
});

export default router;
