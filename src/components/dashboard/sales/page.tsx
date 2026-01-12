"use client";

import { X, Calendar, User, ShoppingCart, Receipt } from "lucide-react";

interface Product {
  id: string;
  name: string;
}

interface SaleItem {
  id: string;
  quantity: number;
  price: number;
  product: Product;
}

interface Sale {
  id: string;
  totalAmount: number;
  createdAt: Date;
  user: {
    id: string;
    name: string | null;
    email: string;
  };
  items: SaleItem[];
}

interface SaleDetailsModalProps {
  sale: Sale;
  onClose: () => void;
}

export default function SaleDetailsModal({ sale, onClose }: SaleDetailsModalProps) {
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalItems = sale.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-2xl flex items-center gap-2">
              <Receipt className="w-6 h-6" />
              Détails de la vente
            </h3>
            <p className="text-sm text-base-content/60 mt-1 font-mono">
              {sale.id}
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Informations générales */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          {/* Date */}
          <div className="card bg-base-200">
            <div className="card-body p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-base-content/60">Date & Heure</p>
                  <p className="font-semibold">{formatDate(sale.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Vendeur */}
          <div className="card bg-base-200">
            <div className="card-body p-4">
              <div className="flex items-center gap-3">
                <div className="avatar placeholder">
                  <div className="bg-neutral text-neutral-content rounded-full w-10">
                    <span className="text-sm">
                      {(sale.user.name || sale.user.email)[0].toUpperCase()}
                    </span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-base-content/60">Vendeur</p>
                  <p className="font-semibold">
                    {sale.user.name || sale.user.email.split("@")[0]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Liste des articles */}
        <div className="mb-6">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            Articles vendus ({totalItems})
          </h4>
          <div className="card bg-base-200">
            <div className="card-body p-0">
              <table className="table">
                <thead>
                  <tr>
                    <th>Produit</th>
                    <th className="text-center">Quantité</th>
                    <th className="text-right">Prix unitaire</th>
                    <th className="text-right">Sous-total</th>
                  </tr>
                </thead>
                <tbody>
                  {sale.items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-lg w-8">
                              <span className="text-xs">📦</span>
                            </div>
                          </div>
                          <span className="font-medium">{item.product.name}</span>
                        </div>
                      </td>
                      <td className="text-center">
                        <span className="badge badge-primary">
                          ×{item.quantity}
                        </span>
                      </td>
                      <td className="text-right">{item.price.toFixed(2)}€</td>
                      <td className="text-right font-semibold">
                        {(item.price * item.quantity).toFixed(2)}€
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Résumé */}
        <div className="card bg-primary text-primary-content">
          <div className="card-body p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90">Total de la vente</p>
                <p className="text-xs opacity-70 mt-1">
                  {totalItems} article{totalItems > 1 ? "s" : ""}
                </p>
              </div>
              <p className="text-4xl font-bold">{sale.totalAmount.toFixed(2)}€</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="modal-action">
          <button onClick={onClose} className="btn btn-primary">
            Fermer
          </button>
        </div>
      </div>
      <div className="modal-backdrop" onClick={onClose}></div>
    </div>
  );
}