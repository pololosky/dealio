// app/api/users/[id]/route.ts
import { auth } from "@/auth";
import { prisma } from "../../../../../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

const roleHierarchy = {
  SUPERADMIN: 5,
  DIRECTEUR: 4,
  GERANT: 3,
  VENDEUR: 2,
  MAGASINIER: 1,
};

// Fonction helper pour vérifier si on peut modifier un utilisateur
function canModifyUser(currentRole: string, targetRole: string): boolean {
  const currentLevel = roleHierarchy[currentRole as keyof typeof roleHierarchy];
  const targetLevel = roleHierarchy[targetRole as keyof typeof roleHierarchy];
  
  // On peut modifier uniquement si le rôle cible est strictement inférieur
  return currentLevel > targetLevel;
}

// PATCH - Modifier un utilisateur
export async function PATCH(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id: currentUserId, role: currentRole, tenantId } = session.user;
    const { id: userId } = await context.params;

    // On ne peut pas se modifier soi-même
    if (userId === currentUserId) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas vous modifier vous-même" },
        { status: 403 }
      );
    }

    // Vérifier que l'utilisateur à modifier existe et appartient au même tenant
    const targetUser = await prisma.user.findFirst({
      where: {
        id: userId,
        tenantId,
      },
      select: {
        id: true,
        role: true,
        email: true,
        name: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier les permissions
    if (!canModifyUser(currentRole, targetUser.role)) {
      return NextResponse.json(
        { error: `Vous ne pouvez pas modifier cet utilisateur (${targetUser.role})` },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, role, password } = body;

    // Vérifier que le nouveau rôle (si changé) est autorisé
    if (role && !canModifyUser(currentRole, role)) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas attribuer ce rôle" },
        { status: 403 }
      );
    }

    // Vérifier l'unicité de l'email si modifié
    if (email && email.toLowerCase() !== targetUser.email.toLowerCase()) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: {
            equals: email.toLowerCase(),
            mode: "insensitive",
          },
          id: { not: userId },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Cet email est déjà utilisé" },
          { status: 400 }
        );
      }
    }

    // Préparer les données à mettre à jour
    const updateData: any = {};
    if (name) updateData.name = name;
    if (email) updateData.email = email.toLowerCase();
    if (role) updateData.role = role;
    if (password && password.length >= 8) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    // Mettre à jour
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json({
      message: "Utilisateur modifié avec succès",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Erreur modification utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la modification de l'utilisateur" },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un utilisateur
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { id: currentUserId, role: currentRole, tenantId } = session.user;
    const { id: userId } = await context.params;

    // On ne peut pas se supprimer soi-même
    if (userId === currentUserId) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas vous supprimer vous-même" },
        { status: 403 }
      );
    }

    // Vérifier que l'utilisateur à supprimer existe et appartient au même tenant
    const targetUser = await prisma.user.findFirst({
      where: {
        id: userId,
        tenantId,
      },
      select: {
        id: true,
        role: true,
        email: true,
        name: true,
      },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Vérifier les permissions
    if (!canModifyUser(currentRole, targetUser.role)) {
      return NextResponse.json(
        { error: `Vous ne pouvez pas supprimer cet utilisateur (${targetUser.role})` },
        { status: 403 }
      );
    }

    // Supprimer l'utilisateur
    await prisma.user.delete({
      where: { id: userId },
    });

    return NextResponse.json({
      message: "Utilisateur supprimé avec succès",
    });
  } catch (error) {
    console.error("Erreur suppression utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'utilisateur" },
      { status: 500 }
    );
  }
}