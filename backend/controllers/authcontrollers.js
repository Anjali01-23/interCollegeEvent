import jwt from "jsonwebtoken"; // import the whole module
import { findByEmail, create } from "../models/User.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

export function signup(req, res) {
  const { fullName, email, password, role, college } = req.body;

  findByEmail(email, (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (result.length) return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = bcrypt.hashSync(password, 10);
    const role = "student";

    create(
  { fullName, email, password: hashedPassword, role, college },
  (err, dbResult) => {
    if (err) {
      console.error("DB error creating user:", err);
      return res.status(500).json({ message: "DB error creating user", error: err.message });
    }

    const newUserId = dbResult?.insertId ?? null;

    return res.status(201).json({
      message: "User created successfully",
      id: newUserId,
      user: {
        id: newUserId,
        fullname: fullName,
        email,
        college,
        role
      }
    });
  }
);

  });
}

export function login(req, res) {
  const { email, password } = req.body;

  findByEmail(email, (err, result) => {
    if (err) return res.status(500).json({ message: "DB error" });
    if (!result.length) return res.status(400).json({ message: "User not found" });

    const user = result[0];
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.json({ user, token });
  });
}
