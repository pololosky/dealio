// app/api/users/route.ts
import { auth } from "@/auth";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

// Hiérarchie des rôles (du plus élevé au plus bas)
const roleHierarchy = {
  SUPERADMIN: 5,
  DIRECTEUR: 4,
  GERANT: 3,
  VENDEUR: 2,
  MAGASINIER: 1,
};

// POST - Créer un utilisateur
export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { role: currentRole, tenantId } = session.user;

    // Vérifier que l'utilisateur a les permissions (DIRECTEUR ou GERANT)
    if (!["DIRECTEUR", "GERANT"].includes(currentRole)) {
      return NextResponse.json(
        { error: "Permissions insuffisantes" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { name, email, role, password } = body;

    // Validations
    if (!name || !email || !role || !password) {
      return NextResponse.json(
        { error: "Tous les champs sont obligatoires" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    // Vérifier que le rôle à créer est inférieur au rôle actuel
    const currentRoleLevel =
      roleHierarchy[currentRole as keyof typeof roleHierarchy];
    const targetRoleLevel = roleHierarchy[role as keyof typeof roleHierarchy];

    if (!targetRoleLevel || targetRoleLevel >= currentRoleLevel) {
      return NextResponse.json(
        { error: "Vous ne pouvez pas créer ce rôle" },
        { status: 403 }
      );
    }

    // Vérifier que l'email n'existe pas déjà
    const existingUser = await prisma.user.findFirst({
      where: {
        email: {
          equals: email.toLowerCase(),
          mode: "insensitive",
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Cet email est déjà utilisé" },
        { status: 400 }
      );
    }

    // Créer l'utilisateur
    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role,
        tenantId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    return NextResponse.json(
      { message: "Utilisateur créé avec succès", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    console.error("Erreur création utilisateur:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'utilisateur" },
      { status: 500 }
    );
  }
}

// GET - Lister les utilisateurs (optionnel, pour une future page)
export async function GET(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
    }

    const { tenantId } = session.user;

    const users = await prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        twoFactorEnabled: true,
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Erreur récupération utilisateurs:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des utilisateurs" },
      { status: 500 }
    );
  }
}

