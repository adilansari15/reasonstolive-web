import mongoose from "mongoose";
import Post from "../models/Post.js";

/**
 * Query posts with filtering, search, pagination, and sorting
 */
export async function getPosts(params = {}) {
  const { category, mood, search, sort, page, limit } = params;

  const baseFilter = {};

  if (category && category !== "All") {
    baseFilter.category = { $regex: new RegExp(`^${category}$`, "i") };
  }

  if (mood && mood !== "All") {
    baseFilter.mood = { $regex: new RegExp(`^${mood}$`, "i") };
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 9));
  const skip = (pageNum - 1) * limitNum;

  const filter = { ...baseFilter };

  // Text search optimization: Use MongoDB full-text index
  if (search && search.trim()) {
    const q = search.trim();
    filter.$text = { $search: q };
  }

  const executeQuery = async (queryFilter) => {
    let posts;
    if (sort === "helpful") {
      posts = await Post.aggregate([
        { $match: queryFilter },
        {
          $addFields: {
            score: { $add: ["$helpfulCount", "$heartCount"] },
          },
        },
        { $sort: { score: -1, createdAt: -1 } },
        { $skip: skip },
        { $limit: limitNum },
      ]);
    } else {
      posts = await Post.find(queryFilter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean();
    }
    const total = await Post.countDocuments(queryFilter);
    return { posts, total };
  };

  let { posts, total } = await executeQuery(filter);

  // If text index search returned 0 results, fall back to case-insensitive substring regex
  if (total === 0 && search && search.trim()) {
    const regex = new RegExp(search.trim(), "i");
    const fallbackFilter = {
      ...baseFilter,
      $or: [{ content: regex }, { category: regex }, { mood: regex }],
    };
    const fallbackResult = await executeQuery(fallbackFilter);
    posts = fallbackResult.posts;
    total = fallbackResult.total;
  }

  const totalPages = Math.ceil(total / limitNum) || 1;

  return {
    posts,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages,
  };
}

/**
 * Get a single post by ID
 */
export async function getPostById(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  return Post.findById(id).lean();
}

/**
 * Get a random post
 */
export async function getRandomPost() {
  const count = await Post.countDocuments({});
  if (count === 0) return null;
  const random = Math.floor(Math.random() * count);
  return Post.findOne({}).skip(random).lean();
}

/**
 * Create a new post — instantly approved, no moderation
 */
export async function createPost({ content, category, mood }) {
  const post = await Post.create({
    content: content.trim(),
    category: category.trim(),
    mood: mood.trim(),
    helpfulCount: 0,
    heartCount: 0,
    status: "approved",
  });

  return post;
}

/**
 * React to a post (helpful / heart)
 */
export async function reactToPost(id, type) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;

  const updateField = type === "helpful" ? { helpfulCount: 1 } : { heartCount: 1 };
  return Post.findByIdAndUpdate(
    id,
    { $inc: updateField },
    { new: true }
  ).lean();
}
