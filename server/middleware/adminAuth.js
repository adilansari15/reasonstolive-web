import { verifyToken } from "../services/adminAuthService.js";

/**
 * Middleware: require a valid admin token in Authorization header.
 * Usage: router.use(requireAdminAuth)
 */
export function requireAdminAuth(req, res, next) {
  const authHeader = req.headers["authorization"] || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    return res.status(401).json({ success: false, error: "Unauthorized. Please log in." });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return res.status(401).json({ success: false, error: "Session expired. Please log in again." });
  }

  req.admin = payload;
  next();
}

