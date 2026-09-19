import * as postService from "../services/postService.js";

export async function getPosts(req, res, next) {
  try {
    const { category, mood, search, sort, page, limit } = req.query;
    const result = await postService.getPosts({
      category: typeof category === "string" ? category : undefined,
      mood: typeof mood === "string" ? mood : undefined,
      search: typeof search === "string" ? search : undefined,
      sort: sort === "helpful" ? "helpful" : "latest",
      page: page ? parseInt(page, 10) : 1,
      limit: limit ? parseInt(limit, 10) : 9,
    });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getPostById(req, res, next) {
  try {
    const post = await postService.getPostById(req.params.id);
    if (!post) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
}

export async function getRandomPost(_req, res, next) {
  try {
    const post = await postService.getRandomPost();
    if (!post) {
      return res.status(404).json({ success: false, error: "No posts available" });
    }
    res.json(post);
  } catch (err) {
    next(err);
  }
}

export async function createPost(req, res, next) {
  try {
    const { content, category, mood } = req.body;

    if (!content || typeof content !== "string" || content.trim().length < 5) {
      return res.status(400).json({
        success: false,
        error: "Content must be at least 5 characters long.",
      });
    }

    if (!category || typeof category !== "string") {
      return res.status(400).json({
        success: false,
        error: "Category is required.",
      });
    }

    if (!mood || typeof mood !== "string") {
      return res.status(400).json({
        success: false,
        error: "Mood is required.",
      });
    }

    const post = await postService.createPost({
      content: content.trim(),
      category: category.trim(),
      mood: mood.trim(),
    });

    res.status(201).json(post);
  } catch (err) {
    next(err);
  }
}

export async function reactToPost(req, res, next) {
  try {
    const { type } = req.body;
    if (type !== "helpful" && type !== "heart") {
      return res.status(400).json({
        success: false,
        error: "Invalid reaction type. Must be 'helpful' or 'heart'.",
      });
    }

    const updated = await postService.reactToPost(req.params.id, type);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Post not found" });
    }

    res.json(updated);
  } catch (err) {
    next(err);
  }
}
