import { db } from "../config/db.js";

export function findByEmail(email, callback) {
  db.query("SELECT * FROM users WHERE email = ?", [email], callback);
}

export function create(user, callback) {
  const { fullName, email, password, role, college } = user;
  db.query(
    "INSERT INTO users (fullName, email, password, role, college) VALUES (?, ?, ?, ?, ?)",
    [fullName, email, password, role, college],
    callback
  );
}
