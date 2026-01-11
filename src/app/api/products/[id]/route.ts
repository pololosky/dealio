import { auth } from "@/auth";
import { prisma } from "../../../../../lib/prisma";
import { NextResponse } from "next/server";

// PATCH - Modifier un produit
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { role, tenantId } = session.user;
    const { id: productId } = await context.params;

    // Vérifier que le produit existe et appartient au tenant
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        tenantId,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    const body = await req.json();
    const { name, price, stock } = body;

    // Validations
    if (typeof price === "number" && price <= 0) {
      return NextResponse.json(
        { error: "Le prix doit être supérieur à 0" },
        { status: 400 }
      );
    }

    if (typeof stock === "number" && stock < 0) {
      return NextResponse.json(
        { error: "Le stock ne peut pas être négatif" },
        { status: 400 }
      );
    }

    // Vérifier les permissions pour modifier le stock
    // Seuls DIRECTEUR, GÉRANT et MAGASINIER peuvent modifier le stock
    const canModifyStock = ["DIRECTEUR", "GERANT", "MAGASINIER"].includes(role);

    if (typeof stock === "number" && !canModifyStock) {
      return NextResponse.json(
        { error: "Vous n'avez pas la permission de modifier le stock" },
        { status: 403 }
      );
    }

    // Vérifier l'unicité du nom si modifié
    if (name && name !== product.name) {
      const existingProduct = await prisma.product.findFirst({
        where: {
          tenantId,
          name: {
            equals: name,
            mode: "insensitive",
          },
          id: { not: productId },
        },
      });

      if (existingProduct) {
        return NextResponse.json(
          { error: "Un produit avec ce nom existe déjà" },
          { status: 400 }
        );
      }
    }

    // Préparer les données à mettre à jour
    const updateData: any = {};
    if (name) updateData.name = name;
    if (typeof price === "number") updateData.price = price;
    if (typeof stock === "number" && canModifyStock) updateData.stock = stock;

    // Mettre à jour
    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    return NextResponse.json({
      message: "Produit modifié avec succès",
      product: updatedProduct,
    });
  } catch (error) {
    console.error("Erreur modification produit:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification du produit" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un produit
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { role, tenantId } = session.user;
    const { id: productId } = await context.params;

    // Vérifier les permissions (DIRECTEUR ou GÉRANT uniquement)
    if (!["DIRECTEUR", "GERANT"].includes(role)) {
      return NextResponse.json(
        { error: "Seuls les directeurs et gérants peuvent supprimer des produits" },
        { status: 403 }
      );
    }

    // Vérifier que le produit existe et appartient au tenant
    const product = await prisma.product.findFirst({
      where: {
        id: productId,
        tenantId,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    // Supprimer le produit (cascade supprimera aussi les SaleItems associés)
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({
      message: "Produit supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur suppression produit:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression du produit" },
      { status: 500 }
    );
  }
}