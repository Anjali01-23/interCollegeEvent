// middleware/auth.js
import jwt from "jsonwebtoken";

export const auth = (req, res, next) => {
  console.log("[auth] headers.authorization =", req.headers.authorization);
  const authHeader = req.headers.authorization || req.headers.Authorization;
  if (!authHeader) return res.status(401).json({ message: "No token" });

  const [scheme, token] = authHeader.split(" ");
  if (!token || scheme.toLowerCase() !== "bearer")
    return res.status(401).json({ message: "Bad auth format" });

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("[auth] JWT_SECRET not set");
      return res.status(500).json({ message: "Server misconfiguration" });
    }
    const payload = jwt.verify(token, secret);
    console.log("[auth] token payload =", payload);
    req.user = payload; // e.g. { id: 6, role: "Super Admin", iat, exp }
    next();
  } catch (err) {
    console.error("[auth] jwt.verify error:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
