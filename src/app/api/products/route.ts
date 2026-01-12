// src/app/api/products/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/auth";        
import { prisma } from "../../../../lib/prisma";

// Pour forcer le rendu dynamique (important si tu as du middleware ou de l'auth)
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: "Non authentifié" },
        { status: 401 }
      );
    }

    const products = await prisma.product.findMany({
      where: { tenantId: session.user.tenantId },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ products }, { status: 200 });
  } catch (error) {
    console.error("[GET /api/products] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur serveur lors de la récupération des produits" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Non authentifié" },
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const { role, tenantId } = session.user;

    if (!["DIRECTEUR", "GERANT", "MAGASINIER"].includes(role)) {
      return NextResponse.json(
        { error: "Permissions insuffisantes" },
        {
          status: 403,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const body = await request.json();
    const { name, price, stock } = body;

    // Validation basique
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Le nom du produit est requis" },
        { status: 400 }
      );
    }

    if (typeof price !== "number" || price <= 0) {
      return NextResponse.json(
        { error: "Le prix doit être un nombre positif" },
        { status: 400 }
      );
    }

    if (typeof stock !== "number" || stock < 0) {
      return NextResponse.json(
        { error: "Le stock doit être un nombre positif ou zéro" },
        { status: 400 }
      );
    }

    // Vérification unicité (insensible à la casse)
    const existing = await prisma.product.findFirst({
      where: {
        tenantId,
        name: { equals: name.trim(), mode: "insensitive" },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Un produit avec ce nom existe déjà" },
        { status: 409 } // 409 Conflict est plus approprié
      );
    }

    // Création
    const product = await prisma.product.create({
      data: {
        name: name.trim(),
        price,
        stock,
        tenantId,
      },
    });

    // Optionnel : invalider le cache des listes de produits
    // revalidatePath("/dashboard/products"); // décommente si tu utilises cette page

    return NextResponse.json(
      { message: "Produit créé", product },
      {
        status: 201,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[POST /api/products] Erreur critique:", error);

    const message =
      error instanceof Error ? error.message : "Erreur serveur inconnue";

    return NextResponse.json(
      { error: `Erreur lors de la création : ${message}` },
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}