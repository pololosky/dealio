"use client";

import { useState } from "react";
import { Pencil, Trash2, Package, AlertTriangle } from "lucide-react";
import EditProductModal from "./EditProductModal";
import DeleteProductModal from "./DeleteProductModal";

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

interface ProductsListProps {
  products: Product[];
  currentUserRole: string;
  canModifyStock: boolean;
}

export default function ProductsList({
  products,
  currentUserRole,
  canModifyStock,
}: ProductsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [stockFilter, setStockFilter] = useState<string>("ALL");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null);

  // Filtrer les produits
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    let matchesStock = true;
    if (stockFilter === "IN_STOCK") {
      matchesStock = product.stock > 0;
    } else if (stockFilter === "OUT_OF_STOCK") {
      matchesStock = product.stock === 0;
    } else if (stockFilter === "LOW_STOCK") {
      matchesStock = product.stock > 0 && product.stock < 10;
    }

    return matchesSearch && matchesStock;
  });

  // Déterminer si on peut supprimer (DIRECTEUR ou GÉRANT)
  const canDelete = ["DIRECTEUR", "GERANT"].includes(currentUserRole);

  // Fonction pour obtenir le badge de stock
  const getStockBadge = (stock: number) => {
    if (stock === 0) {
      return (
        <div className="badge badge-error gap-1">
          <AlertTriangle className="w-3 h-3" />
          Rupture
        </div>
      );
    } else if (stock < 10) {
      return (
        <div className="badge badge-warning gap-1">
          <AlertTriangle className="w-3 h-3" />
          Stock bas
        </div>
      );
    } else {
      return <div className="badge badge-success">En stock</div>;
    }
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
              placeholder="Rechercher un produit..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtre par stock */}
          <select
            className="select select-bordered w-full md:w-48"
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value)}
          >
            <option value="ALL">Tous les stocks</option>
            <option value="IN_STOCK">En stock</option>
            <option value="LOW_STOCK">Stock bas (&lt;10)</option>
            <option value="OUT_OF_STOCK">Rupture</option>
          </select>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>Produit</th>
                <th>Prix unitaire</th>
                <th>Stock</th>
                <th>Statut</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-8 text-base-content/60"
                  >
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Aucun produit trouvé</p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    {/* Nom */}
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar placeholder">
                          <div className="bg-neutral text-neutral-content rounded-lg w-10">
                            <Package className="w-5 h-5" />
                          </div>
                        </div>
                        <div className="font-semibold">{product.name}</div>
                      </div>
                    </td>

                    {/* Prix */}
                    <td className="font-semibold">
                      {product.price.toFixed(2)} FCFA
                    </td>

                    {/* Stock */}
                    <td>
                      <span
                        className={`font-bold text-lg ${
                          product.stock === 0
                            ? "text-error"
                            : product.stock < 10
                            ? "text-warning"
                            : "text-success"
                        }`}
                      >
                        {product.stock}
                      </span>
                      <span className="text-sm text-base-content/60 ml-1">
                        unité{product.stock > 1 ? "s" : ""}
                      </span>
                    </td>

                    {/* Statut */}
                    <td>{getStockBadge(product.stock)}</td>

                    {/* Actions */}
                    <td>
                      <div className="flex justify-end gap-2">
                        {canModifyStock && (
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="btn btn-ghost btn-sm btn-square"
                            title="Modifier"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => setDeletingProduct(product)}
                            className="btn btn-ghost btn-sm btn-square text-error"
                            title="Supprimer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
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
          {filteredProducts.length} produit
          {filteredProducts.length > 1 ? "s" : ""} affiché
          {filteredProducts.length > 1 ? "s" : ""}
        </div>
      </div>

      {/* Modals */}
      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          canModifyStock={canModifyStock}
          onClose={() => setEditingProduct(null)}
        />
      )}

      {deletingProduct && (
        <DeleteProductModal
          product={deletingProduct}
          onClose={() => setDeletingProduct(null)}
        />
      )}
    </div>
  );
}
