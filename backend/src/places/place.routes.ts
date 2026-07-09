import express from "express";
import {
  getPlaces,
  getPlaceById,
  createPlace,
  updatePlace,
  deletePlace,
  deactivatePlace,
  reindexPlace,
} from "./place.controller";
import { internalAuth, requireAdmin } from "../middleware/internalAuth";
import { checkObjectId } from "../middleware/checkObjectId";

const router = express.Router();

router.use(internalAuth);

/**
 * @swagger
 * /api/places:
 *   get:
 *     summary: Listar lugares (CMS) con filtros opcionales
 *     tags: [Places]
 *     parameters:
 *       - in: query
 *         name: region
 *         schema:
 *           type: string
 *           enum: [caribe, andina, pacifico, amazonia, llanos, eje_cafetero]
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [hotel, restaurante, actividad, atractivo, agencia]
 *       - in: query
 *         name: active
 *         schema:
 *           type: string
 *           enum: ["true", "false"]
 *     responses:
 *       200:
 *         description: Listado obtenido correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 count:
 *                   type: integer
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Place'
 *       401:
 *         description: Clave interna inválida
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       403:
 *         description: Rol no autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *   post:
 *     summary: Crear un lugar nuevo (encola generación de embedding en background)
 *     tags: [Places]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PlaceInput'
 *     responses:
 *       201:
 *         description: Lugar creado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Place'
 *       400:
 *         description: Datos inválidos (falló validación Zod)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Clave interna inválida
 *       403:
 *         description: Rol no autorizado
 */
router.route("/").get(getPlaces).post(createPlace);

/**
 * @swagger
 * /api/places/{id}:
 *   get:
 *     summary: Obtener un lugar por ID
 *     tags: [Places]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ObjectId de MongoDB del lugar
 *     responses:
 *       200:
 *         description: Lugar encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 data:
 *                   $ref: '#/components/schemas/Place'
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Lugar no encontrado
 *   put:
 *     summary: Actualizar un lugar (re-encola embedding si cambia contenido descriptivo)
 *     tags: [Places]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Igual a PlaceInput pero con todos los campos opcionales (partial)
 *     responses:
 *       200:
 *         description: Lugar actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/Place'
 *       400:
 *         description: Datos inválidos o ID inválido
 *       404:
 *         description: Lugar no encontrado
 *   delete:
 *     summary: Eliminar un lugar permanentemente (solo admin)
 *     tags: [Places]
 *     security:
 *       - internalKeyAuth: []
 *         userRoleHeader: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lugar eliminado permanentemente
 *       400:
 *         description: ID inválido
 *       403:
 *         description: Solo administradores pueden eliminar
 *       404:
 *         description: Lugar no encontrado
 */
router
  .route("/:id")
  .get(checkObjectId, getPlaceById)
  .put(checkObjectId, updatePlace)
  .delete(checkObjectId, requireAdmin, deletePlace);

/**
 * @swagger
 * /api/places/{id}/deactivate:
 *   patch:
 *     summary: Desactivar un lugar sin borrarlo (empleados)
 *     tags: [Places]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lugar desactivado
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Lugar no encontrado
 */
router.patch("/:id/deactivate", checkObjectId, deactivatePlace);

/**
 * @swagger
 * /api/places/{id}/reindex:
 *   post:
 *     summary: Forzar regeneración del embedding vectorial de un lugar
 *     tags: [Places]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Re-indexación iniciada
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Lugar no encontrado
 */
router.post("/:id/reindex", checkObjectId, reindexPlace);

export default router;
