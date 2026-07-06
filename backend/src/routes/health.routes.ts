import { Router, Request, Response } from "express";
import { pingDb } from "../config/mongodb";

const router = Router();

/** GET /api/health — verifica servidor y conexión a MongoDB */
router.get("/", async (_req: Request, res: Response) => {
  const dbConnected = await pingDb();

  res.status(dbConnected ? 200 : 503).json({
    status: dbConnected ? "ok" : "degraded",
    server: "running",
    db: dbConnected ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

export default router;
