// app/api/sales/route.ts
import { auth } from "@/auth";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

// POST - Créer une vente (TRANSACTION ATOMIQUE)
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id: userId, role, tenantId } = session.user;

    // Vérifier les permissions (DIRECTEUR, GÉRANT ou VENDEUR)
    if (!["DIRECTEUR", "GERANT", "VENDEUR"].includes(role)) {
      return NextResponse.json(
        { error: "Permissions insuffisantes" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { items } = body;

    // Validations
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Le panier ne peut pas être vide" },
        { status: 400 }
      );
    }

    // Vérifier que tous les items ont les champs requis
    for (const item of items) {
      if (!item.productId || !item.quantity || !item.price) {
        return NextResponse.json(
          { error: "Données de produit invalides" },
          { status: 400 }
        );
      }

      if (item.quantity <= 0) {
        return NextResponse.json(
          { error: "La quantité doit être supérieure à 0" },
          { status: 400 }
        );
      }
    }

    // TRANSACTION ATOMIQUE
    // Tout doit réussir ou tout échoue
    const result = await prisma.$transaction(async (tx) => {
      // 1. Vérifier que tous les produits existent et appartiennent au tenant
      const productIds = items.map((item) => item.productId);
      const products = await tx.product.findMany({
        where: {
          id: { in: productIds },
          tenantId,
        },
      });

      if (products.length !== items.length) {
        throw new Error("Un ou plusieurs produits sont introuvables");
      }

      // 2. Vérifier le stock disponible pour chaque produit
      for (const item of items) {
        const product = products.find((p) => p.id === item.productId);
        if (!product) {
          throw new Error(`Produit ${item.productId} introuvable`);
        }

        if (product.stock < item.quantity) {
          throw new Error(
            `Stock insuffisant pour ${product.name}. Disponible: ${product.stock}, Demandé: ${item.quantity}`
          );
        }
      }

      // 3. Calculer le montant total
      const totalAmount = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
      );

      // 4. Créer la vente
      const sale = await tx.sale.create({
        data: {
          totalAmount,
          tenantId,
          userId,
          items: {
            create: items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
        include: {
          items: {
            include: {
              product: true,
            },
          },
        },
      });

      // 5. Déduire le stock de chaque produit
      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      return sale;
    });

    return NextResponse.json(
      {
        message: "Vente enregistrée avec succès",
        sale: result,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Erreur création vente:", error);

    // Retourner un message d'erreur spécifique si possible
    const errorMessage =
      error.message || "Erreur lors de la création de la vente";

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// GET - Lister les ventes
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { tenantId } = session.user;

    const sales = await prisma.sale.findMany({
      where: { tenantId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 50, // Limiter à 50 ventes récentes
    });

    return NextResponse.json({ sales });
  } catch (error) {
    console.error("Erreur récupération ventes:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des ventes" },
      { status: 500 }
    );
  }
}
