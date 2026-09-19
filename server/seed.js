import dotenv from "dotenv";
import mongoose from "mongoose";
import { connectDB } from "./config/mongodb.js";
import Post from "./models/Post.js";
import Reason from "./models/Reason.js";
import { INITIAL_POSTS, INITIAL_REASONS } from "./seeds.js";

dotenv.config();

/**
 * Ensures existing posts have required moderation fields
 */
export async function migrateExistingPosts() {
  const result = await Post.updateMany(
    { $or: [{ isApproved: { $exists: false } }, { moderationStatus: { $exists: false } }] },
    {
      $set: {
        isApproved: true,
        moderationStatus: "approved",
        moderationReason: "Legacy post migration",
        status: "approved",
      },
    }
  );
  if (result.modifiedCount > 0) {
    console.log(`🔄 Migrated ${result.modifiedCount} legacy posts to approved status.`);
  }
}

export async function seedDatabase(force = false) {
  const postCount = await Post.countDocuments();
  const reasonCount = await Reason.countDocuments();

  if (!force && (postCount > 0 || reasonCount > 0)) {
    await migrateExistingPosts();
    console.log(`ℹ️  Database already contains ${postCount} posts and ${reasonCount} reasons. Skipping seed.`);
    return;
  }

  if (force) {
    console.log("🧹 Clearing existing data...");
    await Post.deleteMany({});
    await Reason.deleteMany({});
  }

  console.log("🌱 Seeding database...");
  const postsToInsert = INITIAL_POSTS.map(({ _id, ...rest }) => ({
    ...rest,
    status: "approved",
    moderationStatus: "approved",
    moderationReason: "Seed dataset verified",
    isApproved: true,
  }));

  const reasonsToInsert = INITIAL_REASONS.map(({ _id, ...rest }) => rest);

  await Post.insertMany(postsToInsert);
  await Reason.insertMany(reasonsToInsert);

  console.log(`✅ Seeded ${postsToInsert.length} posts and ${reasonsToInsert.length} reasons successfully.`);
}

// Standalone execution check
const isMain =
  process.argv[1] &&
  (process.argv[1].endsWith("seed.js") ||
    process.argv[1].replace(/\\/g, "/").endsWith("server/seed.js"));

if (isMain) {
  try {
    await connectDB();
    const force = process.argv.includes("--force");
    await seedDatabase(force);
    await mongoose.disconnect();
    console.log("Database disconnected. Seeding finished.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  }
}
