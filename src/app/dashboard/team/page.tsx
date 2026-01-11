// app/dashboard/team/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import TeamList from "@/components/dashboard/team/TeamList";
import AddMemberButton from "@/components/dashboard/team/AddMemberButton";

// Interface locale pour les membres d'équipe
interface TeamMember {
  id: string;
  name: string | null;
  email: string;
  role: string;
  twoFactorEnabled: boolean;
}

export default async function TeamPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { tenantId, role } = session.user;

  // Vérifier les permissions (seuls DIRECTEUR et GERANT peuvent accéder)
  if (!["DIRECTEUR", "GERANT"].includes(role)) {
    redirect("/dashboard");
  }

  // Récupérer tous les membres de l'équipe
  const teamMembers: TeamMember[] = await prisma.user.findMany({
    where: { tenantId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      twoFactorEnabled: true,
    },
  });

  // Récupérer le nom du tenant
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { name: true },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion de l'Équipe</h1>
          <p className="text-base-content/70 mt-1">
            {tenant?.name} - {teamMembers.length} membre
            {teamMembers.length > 1 ? "s" : ""}
          </p>
        </div>

        <AddMemberButton currentUserRole={role} />
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <div className="stat-title text-sm">Total</div>
            <div className="stat-value text-2xl">{teamMembers.length}</div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <div className="stat-title text-sm">Directeurs</div>
            <div className="stat-value text-2xl">
              {teamMembers.filter((m) => m.role === "DIRECTEUR").length}
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <div className="stat-title text-sm">Gérants</div>
            <div className="stat-value text-2xl">
              {teamMembers.filter((m) => m.role === "GERANT").length}
            </div>
          </div>
        </div>
        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <div className="stat-title text-sm">Vendeurs</div>
            <div className="stat-value text-2xl">
              {teamMembers.filter((m) => m.role === "VENDEUR").length}
            </div>
          </div>
        </div>
      </div>

      {/* Liste de l'équipe */}
      <TeamList
        members={teamMembers}
        currentUserId={session.user.id}
        currentUserRole={role}
      />
    </div>
  );
}
