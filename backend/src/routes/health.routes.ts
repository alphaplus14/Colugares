import { Router, Request, Response } from "express";
import { pingDb } from "../config/mongodb";

const router = Router();

/**
 * @swagger
 * /api/health:
 *   get:
 *     summary: Verifica que el servidor y la conexión a MongoDB estén activos
 *     tags: [Health]
 *     security: []
 *     responses:
 *       200:
 *         description: Servidor y base de datos operando correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 server:
 *                   type: string
 *                   example: running
 *                 db:
 *                   type: string
 *                   example: connected
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       503:
 *         description: Base de datos desconectada (servidor degradado)
 */
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
