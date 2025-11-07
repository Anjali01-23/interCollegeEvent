// backend/middleware/roles.js
export const requireRole = (role) => (req, res, next) => {
  // req.user must be set by your auth middleware (JWT/session)
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (req.user.role !== role) return res.status(403).json({ message: "Access denied" });
  next();
};

export const requireAnyRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: "Not authenticated" });
  if (!roles.includes(req.user.role)) return res.status(403).json({ message: "Access denied" });
  next();
};
