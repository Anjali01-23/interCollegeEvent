import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config(); // Must be at the top

export const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Error:", err.message);
    return;
  }
  console.log("✅ Connected to MySQL Database");
});
