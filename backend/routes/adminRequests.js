// backend/routes/adminRequests.js
import express from "express";
import { db } from "../config/db.js";
import { requireRole } from "../middleware/roles.js"; // see next section
import { auth } from "../middleware/auth.js";


const router = express.Router();

// Create request (student applies to be college admin)
router.post("/", (req, res) => {
  const {user_id,college, message,requested_role} = req.body;
  if (!user_id) return res.status(400).json({ message: "user_id is required" });

  const sql = `INSERT INTO admin_requests (user_id,college,message,requested_role)
    VALUES (?, ?, ?,?)`;
 db.query(sql, [user_id,college, message,requested_role], (err, result) => {
    if (err) {
      console.error("DB error inserting admin request:", err);
      return res.status(500).json({ message: "Failed to create request" });
    }

    res.status(201).json({ message: "Admin request created successfully", id: result.insertId });
  });
});

// Superadmin: list requests
router.get("/", auth, requireRole("Super Admin"), (req, res) => {
  const sql = `
    SELECT ar.*, u.fullname, u.email
    FROM admin_requests ar
    JOIN users u ON ar.user_id = u.id
    where status='pending' 
    ORDER BY ar.created_at DESC
    
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("DB ERROR fetching requests:", err);
      return res.status(500).json({ message: "Failed to fetch requests" });
    }
    res.json(rows);
  });
});


// Approve request -> set users.role='admin', update request
router.put("/:id/approve",auth, requireRole("Super Admin"), (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ message: "id required" });

  // get request row to find user_id
  db.query("SELECT * FROM admin_requests WHERE id = ?", [id], (err, rows) => {
    if (err || !rows.length) return res.status(404).json({ message: "Request not found" });
    const reqRow = rows[0];
    const userId = reqRow.user_id;

    db.query(
      "UPDATE users SET role = 'College Admin' WHERE id = ?",
      [userId],
      (err2) => {
        if (err2) {
          console.error("DB ERROR updating user role:", err2);
          return res.status(500).json({ message: "Failed to update user role" });
        }
        db.query(
          "UPDATE admin_requests SET status='approved', handled_by=?, handled_at=NOW() WHERE id = ?",
          [req.user.id, id],
          (err3) => {
            if (err3) {
              console.error("DB ERROR updating request:", err3);
              return res.status(500).json({ message: "Failed to update request" });
            }
            res.json({ message: "Approved and role updated" });
          }
        );
      }
    );
  });
});

// Reject request
router.delete("/:id/reject", auth ,requireRole("Super Admin"), (req, res) => {
  const id = Number(req.params.id);
  if (!id) return res.status(400).json({ message: "id required" });

  db.query("UPDATE admin_requests SET status='rejected', handled_by=?, handled_at=NOW() WHERE id = ?", [req.user.id, id], (err) => {
    if (err) {
      console.error("DB ERROR rejecting request:", err);
      return res.status(500).json({ message: "Failed to reject request" });
    }
    res.json({ message: "Request rejected" });
  });
});


// Superadmin: AllAdminlist requests
router.get("/all", auth, requireRole("Super Admin"), (req, res) => {
  const sql = `
    SELECT ar.*, u.fullname, u.email
    FROM admin_requests ar
    JOIN users u ON ar.user_id = u.id 
    ORDER BY ar.created_at DESC
    
  `;
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("DB ERROR fetching requests:", err);
      return res.status(500).json({ message: "Failed to fetch requests" });
    }
    res.json(rows);
  });
});


export default router;
