import { Router } from "express";
import * as adminController from "../controllers/adminController.js";
import { loginAdmin, changeAdminPassword } from "../services/adminAuthService.js";
import { requireAdminAuth } from "../middleware/adminAuth.js";

const router = Router();

// ── Public auth endpoints (no token required) ────────────────────────────────

// POST /api/admin/auth/login
router.post("/auth/login", async (req, res, next) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ success: false, error: "Password is required." });
    }
    const token = await loginAdmin(password);
    if (!token) {
      return res.status(401).json({ success: false, error: "Incorrect password." });
    }
    res.json({ success: true, token });
  } catch (err) {
    next(err);
  }
});

// ── All routes below require a valid admin token ──────────────────────────────
router.use(requireAdminAuth);

// POST /api/admin/auth/change-password
router.post("/auth/change-password", async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: "Both current and new passwords are required." });
    }
    await changeAdminPassword(currentPassword, newPassword);
    res.json({ success: true, message: "Password changed successfully." });
  } catch (err) {
    if (err.message === "Current password is incorrect." || err.message.includes("at least")) {
      return res.status(400).json({ success: false, error: err.message });
    }
    next(err);
  }
});

// GET /api/admin/posts/all
router.get("/posts/all", adminController.getAllPosts);

// GET /api/admin/posts/pending
router.get("/posts/pending", adminController.getPendingPosts);

// GET /api/admin/posts/reviewed
router.get("/posts/reviewed", adminController.getReviewedPosts);

// DELETE /api/admin/posts/:id
router.delete("/posts/:id", adminController.deletePost);

// POST /api/admin/posts/:id/approve
router.post("/approve/:id", adminController.approvePost);
router.post("/posts/:id/approve", adminController.approvePost);

// POST /api/admin/posts/:id/reject
router.post("/reject/:id", adminController.rejectPost);
router.post("/posts/:id/reject", adminController.rejectPost);

// POST /api/admin/posts/:id/flag
router.post("/flag/:id", adminController.flagPost);
router.post("/posts/:id/flag", adminController.flagPost);

export default router;
