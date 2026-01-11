// components/dashboard/team/TeamList.tsx
"use client";

import { useState } from "react";
import { Pencil, Trash2, Shield, ShieldOff } from "lucide-react";
import EditMemberModal from "./EditMemberModal";
import DeleteMemberModal from "./DeleteMemberModal";

interface TeamMember {
  id: string;
  name: string | null;
  email: string;
  role: string;
  twoFactorEnabled: boolean;
}

interface TeamListProps {
  members: TeamMember[];
  currentUserId: string;
  currentUserRole: string;
}

const roleLabels: Record<string, string> = {
  SUPERADMIN: "Super Admin",
  DIRECTEUR: "Directeur",
  GERANT: "Gérant",
  VENDEUR: "Vendeur",
  MAGASINIER: "Magasinier",
};

const roleBadgeColors: Record<string, string> = {
  SUPERADMIN: "badge-error",
  DIRECTEUR: "badge-primary",
  GERANT: "badge-secondary",
  VENDEUR: "badge-info",
  MAGASINIER: "badge-warning",
};

export default function TeamList({
  members,
  currentUserId,
  currentUserRole,
}: TeamListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("ALL");
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [deletingMember, setDeletingMember] = useState<TeamMember | null>(null);

  // Filtrer les membres
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === "ALL" || member.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // Vérifier si l'utilisateur peut modifier/supprimer un membre
  const canModify = (memberRole: string, memberId: string) => {
    // On ne peut pas se modifier/supprimer soi-même
    if (memberId === currentUserId) return false;

    // DIRECTEUR peut modifier tout le monde sauf SUPERADMIN
    if (currentUserRole === "DIRECTEUR") {
      return memberRole !== "SUPERADMIN";
    }

    // GERANT peut modifier VENDEUR et MAGASINIER
    if (currentUserRole === "GERANT") {
      return ["VENDEUR", "MAGASINIER"].includes(memberRole);
    }

    return false;
  };

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body p-6">
        {/* Filtres */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          {/* Recherche */}
          <div className="flex-1">
            <input
              type="search"
              placeholder="Rechercher par nom ou email..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtre par rôle */}
          <select
            className="select select-bordered w-full md:w-48"
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">Tous les rôles</option>
            <option value="DIRECTEUR">Directeur</option>
            <option value="GERANT">Gérant</option>
            <option value="VENDEUR">Vendeur</option>
            <option value="MAGASINIER">Magasinier</option>
          </select>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Membre</th>
                <th>Email</th>
                <th>Rôle</th>
                <th>2FA</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-base-content/60">
                    Aucun membre trouvé
                  </td>
                </tr>
              ) : (
                filteredMembers.map((member) => (
                  <tr key={member.id}>
                    {/* Nom */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-full w-10">
                            <span className="text-sm">
                              {member.name
                                ? member.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase()
                                    .slice(0, 2)
                                : member.email[0].toUpperCase()}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="font-semibold">
                            {member.name || "Sans nom"}
                          </div>
                          {member.id === currentUserId && (
                            <div className="text-xs text-base-content/60">
                              (Vous)
                            </div>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="text-sm">{member.email}</td>

                    {/* Rôle */}
                    <td>
                      <span
                        className={`badge ${
                          roleBadgeColors[member.role] || "badge-ghost"
                        }`}
                      >
                        {roleLabels[member.role] || member.role}
                      </span>
                    </td>

                    {/* 2FA */}
                    <td>
                      {member.twoFactorEnabled ? (
                        <Shield className="w-5 h-5 text-success" />
                      ) : (
                        <ShieldOff className="w-5 h-5 text-base-content/30" />
                      )}
                    </td>

                    {/* Actions */}
                    <td>
                      <div className="flex justify-end gap-2">
                        {canModify(member.role, member.id) ? (
                          <>
                            <button
                              onClick={() => setEditingMember(member)}
                              className="btn btn-ghost btn-sm btn-square"
                              title="Modifier"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeletingMember(member)}
                              className="btn btn-ghost btn-sm btn-square text-error"
                              title="Supprimer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </>
                        ) : (
                          <span className="text-xs text-base-content/40 px-2">
                            {member.id === currentUserId ? "Vous" : "—"}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Résultats */}
        <div className="text-sm text-base-content/60 mt-4">
          {filteredMembers.length} membre{filteredMembers.length > 1 ? "s" : ""}{" "}
          affiché{filteredMembers.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* Modals */}
      {editingMember && (
        <EditMemberModal
          member={editingMember}
          currentUserRole={currentUserRole}
          onClose={() => setEditingMember(null)}
        />
      )}

      {deletingMember && (
        <DeleteMemberModal
          member={deletingMember}
          onClose={() => setDeletingMember(null)}
        />
      )}
    </div>
  );
}