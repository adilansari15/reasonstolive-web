import mongoose from "mongoose";
import Post from "../models/Post.js";

/**
 * GET /api/admin/posts/pending
 * Retrieve posts awaiting human review
 */
export async function getPendingPosts(req, res, next) {
  try {
    const { page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const filter = { moderationStatus: "pending" };
    const [posts, total] = await Promise.all([
      Post.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limitNum).lean(),
      Post.countDocuments(filter),
    ]);

    res.json({
      success: true,
      posts,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/posts/reviewed
 * Retrieve reviewed, approved, rejected, or flagged posts
 */
export async function getReviewedPosts(req, res, next) {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const filter = status
      ? { moderationStatus: status }
      : { moderationStatus: { $in: ["approved", "rejected", "flagged"] } };

    const [posts, total] = await Promise.all([
      Post.find(filter).sort({ updatedAt: -1 }).skip(skip).limit(limitNum).lean(),
      Post.countDocuments(filter),
    ]);

    res.json({
      success: true,
      posts,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum) || 1,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/approve/:id
 * Manually approve a post
 */
export async function approvePost(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    const post = await Post.findByIdAndUpdate(
      id,
      {
        isApproved: true,
        moderationStatus: "approved",
        status: "approved",
        moderationReason: req.body.reason || "Manually approved by administrator",
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    res.json({
      success: true,
      message: "Post approved successfully",
      post,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/reject/:id
 * Reject an unsafe post
 */
export async function rejectPost(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    const post = await Post.findByIdAndUpdate(
      id,
      {
        isApproved: false,
        moderationStatus: "rejected",
        status: "rejected",
        moderationReason: req.body.reason || "Rejected by administrator",
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    res.json({
      success: true,
      message: "Post rejected",
      post,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/admin/flag/:id
 * Flag a post for senior review or escalation
 */
export async function flagPost(req, res, next) {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    const post = await Post.findByIdAndUpdate(
      id,
      {
        isApproved: false,
        moderationStatus: "flagged",
        status: "flagged",
        moderationReason: req.body.reason || "Flagged for safety review",
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    res.json({
      success: true,
      message: "Post flagged for supervisor review",
      post,
    });
  } catch (err) {
    next(err);
  }
}
