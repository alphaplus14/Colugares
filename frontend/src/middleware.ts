import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

/** Middleware ligero — no importa MongoDB (compatible con Edge Runtime) */
export default NextAuth(authConfig).auth;

export const config = {
  matcher: [
    "/admin/:path*",
    "/planner/:path*",
    "/onboarding/:path*",
    "/mi-perfil/:path*",
  ],
};
