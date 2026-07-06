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

router.route("/").get(getPlaces).post(createPlace);

router
  .route("/:id")
  .get(checkObjectId, getPlaceById)
  .put(checkObjectId, updatePlace)
  .delete(checkObjectId, requireAdmin, deletePlace);

router.patch("/:id/deactivate", checkObjectId, deactivatePlace);
router.post("/:id/reindex", checkObjectId, reindexPlace);

export default router;
