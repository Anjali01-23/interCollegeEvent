import { db } from "../config/db.js";

export function findByEmail(email,callback){
  db.query("SELECT * FROM users WHERE email = ?",[email],callback);
}

export function create(user, callback) {
  const { fullName, email, password, role, college } = user;
   const sql = "INSERT INTO users (fullname, email, password, role, college) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [fullName, email, password, role, college], (err, result) => {
    // return (err, result) so caller can read result.insertId
    callback(err, result);
  });
}
