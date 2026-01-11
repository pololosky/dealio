// components/dashboard/products/AddProductModal.tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddProductModal({ isOpen, onClose }: AddProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formData = new FormData(e.currentTarget);
    const data = {
      name: formData.get("name") as string,
      price: parseFloat(formData.get("price") as string),
      stock: parseInt(formData.get("stock") as string),
    };

    // Validations côté client
    if (!data.name || data.price <= 0 || data.stock < 0) {
      setError("Veuillez remplir tous les champs correctement");
      setLoading(false);
      return;
    }

    console.log("Envoi des données:", data);

    try {
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers.get("content-type"));

      // Vérifier si la réponse est du JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        console.error("Réponse non-JSON reçue:", text.substring(0, 500));
        throw new Error("Le serveur a retourné une réponse invalide");
      }

      const result = await response.json();
      console.log("Result:", result);

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de la création");
      }

      setSuccess("Produit créé avec succès !");
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err: any) {
      console.error("Erreur complète:", err);
      setError(err.message || "Une erreur inattendue est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal modal-open">
      <div className="modal-box">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-2xl">Ajouter un produit</h3>
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
          {/* Nom du produit */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Nom du produit *</span>
            </label>
            <input
              type="text"
              name="name"
              placeholder="Ex: Coca-Cola 33cl"
              className="input input-bordered w-full"
              required
              disabled={loading}
            />
          </div>

          {/* Prix */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Prix unitaire (€) *</span>
            </label>
            <input
              type="number"
              name="price"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className="input input-bordered w-full"
              required
              disabled={loading}
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Prix de vente du produit
              </span>
            </label>
          </div>

          {/* Stock initial */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Stock initial *</span>
            </label>
            <input
              type="number"
              name="stock"
              placeholder="0"
              min="0"
              className="input input-bordered w-full"
              required
              disabled={loading}
            />
            <label className="label">
              <span className="label-text-alt text-base-content/60">
                Quantité disponible en inventaire
              </span>
            </label>
          </div>

          {/* Info */}
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
            <span className="text-sm">
              Le stock sera automatiquement déduit lors de chaque vente
            </span>
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
                  Création...
                </>
              ) : (
                "Créer le produit"
              )}
            </button>
          </div>
        </form>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}