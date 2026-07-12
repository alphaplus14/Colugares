import { handlers } from "@/lib/auth";

/**
 * @swagger
 * /api/auth/{action}:
 *   get:
 *     summary: Endpoints internos de Auth.js (NextAuth) — sesión, providers, CSRF, callback OAuth
 *     tags: [Auth]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           enum: [session, providers, csrf, "callback/google", "callback/credentials", signin, signout]
 *     responses:
 *       200:
 *         description: Respuesta manejada internamente por Auth.js
 *   post:
 *     summary: Endpoints internos de Auth.js (NextAuth) — signin/signout/callback
 *     tags: [Auth]
 *     security: []
 *     parameters:
 *       - in: path
 *         name: action
 *         required: true
 *         schema:
 *           type: string
 *           enum: [signin, signout, "callback/credentials"]
 *     requestBody:
 *       required: false
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             description: >
 *               Para signin con provider 'credentials': email, password e intent
 *               ('staff' o 'viajero'). Solo válido según el rol real del usuario.
 *             properties:
 *               email: { type: string, format: email }
 *               password: { type: string }
 *               intent: { type: string, enum: [staff, viajero] }
 *     responses:
 *       200:
 *         description: Login correcto — set-cookie de sesión
 *       302:
 *         description: Redirección (flujo OAuth o signout)
 */
export const { GET, POST } = handlers;
