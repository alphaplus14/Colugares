import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  statusCode?: number;
}

/**
 * Manejador global de errores — nunca expone stack traces al cliente.
 */
export function errorHandler(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const statusCode = err.statusCode ?? 500;

  console.error(`[ERROR] ${err.message}`);

  res.status(statusCode).json({
    status: "error",
    statusCode,
    message: err.message || "Ocurrió un error inesperado en el servidor",
  });
}
