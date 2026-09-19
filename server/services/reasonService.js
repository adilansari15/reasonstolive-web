import mongoose from "mongoose";
import Reason from "../models/Reason.js";
import Post from "../models/Post.js";

/**
 * Get reasons with optional category and search filters
 */
export async function getReasons(params = {}) {
  const { category, search } = params;
  const filter = {};

  if (category && category !== "All") {
    filter.category = { $regex: new RegExp(`^${category}$`, "i") };
  }

  if (search && search.trim()) {
    const regex = new RegExp(search.trim(), "i");
    filter.$or = [{ text: regex }, { category: regex }, { author: regex }];
  }

  return Reason.find(filter).sort({ likes: -1, createdAt: -1 }).lean();
}

/**
 * Get random reason
 */
export async function getRandomReason() {
  const count = await Reason.countDocuments();
  if (count === 0) return null;

  const random = Math.floor(Math.random() * count);
  return Reason.findOne().skip(random).lean();
}

/**
 * Create a new reason
 */
export async function createReason({ text, category, author }) {
  return Reason.create({
    text: text.trim(),
    category: category?.trim() || "Simple Pleasures",
    author: author?.trim() || "Anonymous",
    likes: 1,
  });
}

/**
 * Like a reason
 */
export async function likeReason(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  return Reason.findByIdAndUpdate(
    id,
    { $inc: { likes: 1 } },
    { new: true }
  ).lean();
}

/**
 * Get community statistics
 */
export async function getCommunityStats() {
  const [totalPosts, totalReasons, postsAgg, reasonsAgg] = await Promise.all([
    Post.countDocuments({ isApproved: true }),
    Reason.countDocuments(),
    Post.aggregate([
      { $match: { isApproved: true } },
      {
        $group: {
          _id: null,
          total: { $sum: { $add: ["$helpfulCount", "$heartCount"] } },
        },
      },
    ]),
    Reason.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: "$likes" },
        },
      },
    ]),
  ]);

  const totalReactions =
    (postsAgg[0]?.total || 0) + (reasonsAgg[0]?.total || 0);

  return {
    totalPosts,
    totalReasons,
    totalReactions,
  };
}
