import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayload, UserRole } from "../types/user.types";

interface AuthenticatedRequest extends Request {
  user?: JwtPayload;
}

/**
 * Middleware que verifica JWT en el header Authorization.
 * Patrón equivalente al `protect` del proyecto del instructor.
 */
export function protect(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({
      status: "error",
      message: "No autorizado, token no proporcionado",
    });
    return;
  }

  const token = authHeader.split(" ")[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res.status(500).json({
      status: "error",
      message: "Configuración de autenticación incompleta",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({
      status: "error",
      message: "No autorizado, token inválido",
    });
  }
}

/**
 * Restringe acceso a roles específicos.
 * Patrón equivalente al `admin` del instructor, extendido a múltiples roles.
 */
export function requireRole(...roles: UserRole[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        status: "error",
        message: "No autorizado, permisos insuficientes",
      });
      return;
    }
    next();
  };
}

export type { AuthenticatedRequest };
