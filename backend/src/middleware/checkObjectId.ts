import { Request, Response, NextFunction } from "express";
import { parseObjectIdParam } from "../utils/params";

/** Valida que :id sea un ObjectId válido de MongoDB */
export function checkObjectId(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  if (!parseObjectIdParam(req.params.id)) {
    res.status(400).json({
      status: "error",
      message: "ID de lugar inválido",
    });
    return;
  }

  next();
}
