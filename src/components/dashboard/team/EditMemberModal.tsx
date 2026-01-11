import { useState } from "react";
import { X } from "lucide-react";

interface TeamMember {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface EditMemberModalProps {
  member: TeamMember;
  currentUserRole: string;
  onClose: () => void;
}

export default function EditMemberModal({
  member,
  currentUserRole,
  onClose,
}: EditMemberModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const getAvailableRoles = () => {
    if (currentUserRole === "DIRECTEUR") {
      return [
        { value: "GERANT", label: "Gérant" },
        { value: "VENDEUR", label: "Vendeur" },
        { value: "MAGASINIER", label: "Magasinier" },
      ];
    } else if (currentUserRole === "GERANT") {
      return [
        { value: "VENDEUR", label: "Vendeur" },
        { value: "MAGASINIER", label: "Magasinier" },
      ];
    }
    return [];
  };

  const availableRoles = getAvailableRoles();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      role: formData.get("role") as string,
      password: formData.get("password") as string || undefined,
    };

    try {
      const response = await fetch(`/api/users/${member.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de la modification");
      }

      setSuccess("Membre modifié avec succès !");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-2xl">Modifier le membre</h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success mb-4">
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Nom complet *</span>
            </label>
            <input
              type="text"
              name="name"
              defaultValue={member.name || ""}
              placeholder="Jean Dupont"
              className="input input-bordered w-full"
              required
              disabled={loading}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Email *</span>
            </label>
            <input
              type="email"
              name="email"
              defaultValue={member.email}
              placeholder="jean.dupont@exemple.com"
              className="input input-bordered w-full"
              required
              disabled={loading}
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Rôle *</span>
            </label>
            <select
              name="role"
              className="select select-bordered w-full"
              required
              disabled={loading}
              defaultValue={member.role}
            >
              {availableRoles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Nouveau mot de passe (optionnel)
              </span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="Laisser vide pour ne pas changer"
              className="input input-bordered w-full"
              minLength={8}
              disabled={loading}
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Min. 8 caractères si vous souhaitez le modifier
              </span>
            </label>
          </div>

          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={loading}
            >
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Modification...
                </>
              ) : (
                "Enregistrer"
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}