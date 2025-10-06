import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import authRoutes from "./routes/auth.js";
import eventRoutes from "./routes/events.js"; // New events routes

dotenv.config();
const app = express();
const port = process.env.PORT || 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(path.resolve(), 'uploads')));
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes); // Event routes

app.listen(port, () => console.log(`Server running on port ${port}`));
