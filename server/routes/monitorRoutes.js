import { Router } from "express";
import * as monitorController from "../controllers/monitorController.js";

const router = Router();

// GET /api/monitor/health - server & database health check
router.get("/health", monitorController.getHealth);

// GET /api/monitor/stats - monitoring statistics (uptime, memory, counts)
router.get("/stats", monitorController.getStats);

export default router;
