// app/api/2fa/setup/route.ts
import { auth } from "@/auth";
import { prisma } from "../../../../../lib/prisma";
import { authenticator } from "@otplib/preset-default";
import * as qrcode from "qrcode";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { email: true, twoFactorEnabled: true, twoFactorSecret: true },
  });

  if (!user) {
    return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
  }

  if (user.twoFactorEnabled) {
    return NextResponse.json({ error: "2FA déjà activé" }, { status: 400 });
  }

  let secret = user.twoFactorSecret;

  if (!secret) {
    secret = authenticator.generateSecret(); // 32 chars base32
    await prisma.user.update({
      where: { id: session.user.id },
      data: { twoFactorSecret: secret },
    });
  }

  // URI compatible Google Authenticator
  const otpauthUri = authenticator.keyuri(
    user.email,                // account name
    "Votre Commerce",          // issuer / app name
    secret
  );

  const qrCodeDataUrl = await qrcode.toDataURL(otpauthUri);

  return NextResponse.json({
    secret,                    // pour affichage manuel si besoin
    qrCodeDataUrl,
  });
}