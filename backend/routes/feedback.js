import express from "express";
import { db } from "../config/db.js";

const router = express.Router();

// 📍 Student submits feedback
// POST /api/feedback
router.post("/", (req, res) => {
  const { student_id, event_id, rating, feedback } = req.body;

  if (!student_id || !rating || !feedback) {
    return res.status(400).json({ message: "student_id, rating and feedback are required" });
  }

  const sql = `INSERT INTO feedback (student_id, event_id, rating, feedback)
               VALUES (?, ?, ?, ?)`;

  db.query(sql, [student_id, event_id || null, rating, feedback], (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);

      // Duplicate (unique index on student_id+event_id) => return friendly message
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ message: "You have already submitted feedback for this event." });
      }

      // Other DB errors
      return res.status(500).json({ message: "Failed to submit feedback", error: err.message });
    }

    res.status(201).json({ message: "Feedback submitted successfully!" });
  });
});


router.get("/", (req, res) => {
  const sql = `
    SELECT f.id, f.student_id, f.event_id, f.rating, f.feedback,f.created_at,
           u.fullname AS student_name, u.email AS student_email,
           e.title AS event_title
    FROM feedback f
    JOIN users u ON f.student_id = u.id
    JOIN events e ON f.event_id = e.id
    ORDER BY f.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error("💥 Error fetching feedback:", err); // <-- logs the real error
      return res.status(500).json({ message: "Failed to fetch feedbacks", error: err }); // send error for debugging
    }
    res.json(results);
  });
});


// 📍 Delete feedback (admin)
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM feedback WHERE id = ?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to delete feedback" });
    res.json({ message: "Feedback deleted successfully" });
  });
});

// 📍 Get aggregated stats for admin dashboard
router.get("/stats", (req, res) => {
  const sqlCounts = `SELECT rating, COUNT(*) AS count FROM feedback GROUP BY rating`;
  const sqlAvg = `SELECT AVG(rating) AS avgRating, COUNT(*) AS total FROM feedback`;

  db.query(sqlCounts, (err, countRows) => {
    if (err) return res.status(500).json({ message: "Failed to get stats" });

    db.query(sqlAvg, (err2, avgRows) => {
      if (err2) return res.status(500).json({ message: "Failed to get stats" });

      const counts = { 1:0, 2:0, 3:0, 4:0, 5:0 };
      countRows.forEach(row => counts[row.rating] = row.count);

      const avgRating = avgRows[0]?.avgRating ? Number(avgRows[0].avgRating).toFixed(2) : 0;
      const total = avgRows[0]?.total || 0;

      res.json({ counts, avgRating, total });
    });
  });
});

// GET /api/feedback/student/:id
router.get("/student/:id", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT id, student_id, event_id, rating, feedback, created_at
               FROM feedback
               WHERE student_id = ?
               ORDER BY created_at DESC`;
  db.query(sql, [id], (err, rows) => {
    if (err) {
      console.error("DB ERROR fetching student feedbacks:", err);
      return res.status(500).json({ message: "Failed to fetch student feedbacks", error: err.message });
    }
    res.json(rows);
  });
});


export default router;
  