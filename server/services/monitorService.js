import mongoose from "mongoose";
import Post from "../models/Post.js";
import Reason from "../models/Reason.js";

function formatUptime(seconds) {
  const days = Math.floor(seconds / (3600 * 24));
  const hours = Math.floor((seconds % (3600 * 24)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const parts = [];
  if (days > 0) parts.push(`${days}d`);
  if (hours > 0 || days > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes}m`);
  parts.push(`${secs}s`);

  return parts.join(" ");
}

/**
 * Health check with database ping
 */
export async function getHealthStatus() {
  const dbState =
    mongoose.connection.readyState === 1
      ? "connected"
      : mongoose.connection.readyState === 2
      ? "connecting"
      : "disconnected";

  let dbLatencyMs = null;
  if (dbState === "connected" && mongoose.connection.db) {
    const start = Date.now();
    await mongoose.connection.db.admin().ping();
    dbLatencyMs = Date.now() - start;
  }

  return {
    status: dbState === "connected" ? "ok" : "degraded",
    service: "ReasonsToLive API",
    database: dbState,
    dbLatencyMs,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Monitoring stats (uptime, memory, counts)
 */
export async function getMonitorStats() {
  const uptimeSeconds = process.uptime();
  const memUsageBytes = process.memoryUsage().rss;
  const memoryUsageMB = `${(memUsageBytes / (1024 * 1024)).toFixed(1)} MB`;

  const dbState =
    mongoose.connection.readyState === 1
      ? "connected"
      : mongoose.connection.readyState === 2
      ? "connecting"
      : "disconnected";

  const [totalPosts, totalReasons] =
    await Promise.all([
      Post.countDocuments(),
      Reason.countDocuments(),
    ]);

  return {
    database: dbState,
    uptime: formatUptime(uptimeSeconds),
    uptimeSeconds: Math.floor(uptimeSeconds),
    memoryUsage: memoryUsageMB,
    environment: process.env.NODE_ENV || "development",
    nodeVersion: process.version,
    counts: {
      totalPosts,
      totalReasons,
    },
    timestamp: new Date().toISOString(),
  };
}
