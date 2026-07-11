import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@/types/user.types";

function isStaffRole(role: UserRole | undefined): boolean {
  return role === "admin" || role === "empleado";
}

export const authConfig = {
  trustHost: true,
  session: {
    strategy: "jwt",
  },
  pages: {
    // Default para rutas de viajero; /admin/* redirige a /admin/login en authorized
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
      const role = auth?.user?.role as UserRole | undefined;

      // Login staff: público; si ya es staff → dashboard
      if (pathname === "/admin/login") {
        if (isStaffRole(role)) {
          return Response.redirect(
            new URL("/admin/dashboard", request.nextUrl),
          );
        }
        return true;
      }

      // Resto del panel admin: solo staff
      if (pathname.startsWith("/admin")) {
        if (isStaffRole(role)) {
          return true;
        }
        return Response.redirect(new URL("/admin/login", request.nextUrl));
      }

      // Rutas del viajero
      if (
        pathname.startsWith("/planner") ||
        pathname.startsWith("/onboarding") ||
        pathname.startsWith("/mi-perfil")
      ) {
        if (!auth?.user) {
          return false;
        }

        if (!role) {
          return true;
        }

        if (isStaffRole(role)) {
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
