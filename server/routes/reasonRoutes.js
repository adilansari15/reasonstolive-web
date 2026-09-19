import { Router } from "express";
import * as reasonController from "../controllers/reasonController.js";
import { reasonSubmissionLimiter } from "../middleware/rateLimiter.js";

const router = Router();

// GET /api/reasons - list reasons
router.get("/", reasonController.getReasons);

// POST /api/reasons - submit a reason with rate limiter
router.post("/", reasonSubmissionLimiter, reasonController.createReason);

// GET /api/reasons/random - get random uplifting reason
router.get("/random", reasonController.getRandomReason);

// PATCH /api/reasons/:id/like - resonate/like a reason
router.patch("/:id/like", reasonController.likeReason);

export default router;
