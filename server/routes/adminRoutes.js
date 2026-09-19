import { Router } from "express";
import * as adminController from "../controllers/adminController.js";

const router = Router();

// GET /api/admin/posts/pending - retrieve posts waiting for review
router.get("/posts/pending", adminController.getPendingPosts);

// GET /api/admin/posts/reviewed - retrieve reviewed posts
router.get("/posts/reviewed", adminController.getReviewedPosts);

// POST /api/admin/approve/:id - approve post
router.post("/approve/:id", adminController.approvePost);
router.post("/posts/:id/approve", adminController.approvePost);

// POST /api/admin/reject/:id - reject post
router.post("/reject/:id", adminController.rejectPost);
router.post("/posts/:id/reject", adminController.rejectPost);

// POST /api/admin/flag/:id - flag post
router.post("/flag/:id", adminController.flagPost);
router.post("/posts/:id/flag", adminController.flagPost);

export default router;
