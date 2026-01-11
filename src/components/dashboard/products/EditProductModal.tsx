"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface EditProductModalProps {
  product: Product;
  canModifyStock: boolean;
  onClose: () => void;
}

export default function EditProductModal({
  product,
  canModifyStock,
  onClose,
}: EditProductModalProps) {
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

    // Validations
    if (!data.name || data.price <= 0 || data.stock < 0) {
      setError("Veuillez remplir tous les champs correctement");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`/api/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Erreur lors de la modification");
      }

      setSuccess("Produit modifié avec succès !");
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
      <div className="modal-box">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-bold text-2xl">Modifier le produit</h3>
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
              defaultValue={product.name}
              placeholder="Ex: Coca-Cola 33cl"
              className="input input-bordered w-full"
              required
              disabled={loading}
            />
          </div>

          {/* Prix */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">
                Prix unitaire (€) *
              </span>
            </label>
            <input
              type="number"
              name="price"
              defaultValue={product.price}
              placeholder="0.00"
              step="0.01"
              min="0.01"
              className="input input-bordered w-full"
              required
              disabled={loading}
            />
          </div>

          {/* Stock */}
          <div className="form-control">
            <label className="label">
              <span className="label-text font-semibold">Stock *</span>
            </label>
            <input
              type="number"
              name="stock"
              defaultValue={product.stock}
              placeholder="0"
              min="0"
              className="input input-bordered w-full"
              required
              disabled={loading || !canModifyStock}
            />
            {!canModifyStock && (
              <label className="label">
                <span className="label-text-alt text-warning">
                  Vous n'avez pas la permission de modifier le stock
                </span>
              </label>
            )}
          </div>

          {/* Info */}
          {canModifyStock && (
            <div className="alert alert-warning">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="text-sm">
                Modifiez le stock uniquement pour des ajustements d'inventaire
              </span>
            </div>
          )}

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
