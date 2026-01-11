import { useState } from "react";
import { X } from "lucide-react";

interface AddMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserRole: string;
}

export default function AddMemberModal({
  isOpen,
  onClose,
  currentUserRole,
}: AddMemberModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Déterminer les rôles disponibles selon le rôle de l'utilisateur connecté
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
      password: formData.get("password") as string,
    };

    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de la création");
      }

      setSuccess("Membre ajouté avec succès !");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-2xl">Ajouter un membre</h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
            disabled={loading}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts */}
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nom complet */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Nom complet *</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Jean Dupont"
              className="input input-bordered w-full"
              required
              disabled={loading}
            />
          </div>

          {/* Email */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Email *</span>
            </label>
            <input
              type="email"
              name="email"
              placeholder="jean.dupont@exemple.com"
              className="input input-bordered w-full"
              required
              disabled={loading}
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                L'email doit être unique
              </span>
            </label>
          </div>

          {/* Rôle */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Rôle *</span>
            </label>
            <select
              name="role"
              className="select select-bordered w-full"
              required
              disabled={loading}
              defaultValue=""
            >
              <option value="" disabled>
                Sélectionner un rôle
              </option>
              {availableRoles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Vous ne pouvez créer que des rôles inférieurs au vôtre
              </span>
            </label>
          </div>

          {/* Mot de passe */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Mot de passe temporaire * (min. 8 caractères)
              </span>
            </label>
            <input
              type="password"
              name="password"
              placeholder="••••••••"
              className="input input-bordered w-full"
              required
              minLength={8}
              disabled={loading}
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                L'utilisateur devra changer ce mot de passe à sa première connexion
              </span>
            </label>
          </div>

          {/* Informations sur les permissions */}
          <div className="alert alert-info">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div className="text-sm">
              <p className="font-semibold mb-1">Permissions des rôles :</p>
              <ul className="list-disc list-inside space-y-1 text-xs">
                <li>
                  <strong>Gérant</strong> : Gestion équipe (vendeurs/magasiniers),
                  produits, ventes
                </li>
                <li>
                  <strong>Vendeur</strong> : Caisse, consultation stocks
                </li>
                <li>
                  <strong>Magasinier</strong> : Gestion complète des stocks
                </li>
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-action">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-ghost"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Création en cours...
                </>
              ) : (
                "Créer le membre"
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}