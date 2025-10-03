import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import authRoutes from "./routes/auth.js"; // make sure to add .js

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes); //Add /api/auth as prefix before /signup or /login.

app.listen(port, () => console.log(`Server running on port ${port}`));
