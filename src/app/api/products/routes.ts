// app/api/products/route.ts
import { auth } from "@/auth";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user?.id || !session?.user?.tenantId) {
      return NextResponse.json(
        { error: "Vous devez être connecté", code: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    const { role, tenantId } = session.user;

    if (!["DIRECTEUR", "GERANT", "MAGASINIER"].includes(role)) {
      return NextResponse.json(
        {
          error: "Droits insuffisants pour créer un produit",
          code: "FORBIDDEN",
        },
        { status: 403 }
      );
    }

    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Format de données invalide (JSON attendu)" },
        { status: 400 }
      );
    }

    const { name, price, stock } = body;

    if (!name || typeof price !== "number" || typeof stock !== "number") {
      return NextResponse.json(
        {
          error: "Nom, prix et stock sont obligatoires et doivent être valides",
        },
        { status: 400 }
      );
    }

    if (price <= 0) {
      return NextResponse.json(
        { error: "Le prix doit être positif" },
        { status: 400 }
      );
    }

    if (stock < 0) {
      return NextResponse.json(
        { error: "Le stock ne peut pas être négatif" },
        { status: 400 }
      );
    }

    // Vérification unicité du nom (insensible à la casse)
    const existing = await prisma.product.findFirst({
      where: {
        tenantId,
        name: { equals: name, mode: "insensitive" },
      },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Un produit avec ce nom existe déjà dans votre commerce" },
        { status: 409 }
      );
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        price: Number(price),
        stock: Number(stock),
        tenantId,
      },
    });

    return NextResponse.json(
      { message: "Produit créé", product: newProduct },
      { status: 201 }
    );
  } catch (error) {
    console.error("[POST /api/products]", error);
    return NextResponse.json(
      {
        error: "Erreur lors de la création du produit",
        details:
          process.env.NODE_ENV === "development"
            ? (error as Error).message
            : undefined,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.tenantId) {
      return NextResponse.json(
        { error: "Vous devez être connecté" },
        { status: 401 }
      );
    }

    const products = await prisma.product.findMany({
      where: { tenantId: session.user.tenantId },
      orderBy: { name: "asc" },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("[GET /api/products]", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des produits" },
      { status: 500 }
    );
  }
}
