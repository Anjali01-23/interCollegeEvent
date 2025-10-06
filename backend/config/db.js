import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

export const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ MySQL Pool Connection Error:", err.message);
  } else {
    console.log("✅ Connected to MySQL Database (Pool)");
    connection.release();
  }
});
