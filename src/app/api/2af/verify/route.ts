// app/api/2fa/verify/route.ts
import { auth } from "@/auth";
import { prisma } from "../../../../../lib/prisma";
import { authenticator } from "@otplib/preset-default";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return unauthorized();
  }

  const { token } = await request.json();
  if (typeof token !== "string" || token.length !== 6) {
    return NextResponse.json({ error: "Code invalide" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorSecret: true, twoFactorEnabled: true },
  });

  if (!user?.twoFactorEnabled || !user.twoFactorSecret) {
    return NextResponse.json({ error: "2FA non configuré" }, { status: 400 });
  }

  const isValid = authenticator.check(token, user.twoFactorSecret);

  if (!isValid) {
    return NextResponse.json({ error: "Code incorrect" }, { status: 401 });
  }

  // Option : tu peux régénérer un nouveau token JWT ici si besoin
  // Mais avec jwt strategy, on peut juste retourner success
  // Le middleware ou la page utilisera session.user.twoFactorVerified

  return NextResponse.json({ success: true });
}

function unauthorized() {
  return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
}