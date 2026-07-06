import type { NextAuthConfig } from "next-auth";
import type { UserRole } from "@/types/user.types";

export const authConfig = {
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const { pathname } = request.nextUrl;

      if (!pathname.startsWith("/admin")) {
        return true;
      }

      const role = auth?.user?.role as UserRole | undefined;
      return role === "admin" || role === "empleado";
    },
  },
} satisfies NextAuthConfig;
