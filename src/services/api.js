export const api = {
  async getPosts(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== "All") query.set("category", params.category);
    if (params.mood && params.mood !== "All") query.set("mood", params.mood);
    if (params.search) query.set("search", params.search);
    if (params.sort) query.set("sort", params.sort);
    if (params.page) query.set("page", params.page.toString());
    if (params.limit) query.set("limit", params.limit.toString());

    const res = await fetch(`/api/posts?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch posts");
    return res.json();
  },

  async getPostById(id) {
    const res = await fetch(`/api/posts/${id}`);
    if (!res.ok) throw new Error("Post not found");
    return res.json();
  },

  async getRandomPost() {
    const res = await fetch("/api/posts/random");
    if (!res.ok) throw new Error("Failed to fetch random post");
    return res.json();
  },

  async createPost(data) {
    const res = await fetch("/api/posts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to submit story");
    }
    return res.json();
  },

  async reactToPost(id, type) {
    const res = await fetch(`/api/posts/${id}/react`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    });
    if (!res.ok) throw new Error("Failed to record reaction");
    return res.json();
  },

  async getReasons(params = {}) {
    const query = new URLSearchParams();
    if (params.category && params.category !== "All") query.set("category", params.category);
    if (params.search) query.set("search", params.search);

    const res = await fetch(`/api/reasons?${query.toString()}`);
    if (!res.ok) throw new Error("Failed to fetch reasons");
    return res.json();
  },

  async getRandomReason() {
    const res = await fetch("/api/reasons/random");
    if (!res.ok) throw new Error("Failed to fetch random reason");
    return res.json();
  },

  async createReason(data) {
    const res = await fetch("/api/reasons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || "Failed to submit reason");
    }
    return res.json();
  },

  async likeReason(id) {
    const res = await fetch(`/api/reasons/${id}/like`, {
      method: "PATCH",
    });
    if (!res.ok) throw new Error("Failed to like reason");
    return res.json();
  },

  async getStats() {
    const res = await fetch("/api/stats");
    if (!res.ok) throw new Error("Failed to fetch stats");
    return res.json();
  },
};
