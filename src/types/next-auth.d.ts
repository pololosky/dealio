import { DefaultSession, DefaultUser } from "next-auth";
import { DefaultJWT } from "next-auth/jwt";
import { Role } from "@prisma/client"; // ajuste le chemin si besoin

// Extension pour le modèle User (Prisma + Credentials)
declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: Role;
    tenantId: string;
    twoFactorEnabled: boolean;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      tenantId: string;
      twoFactorEnabled: boolean;
      twoFactorVerified?: boolean; // présent seulement après vérif 2FA
    } & DefaultSession["user"];
  }
}

// Extension JWT (important pour strategy: "jwt")
declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    id: string;
    role: Role;
    tenantId: string;
    twoFactorEnabled: boolean;
    twoFactorVerified?: boolean;
  }
}