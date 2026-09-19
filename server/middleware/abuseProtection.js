import Post from "../models/Post.js";

/**
 * Abuse protection for post submissions:
 * - Prevents duplicate content spam within 10 minutes
 * - Detects character repetition flooding
 * - Detects link-farming / excessive URLs
 */
export async function abuseProtection(req, res, next) {
  const { content } = req.body;

  if (!content || typeof content !== "string") {
    return next();
  }

  const trimmed = content.trim();

  // 1. Detect repetitive character flooding (e.g. "aaaaaaa...", "!!!!!!!...")
  if (/(.)\1{14,}/.test(trimmed)) {
    return res.status(400).json({
      success: false,
      error: "Your submission contains excessive repeating characters. Please share thoughtful words.",
    });
  }

  // 2. Detect link farming: max 1 link allowed in anonymous submissions
  const urlMatches = trimmed.match(/https?:\/\/[^\s]+/gi) || [];
  if (urlMatches.length > 1) {
    return res.status(400).json({
      success: false,
      error: "Posts cannot contain multiple external links to prevent promotional spam.",
    });
  }

  // 3. Duplicate detection: check if exact same content was submitted in the last 10 minutes
  try {
    const tenMinutesAgo = new Date(Date.now() - 10 * 60 * 1000);
    const existingDuplicate = await Post.findOne({
      content: trimmed,
      createdAt: { $gte: tenMinutesAgo },
    });

    if (existingDuplicate) {
      return res.status(429).json({
        success: false,
        error: "An identical post was submitted recently. Duplicate submissions are not allowed within 10 minutes.",
      });
    }
  } catch (err) {
    console.error("Duplicate check error:", err);
  }

  next();
}
