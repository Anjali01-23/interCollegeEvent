import { Router } from "express";
const router = Router();
import { signup, login } from "../controllers/authcontrollers.js";

router.post("/signup", signup);
router.post("/login", login);

export default router;
