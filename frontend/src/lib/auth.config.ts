import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@/types/user.types";

export const authConfig = {
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    // Edge/middleware: mapea campos custom del JWT a session.user (sin MongoDB)
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      // Panel admin: solo staff interno
      if (pathname.startsWith("/admin")) {
        const role = auth?.user?.role as UserRole | undefined;
        return role === "admin" || role === "empleado";
      }

      // Rutas del viajero: planner, onboarding y perfil
      if (
        pathname.startsWith("/planner") ||
        pathname.startsWith("/onboarding") ||
        pathname.startsWith("/mi-perfil")
      ) {
        if (!auth?.user) {
          return false;
        }

        const role = auth.user.role as UserRole | undefined;

        // JWT legacy sin role: dejar pasar; auth.ts lo resuelve en servidor
        if (!role) {
          return true;
        }

        if (role === "admin" || role === "empleado") {
          return Response.redirect(
            new URL("/admin/dashboard", request.nextUrl),
          );
        }

        return role === "viajero";
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
