import { Request, Response, NextFunction } from "express";
import type { UserRole } from "../types/user.types";

export interface InternalRequest extends Request {
  userRole?: UserRole;
}

/**
 * Valida llamadas server-to-server desde el proxy de Next.js.
 * El rol del usuario viaja en X-User-Role tras verificación Auth.js.
 */
export function internalAuth(
  req: InternalRequest,
  res: Response,
  next: NextFunction,
): void {
  const internalKey = req.headers["x-internal-key"];
  const expectedKey = process.env.INTERNAL_API_KEY;

  if (!expectedKey || internalKey !== expectedKey) {
    res.status(401).json({
      status: "error",
      message: "No autorizado, clave interna inválida",
    });
    return;
  }

  const role = req.headers["x-user-role"];
  if (role === "admin" || role === "empleado") {
    req.userRole = role;
    next();
    return;
  }

  res.status(403).json({
    status: "error",
    message: "No autorizado, se requiere rol admin o empleado",
  });
}

/** Solo admin puede eliminar permanentemente */
export function requireAdmin(
  req: InternalRequest,
  res: Response,
  next: NextFunction,
): void {
  if (req.userRole === "admin") {
    next();
    return;
  }

  res.status(403).json({
    status: "error",
    message: "Solo administradores pueden eliminar registros permanentemente",
  });
}
