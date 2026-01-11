import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface TeamMember {
  id: string;
  name: string | null;
  email: string;
  role: string;
}

interface DeleteMemberModalProps {
  member: TeamMember;
  onClose: () => void;
}

export default function DeleteMemberModal({
  member,
  onClose,
}: DeleteMemberModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/users/${member.id}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de la suppression");
      }

      window.location.reload();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-2xl">Confirmer la suppression</h3>
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

        <div className="alert alert-warning mb-6">
          <AlertTriangle className="w-6 h-6" />
          <div>
            <p className="font-semibold">Action irréversible</p>
            <p className="text-sm">
              Cette action supprimera définitivement le membre et toutes ses
              données associées.
            </p>
          </div>
        </div>

        <div className="bg-base-200 p-4 rounded-lg mb-6">
          <p className="text-sm text-base-content/70 mb-1">Membre à supprimer :</p>
          <p className="font-semibold text-lg">{member.name || member.email}</p>
          <p className="text-sm text-base-content/70">{member.email}</p>
        </div>

        <div className="modal-action">
          <button
            onClick={onClose}
            className="btn btn-ghost"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            onClick={handleDelete}
            className="btn btn-error"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Suppression...
              </>
            ) : (
              "Supprimer définitivement"
            )}
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}