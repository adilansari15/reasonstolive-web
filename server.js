import express from "express";
import path from "path";
import dotenv from "dotenv";
import morgan from "morgan";
import { createServer as createViteServer } from "vite";

import { connectDB } from "./server/config/mongodb.js";
import { seedDatabase } from "./server/seed.js";
import { initAdminPassword } from "./server/services/adminAuthService.js";
import { configureSecurity } from "./server/middleware/security.js";
import { globalRateLimiter } from "./server/middleware/rateLimiter.js";
import { errorHandler } from "./server/middleware/errorHandler.js";

import postRoutes from "./server/routes/postRoutes.js";
import reasonRoutes from "./server/routes/reasonRoutes.js";
import adminRoutes from "./server/routes/adminRoutes.js";
import monitorRoutes from "./server/routes/monitorRoutes.js";
import { getCommunityStats } from "./server/services/reasonService.js";
import { getHealthStatus } from "./server/services/monitorService.js";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // 1. Connect Database
  await connectDB();

  // 2. Initialize Seed & Migrations
  try {
    await seedDatabase();
  } catch (seedErr) {
    console.warn("⚠️  Initial seeding check warning:", seedErr.message);
  }

  // 2b. Ensure admin password is initialized in DB
  try {
    await initAdminPassword();
  } catch (err) {
    console.warn("⚠️  Admin password init warning:", err.message);
  }

  // 3. Security Hardening (Helmet, Mongo Sanitize)
  configureSecurity(app);

  // 4. Request Logging
  app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

  // 5. Body Parsers
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: true, limit: "1mb" }));

  // 6. Global Rate Limiter for API endpoints
  app.use("/api", globalRateLimiter);

  // 7. Core Feature Routes
  app.use("/api/posts", postRoutes);
  app.use("/api/reasons", reasonRoutes);
  app.use("/api/admin", adminRoutes);
  app.use("/api/monitor", monitorRoutes);

  // 8. Backward-Compatible Aliases for Frontend
  app.get("/api/health", async (_req, res, next) => {
    try {
      const health = await getHealthStatus();
      res.json(health);
    } catch (err) {
      next(err);
    }
  });

  app.get("/api/stats", async (_req, res, next) => {
    try {
      const stats = await getCommunityStats();
      res.json(stats);
    } catch (err) {
      next(err);
    }
  });

  // 9. Centralized Error Handler (must be registered after API routes)
  app.use("/api", errorHandler);

  // 10. Frontend Client Serving (Vite Dev Middleware or Static Production)
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

  // 11. Final Error Handler for Non-API errors
  app.use(errorHandler);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`\n🚀 ReasonsToLive server listening on http://localhost:${PORT}`);
    console.log(`🛡️  Security: Helmet, Rate Limiting & Mongo Sanitize active`);

  });
}

startServer();
