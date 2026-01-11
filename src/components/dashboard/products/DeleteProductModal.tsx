// components/dashboard/products/DeleteProductModal.tsx
"use client";

import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface DeleteProductModalProps {
  product: Product;
  onClose: () => void;
}

export default function DeleteProductModal({
  product,
  onClose,
}: DeleteProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/products/${product.id}`, {
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
              Cette action supprimera définitivement le produit et son historique de ventes.
            </p>
          </div>
        </div>

        <div className="bg-base-200 p-4 rounded-lg mb-6">
          <p className="text-sm text-base-content/70 mb-2">Produit à supprimer :</p>
          <p className="font-semibold text-lg">{product.name}</p>
          <div className="flex gap-4 mt-2 text-sm">
            <p>
              <span className="text-base-content/70">Prix :</span>{" "}
              <span className="font-semibold">{product.price.toFixed(2)}€</span>
            </p>
            <p>
              <span className="text-base-content/70">Stock :</span>{" "}
              <span className="font-semibold">{product.stock}</span>
            </p>
          </div>
        </div>

        <div className="modal-action">
          <button onClick={onClose} className="btn btn-ghost" disabled={loading}>
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