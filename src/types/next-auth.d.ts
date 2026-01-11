// types/next-auth.d.ts

import { DefaultSession, DefaultUser } from "next-auth";
import type { AdapterUser as BaseAdapterUser } from "@auth/core/adapters";

// On étend le AdapterUser de base
declare module "@auth/core/adapters" {
  interface AdapterUser extends BaseAdapterUser {
    role: string;
    tenantId: string;
  }
}
// On étend les types "classiques" de next-auth
declare module "next-auth" {
  interface User extends DefaultUser {
    id: string;
    role: string;
    tenantId: string;
  }

  interface Session {
    user: {
      id: string;
      role: string;
      tenantId: string;
    } & DefaultSession["user"];
  }
}

// JWT
declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
    tenantId: string;
  }
}
