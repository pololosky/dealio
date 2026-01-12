// app/api/2fa/activate/route.ts
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
  if (typeof token !== "string" || token.length !== 6 || !/^\d{6}$/.test(token)) {
    return NextResponse.json({ error: "Code invalide (6 chiffres requis)" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { twoFactorSecret: true },
  });

  if (!user?.twoFactorSecret) {
    return NextResponse.json({ error: "Aucun secret 2FA configuré" }, { status: 400 });
  }

  const isValid = authenticator.check(token, user.twoFactorSecret);

  if (!isValid) {
    return NextResponse.json({ error: "Code incorrect" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { twoFactorEnabled: true },
  });

  return NextResponse.json({ success: true, message: "2FA activé avec succès" });
}

function unauthorized() {
  return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
}