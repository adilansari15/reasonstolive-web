import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { db } from "./server/db.js";

async function startServer() {
  const app = express();
 const PORT = process.env.PORT || 3000;

  app.use(express.json());

  // Health check endpoint
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", service: "ReasonsToLive API" });
  });

  // Community summary stats
  app.get("/api/stats", (_req, res) => {
    try {
      const stats = db.getStats();
      res.json(stats);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch stats", details: err.message });
    }
  });

  // GET /api/posts - query with search, category, mood, page, limit, sort
  app.get("/api/posts", (req, res) => {
    try {
      const { category, mood, search, sort, page, limit } = req.query;
      const result = db.getPosts({
        category: typeof category === "string" ? category : undefined,
        mood: typeof mood === "string" ? mood : undefined,
        search: typeof search === "string" ? search : undefined,
        sort: sort === "helpful" ? "helpful" : "latest",
        page: page ? parseInt(page, 10) : 1,
        limit: limit ? parseInt(limit, 10) : 9,
      });
      res.json(result);
    } catch (err) {
      res.status(500).json({ error: "Failed to retrieve posts", details: err.message });
    }
  });

  // POST /api/posts - create anonymous post
  app.post("/api/posts", (req, res) => {
    try {
      const { content, category, mood } = req.body;

      if (!content || typeof content !== "string" || content.trim().length < 5) {
        return res.status(400).json({ error: "Content must be at least 5 characters long." });
      }

      if (!category || typeof category !== "string") {
        return res.status(400).json({ error: "Category is required." });
      }

      if (!mood || typeof mood !== "string") {
        return res.status(400).json({ error: "Mood is required." });
      }

      const post = db.createPost({
        content: content.trim(),
        category: category.trim(),
        mood: mood.trim(),
      });

      res.status(201).json(post);
    } catch (err) {
      res.status(500).json({ error: "Failed to create post", details: err.message });
    }
  });

  // GET /api/posts/random - get a random letter/post
  app.get("/api/posts/random", (req, res) => {
    try {
      const post = db.getRandomPost();
      if (!post) {
        return res.status(404).json({ error: "No posts available" });
      }
      res.json(post);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch random post", details: err.message });
    }
  });

  // GET /api/posts/:id - single post
  app.get("/api/posts/:id", (req, res) => {
    try {
      const post = db.getPostById(req.params.id);
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
      res.json(post);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch post", details: err.message });
    }
  });

  // PATCH /api/posts/:id/react - react with helpful or heart
  app.patch("/api/posts/:id/react", (req, res) => {
    try {
      const { type } = req.body;
      if (type !== "helpful" && type !== "heart") {
        return res.status(400).json({ error: "Invalid reaction type. Must be 'helpful' or 'heart'." });
      }

      const updated = db.reactToPost(req.params.id, type);
      if (!updated) {
        return res.status(404).json({ error: "Post not found" });
      }

      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to record reaction", details: err.message });
    }
  });

  // GET /api/reasons - get all reasons to live
  app.get("/api/reasons", (req, res) => {
    try {
      const { search, category } = req.query;
      const reasons = db.getReasons({
        search: typeof search === "string" ? search : undefined,
        category: typeof category === "string" ? category : undefined,
      });
      res.json(reasons);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch reasons", details: err.message });
    }
  });

  // GET /api/reasons/random - get random uplifting reason
  app.get("/api/reasons/random", (_req, res) => {
    try {
      const reason = db.getRandomReason();
      if (!reason) {
        return res.status(404).json({ error: "No reasons available" });
      }
      res.json(reason);
    } catch (err) {
      res.status(500).json({ error: "Failed to fetch random reason", details: err.message });
    }
  });

  // POST /api/reasons - submit a reason to live
  app.post("/api/reasons", (req, res) => {
    try {
      const { text, category, author } = req.body;
      if (!text || typeof text !== "string" || text.trim().length < 3) {
        return res.status(400).json({ error: "Reason text must be at least 3 characters long." });
      }

      const reason = db.createReason({
        text: text.trim(),
        category: category?.trim(),
        author: author?.trim() || "Anonymous",
      });

      res.status(201).json(reason);
    } catch (err) {
      res.status(500).json({ error: "Failed to submit reason", details: err.message });
    }
  });

  // PATCH /api/reasons/:id/like - resonate/like a reason
  app.patch("/api/reasons/:id/like", (req, res) => {
    try {
      const updated = db.likeReason(req.params.id);
      if (!updated) {
        return res.status(404).json({ error: "Reason not found" });
      }
      res.json(updated);
    } catch (err) {
      res.status(500).json({ error: "Failed to like reason", details: err.message });
    }
  });

  // Vite middleware for development / static serving for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`ReasonsToLive server listening on http://localhost:${PORT}`);
  });
}

startServer();
