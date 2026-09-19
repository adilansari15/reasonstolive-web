import * as monitorService from "../services/monitorService.js";

export async function getHealth(_req, res, next) {
  try {
    const health = await monitorService.getHealthStatus();
    res.json(health);
  } catch (err) {
    next(err);
  }
}

export async function getStats(_req, res, next) {
  try {
    const stats = await monitorService.getMonitorStats();
    res.json(stats);
  } catch (err) {
    next(err);
  }
}
