import { GoogleGenAI } from "@google/genai";

let aiClient = null;

function getAIClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

/**
 * Moderate user submitted content using Gemini API
 * @param {string} content - Post content
 * @param {string} category - Post category
 * @param {string} mood - Post mood
 * @returns {Promise<{ isApproved: boolean, moderationStatus: string, moderationReason: string }>}
 */
export async function moderateContent(content, category = "", mood = "") {
  const ai = getAIClient();

  if (!ai) {
    console.warn("⚠️  GEMINI_API_KEY not configured. Content flagged for manual admin review.");
    return {
      isApproved: false,
      moderationStatus: "pending",
      moderationReason: "Pending manual admin review (GEMINI_API_KEY not configured)",
    };
  }

  const prompt = `You are an empathetic, safety-focused content moderator for an online mental health and suicide prevention community platform called "Reasons to Live".

Platform Context:
Users share vulnerabilities, past battles with depression, grief, breakups, burnout, anxiety, and reasons to keep holding on.
Expressions of sadness, past self-harm recovery milestones, loneliness, or emotional pain are WELCOME and SAFE if they are not encouraging suicide, providing actionable harm methods, or threatening others.

Review the following post and determine its safety:
Post Category: "${category}"
Post Mood: "${mood}"
Post Content:
"""
${content}
"""

Safety Rules:
1. SAFE / APPROVED:
   - Sharing personal emotional pain, sadness, breakup, grief, loneliness, academic stress.
   - Sharing past struggles with mental illness or recovery milestones (e.g., "1 year clean from self-harm", "Two years ago I was in a dark place").
   - Expressing hope, gratitude, or advice to hold on.
   - Venting about feeling tired, overwhelmed, or anxious without explicit intent or plans to self-harm.

2. UNSAFE / PENDING or REJECTED:
   - Explicit declarations of imminent suicide plans, active lethal means, or suicide pacts.
   - Instructions, methods, or encouragement for self-harm or suicide.
   - Harassment, hate speech, bullying, or sexual violence.
   - Malicious spam, scams, or gibberish.

Respond ONLY with a JSON object in this exact structure:
{
  "isApproved": boolean,
  "moderationStatus": "approved" | "pending" | "rejected",
  "moderationReason": "A concise explanation of the decision (under 25 words)"
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsed = JSON.parse(response.text.trim());

    return {
      isApproved: Boolean(parsed.isApproved),
      moderationStatus: ["approved", "pending", "rejected"].includes(parsed.moderationStatus)
        ? parsed.moderationStatus
        : parsed.isApproved
        ? "approved"
        : "pending",
      moderationReason: parsed.moderationReason || (parsed.isApproved ? "Approved by AI moderation" : "Flagged for manual review"),
    };
  } catch (error) {
    console.error("❌ Gemini moderation error:", error.message);
    // On API error, fail safe by setting to pending for manual admin review
    return {
      isApproved: false,
      moderationStatus: "pending",
      moderationReason: "Pending manual admin review (AI moderation check timed out)",
    };
  }
}
