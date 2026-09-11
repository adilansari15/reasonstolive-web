import fs from "fs";
import path from "path";
import { INITIAL_POSTS, INITIAL_REASONS } from "./seeds.js";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_FILE = path.join(DATA_DIR, "db.json");

class DatabaseStore {
  constructor() {
    this.data = {
      posts: [...INITIAL_POSTS],
      reasons: [...INITIAL_REASONS],
    };
    this.isLoaded = false;
    this.init();
  }

  init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed.posts && Array.isArray(parsed.posts)) {
          this.data.posts = parsed.posts;
        }
        if (parsed.reasons && Array.isArray(parsed.reasons)) {
          this.data.reasons = parsed.reasons;
        }
      } else {
        this.save();
      }
      this.isLoaded = true;
    } catch (err) {
      console.warn("Could not read local db.json, using seed state in memory:", err);
      this.isLoaded = true;
    }
  }

  save() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), "utf-8");
    } catch (err) {
      console.warn("Could not write to local db.json:", err);
    }
  }

  // Posts Collection Methods
  getPosts(params = {}) {
    let result = [...this.data.posts];

    // Search query
    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.content.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.mood.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (params.category && params.category !== "All") {
      result = result.filter(
        (p) => p.category.toLowerCase() === params.category.toLowerCase()
      );
    }

    // Mood filter
    if (params.mood && params.mood !== "All") {
      result = result.filter(
        (p) => p.mood.toLowerCase() === params.mood.toLowerCase()
      );
    }

    // Sorting
    if (params.sort === "helpful") {
      result.sort((a, b) => b.helpfulCount + b.heartCount - (a.helpfulCount + a.heartCount));
    } else {
      result.sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    }

    const total = result.length;
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 9));
    const totalPages = Math.ceil(total / limit) || 1;
    const startIndex = (page - 1) * limit;
    const paginated = result.slice(startIndex, startIndex + limit);

    return {
      posts: paginated,
      total,
      page,
      limit,
      totalPages,
    };
  }

  getPostById(id) {
    return this.data.posts.find((p) => p._id === id);
  }

  createPost(postData) {
    const newPost = {
      _id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      content: postData.content.trim(),
      category: postData.category.trim(),
      mood: postData.mood.trim(),
      helpfulCount: 0,
      heartCount: 0,
      createdAt: new Date().toISOString(),
    };

    this.data.posts.unshift(newPost);
    this.save();
    return newPost;
  }

  getRandomPost() {
    if (this.data.posts.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * this.data.posts.length);
    return this.data.posts[randomIndex];
  }

  reactToPost(id, type) {
    const post = this.data.posts.find((p) => p._id === id);
    if (!post) return null;

    if (type === "helpful") {
      post.helpfulCount = (post.helpfulCount || 0) + 1;
    } else if (type === "heart") {
      post.heartCount = (post.heartCount || 0) + 1;
    }

    this.save();
    return post;
  }

  // Reasons Collection Methods
  getReasons(params = {}) {
    let result = [...this.data.reasons];

    if (params.category && params.category !== "All") {
      result = result.filter(
        (r) => r.category.toLowerCase() === params.category.toLowerCase()
      );
    }

    if (params.search && params.search.trim()) {
      const q = params.search.toLowerCase().trim();
      result = result.filter(
        (r) =>
          r.text.toLowerCase().includes(q) ||
          r.category.toLowerCase().includes(q) ||
          r.author.toLowerCase().includes(q)
      );
    }

    result.sort((a, b) => b.likes - a.likes || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return result;
  }

  getRandomReason() {
    if (this.data.reasons.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * this.data.reasons.length);
    return this.data.reasons[randomIndex];
  }

  createReason(reasonData) {
    const newReason = {
      _id: `reason-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      text: reasonData.text.trim(),
      category: reasonData.category?.trim() || "Simple Pleasures",
      author: reasonData.author?.trim() || "Anonymous",
      likes: 1,
      createdAt: new Date().toISOString(),
    };

    this.data.reasons.unshift(newReason);
    this.save();
    return newReason;
  }

  likeReason(id) {
    const reason = this.data.reasons.find((r) => r._id === id);
    if (!reason) return null;
    reason.likes = (reason.likes || 0) + 1;
    this.save();
    return reason;
  }

  getStats() {
    const totalPosts = this.data.posts.length;
    const totalReasons = this.data.reasons.length;
    const totalReactions = this.data.posts.reduce(
      (acc, p) => acc + (p.helpfulCount || 0) + (p.heartCount || 0),
      0
    ) + this.data.reasons.reduce((acc, r) => acc + (r.likes || 0), 0);

    return {
      totalPosts,
      totalReasons,
      totalReactions,
    };
  }
}

export const db = new DatabaseStore();
