import * as reasonService from "../services/reasonService.js";

export async function getReasons(req, res, next) {
  try {
    const { search, category } = req.query;
    const reasons = await reasonService.getReasons({
      search: typeof search === "string" ? search : undefined,
      category: typeof category === "string" ? category : undefined,
    });
    res.json(reasons);
  } catch (err) {
    next(err);
  }
}

export async function getRandomReason(_req, res, next) {
  try {
    const reason = await reasonService.getRandomReason();
    if (!reason) {
      return res.status(404).json({ success: false, error: "No reasons available" });
    }
    res.json(reason);
  } catch (err) {
    next(err);
  }
}

export async function createReason(req, res, next) {
  try {
    const { text, category, author } = req.body;

    if (!text || typeof text !== "string" || text.trim().length < 3) {
      return res.status(400).json({
        success: false,
        error: "Reason text must be at least 3 characters long.",
      });
    }

    const reason = await reasonService.createReason({
      text: text.trim(),
      category: category?.trim(),
      author: author?.trim(),
    });

    res.status(201).json(reason);
  } catch (err) {
    next(err);
  }
}

export async function likeReason(req, res, next) {
  try {
    const updated = await reasonService.likeReason(req.params.id);
    if (!updated) {
      return res.status(404).json({ success: false, error: "Reason not found" });
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function getStats(_req, res, next) {
  try {
    const stats = await reasonService.getCommunityStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}
