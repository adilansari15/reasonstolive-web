import rateLimit from "express-rate-limit";

/**
 * Global rate limiter: Max 200 requests per 15 minutes per IP
 */
export const globalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests from this IP, please try again in 15 minutes.",
  },
});

/**
 * Post submission rate limiter: Max 5 submissions per 10 minutes per IP
 * Protects anonymous posting from abuse and flooding
 */
export const postSubmissionLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Submission cooldown active. You can submit up to 5 posts per 10 minutes. Please take a moment to breathe.",
  },
});

/**
 * Reason submission rate limiter: Max 10 submissions per 10 minutes per IP
 */
export const reasonSubmissionLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many reasons submitted. Please wait a few minutes before submitting another reason.",
  },
});
