import { Router } from "express";
import * as postController from "../controllers/postController.js";
import { postSubmissionLimiter } from "../middleware/rateLimiter.js";
import { abuseProtection } from "../middleware/abuseProtection.js";

const router = Router();

// GET /api/posts - query posts
router.get("/", postController.getPosts);

// POST /api/posts - create anonymous post with rate limit & abuse protection
router.post("/", postSubmissionLimiter, abuseProtection, postController.createPost);

// GET /api/posts/random - random post
router.get("/random", postController.getRandomPost);

// GET /api/posts/:id - single post
router.get("/:id", postController.getPostById);

// PATCH /api/posts/:id/react - react with helpful or heart
router.patch("/:id/react", postController.reactToPost);

export default router;
