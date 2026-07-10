import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { getDb } from "@/lib/mongodb";
import { authConfig } from "@/lib/auth.config";
import { loginSchema } from "@/lib/validators/auth.schema";
import type { UserDocument, UserRole } from "@/types/user.types";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const db = await getDb();
        const user = await db
          .collection<UserDocument>("users")
          .findOne({ email: parsed.data.email });

        if (!user?.password_hash) {
          return null;
        }

        const passwordMatch = await bcrypt.compare(
          parsed.data.password,
          user.password_hash,
        );

        if (!passwordMatch) {
          return null;
        }

        // Solo admin y empleado acceden por credenciales al panel interno
        if (user.role !== "admin" && user.role !== "empleado") {
          return null;
        }

        await db
          .collection<UserDocument>("users")
          .updateOne(
            { _id: user._id },
            { $set: { last_login: new Date() } },
          );

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async signIn({ user, account, profile }) {
      if (account?.provider !== "google" || !user.email) {
        return true;
      }

      const db = await getDb();
      const existing = await db
        .collection<UserDocument>("users")
        .findOne({ email: user.email });

      if (!existing) {
        const now = new Date();
        await db.collection("users").insertOne({
          name: user.name ?? (profile?.name as string | undefined) ?? "Viajero",
          email: user.email,
          role: "viajero",
          visited_places: [],
          saved_itineraries: [],
          created_at: now,
          last_login: now,
        });
      } else {
        await db
          .collection<UserDocument>("users")
          .updateOne(
            { email: user.email },
            { $set: { last_login: new Date() } },
          );
      }

      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id ?? token.sub ?? "";
        if (user.role) {
          token.role = user.role;
        }
      }

      // Google OAuth no trae role — siempre resolver desde MongoDB
      if (token.email && (!token.role || account?.provider === "google")) {
        const db = await getDb();
        const dbUser = await db
          .collection<UserDocument>("users")
          .findOne({ email: token.email });

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.role = dbUser.role;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
});
