
// src/auth.ts
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "../lib/prisma"; // ajuste le chemin
import bcrypt from "bcryptjs";
import type { Adapter } from "@auth/core/adapters"; // ← Import clé pour le cast

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma) as any,

  providers: [
    CredentialsProvider({
      name: "Identifiants",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          });

          if (!user || !user.password) return null;

          const isValid = await bcrypt.compare(
            credentials.password as string,
            user.password
          );

          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            tenantId: user.tenantId,
            twoFactorEnabled: user.twoFactorEnabled,
          };
        } catch (err) {
          console.error("Erreur authorize :", err);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 jours
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tenantId = user.tenantId;
        token.twoFactorEnabled = user.twoFactorEnabled;
        token.twoFactorVerified = false; // reset à chaque login
      }
      return token;
    },

    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.tenantId = token.tenantId as string;
        session.user.twoFactorEnabled = token.twoFactorEnabled as boolean;
        session.user.twoFactorVerified = token.twoFactorVerified as boolean;
      }
      return session;
    },

    authorized({ request, auth }) {
      const pathname = request?.nextUrl?.pathname;
      if (pathname?.startsWith("/api/")) return true;
      return !!auth?.user;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login?error=Erreur d'authentification",
  },

  secret: process.env.AUTH_SECRET!,

  debug: process.env.NODE_ENV === "development",
});
