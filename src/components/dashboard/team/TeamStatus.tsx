// components/dashboard/TeamStatus.tsx
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface TeamMember {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface TeamStatusProps {
  team: TeamMember[];
}

// Mapping des rôles en français
const roleLabels: Record<string, string> = {
  SUPERADMIN: "Super Admin",
  DIRECTEUR: "Directeur",
  GERANT: "Gérant",
  VENDEUR: "Vendeur",
  MAGASINIER: "Magasinier",
};

// Couleurs selon le rôle
const roleColors: Record<string, string> = {
  SUPERADMIN: "bg-error text-error-content",
  DIRECTEUR: "bg-primary text-primary-content",
  GERANT: "bg-secondary text-secondary-content",
  VENDEUR: "bg-info text-info-content",
  MAGASINIER: "bg-warning text-warning-content",
};

export default function TeamStatus({ team }: TeamStatusProps) {
  // Simuler le statut "en ligne" (à remplacer par une vraie logique)
  const getOnlineStatus = () => Math.random() > 0.5;

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title text-xl">Équipe</h2>
          <Link
            href="/dashboard/team"
            className="btn btn-ghost btn-sm gap-2 text-primary"
          >
            Gérer
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {team.length === 0 ? (
          <div className="text-center py-12 text-base-content/60">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-12 h-12 mx-auto mb-3 opacity-50"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            <p>Aucun membre d'équipe</p>
          </div>
        ) : (
          <div className="space-y-3">
            {team.map((member) => {
              const isOnline = getOnlineStatus();
              const initials = member.name
                ? member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2)
                : member.email[0].toUpperCase();

              return (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-base-200 transition-colors"
                >
                  {/* Avatar */}
                  <div className="avatar placeholder relative">
                    <div
                      className={`w-10 h-10 rounded-full ${
                        roleColors[member.role] ||
                        "bg-neutral text-neutral-content"
                      }`}
                    >
                      <span className="text-sm font-bold">{initials}</span>
                    </div>
                    {/* Indicateur en ligne */}
                    <span
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-base-100 ${
                        isOnline ? "bg-success" : "bg-base-300"
                      }`}
                    ></span>
                  </div>

                  {/* Infos */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">
                      {member.name || member.email.split("@")[0]}
                    </p>
                    <p className="text-xs text-base-content/70 capitalize">
                      {roleLabels[member.role] || member.role}
                    </p>
                  </div>

                  {/* Statut */}
                  <div className="text-right">
                    <span
                      className={`text-xs font-medium ${
                        isOnline ? "text-success" : "text-base-content/60"
                      }`}
                    >
                      {isOnline ? "En ligne" : "Hors ligne"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
