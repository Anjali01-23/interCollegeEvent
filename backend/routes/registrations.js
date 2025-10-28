import express from "express";
import {db} from "../config/db.js"; // Your MySQL connection
import { Delete } from "lucide-react";
import { BiRegistered } from "react-icons/bi";
const router = express.Router();


// registrations.js (replace existing router.post("/") with this)
router.post("/", (req, res) => {
  const { student_id, event_id, name, college, age, gender, email, phone } = req.body;

  if (!student_id || (typeof event_id === "undefined" || event_id === null)) {
    return res.status(400).json({ message: "student_id and event_id are required" });
  }

  // 1) Check if already registered
  const checkSql = `SELECT id, status FROM registrations WHERE student_id = ? AND event_id = ? LIMIT 1`;
  db.query(checkSql, [student_id, event_id], (checkErr, checkRows) => {
    if (checkErr) {
      console.error("DB ERROR (check):", checkErr);
      return res.status(500).json({ message: "Server error" });
    }

    if (checkRows.length > 0) {
      // Already registered
      return res.status(400).json({ message: "You have already registered for this event", registration: checkRows[0] });
    }

    // 2) Insert new registration
    const sql = `
      INSERT INTO registrations (student_id, event_id, name, college, age, gender, email, phone, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')
    `;
    db.query(sql, [student_id, event_id, name, college, age, gender, email, phone], (err, result) => {
      if (err) {
        console.error("DB ERROR (insert):", err);
        // handle unique constraint fallback (race)
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({ message: "You have already registered for this event (duplicate detected)" });
        }
        return res.status(500).json({ message: "Failed to register", error: err });
      }
      return res.status(201).json({ message: "Registration request submitted successfully!", id: result.insertId });
    });
  });
});



// 📍 Get all registration requests (for admin)
router.get("/", (req, res) => {
  db.query("SELECT * FROM registrations ORDER BY created_at DESC", (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to fetch registrations" });
    }
    res.json(rows);
  });
});


// 📍 Approve or reject registration (admin action)
router.put("/:id", (req, res) => {
  const { status } = req.body; // expected: "accepted" or "rejected"
  const { id } = req.params;

  // Validate status
  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  const sql = "UPDATE registrations SET status = ? WHERE id = ?";

  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to update registration" });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Registration not found" });
    }

    res.json({ message: `Registration ${status} successfully` });
  });
});


// In your backend (registrations.js)
router.get("/accepted-participants", (req, res) => {
  const sql = `
    SELECT r.id, r.name, r.email, r.college, r.age, r.gender, r.phone, r.status,
           e.title AS event_name
    FROM registrations r
    JOIN events e ON r.event_id = e.id
    WHERE r.status = 'accepted'
    ORDER BY r.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ message: "Failed to fetch participants" });
    res.json(results);
  });
});


// 📍 Get all registrations for a specific student (returns event_id)
router.get("/student/:id", (req, res) => {
  const studentId = req.params.id;

  const sql = `
    SELECT r.id AS registration_id,
           r.event_id,
           r.status,
           r.created_at,
           e.title AS event_name,
           e.startDate
    FROM registrations r
    LEFT JOIN events e ON r.event_id = e.id
    WHERE r.student_id = ?
    ORDER BY r.created_at DESC
  `;

  db.query(sql, [studentId], (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Failed to fetch registrations", error: err });
    }
    res.json(results);
  });
});


router.delete("/:id",(req,res)=>{
  const { id } = req.params;
  const sql="Delete from registrations WHERE id=?";
  db.query(sql,[id],(err,result)=>{
    if (err) return res.status(500).json(err);
    res.json({ message: "Registration deleted successfully" });
  })
})
export default router;
