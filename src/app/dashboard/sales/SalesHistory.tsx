// components/dashboard/sales/SalesHistory.tsx
"use client";

import { useState } from "react";
import { Eye, Download, Calendar, User } from "lucide-react";
import SaleDetailsModal from "@/components/dashboard/sales/page";

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

interface Seller {
  id: string;
  name: string | null;
  email: string;
}

interface SalesHistoryProps {
  sales: Sale[];
  sellers: Seller[];
  currentUserRole: string;
}

export default function SalesHistory({
  sales,
  sellers,
  currentUserRole,
}: SalesHistoryProps) {
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sellerFilter, setSellerFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("ALL");

  // Fonction pour filtrer par date
  const filterByDate = (sale: Sale) => {
    const saleDate = new Date(sale.createdAt);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    switch (dateFilter) {
      case "TODAY":
        return saleDate >= today;
      case "WEEK": {
        const weekAgo = new Date(today);
        weekAgo.setDate(weekAgo.getDate() - 7);
        return saleDate >= weekAgo;
      }
      case "MONTH": {
        const monthAgo = new Date(today);
        monthAgo.setMonth(monthAgo.getMonth() - 1);
        return saleDate >= monthAgo;
      }
      default:
        return true;
    }
  };

  // Filtrer les ventes
  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sale.user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSeller =
      sellerFilter === "ALL" || sale.user.id === sellerFilter;

    const matchesDate = filterByDate(sale);

    return matchesSearch && matchesSeller && matchesDate;
  });

  // Fonction pour formater la date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Fonction pour exporter en CSV
  const exportToCSV = () => {
    const headers = [
      "ID",
      "Date",
      "Vendeur",
      "Montant",
      "Nombre d'articles",
      "Produits",
    ];

    const rows = filteredSales.map((sale) => [
      sale.id.substring(0, 8),
      formatDate(sale.createdAt),
      sale.user.name || sale.user.email,
      `${sale.totalAmount.toFixed(2)}€`,
      sale.items.reduce((sum, item) => sum + item.quantity, 0),
      sale.items.map((item) => `${item.product.name} (x${item.quantity})`).join("; "),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `ventes_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body p-6">
        {/* Filtres */}
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          {/* Recherche */}
          <div className="flex-1">
            <input
              type="search"
              placeholder="Rechercher par ID, vendeur..."
              className="input input-bordered w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtre par vendeur */}
          <select
            className="select select-bordered w-full lg:w-48"
            value={sellerFilter}
            onChange={(e) => setSellerFilter(e.target.value)}
          >
            <option value="ALL">Tous les vendeurs</option>
            {sellers.map((seller) => (
              <option key={seller.id} value={seller.id}>
                {seller.name || seller.email}
              </option>
            ))}
          </select>

          {/* Filtre par date */}
          <select
            className="select select-bordered w-full lg:w-48"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="ALL">Toutes les dates</option>
            <option value="TODAY">Aujourd'hui</option>
            <option value="WEEK">7 derniers jours</option>
            <option value="MONTH">30 derniers jours</option>
          </select>

          {/* Bouton Export */}
          <button
            onClick={exportToCSV}
            className="btn btn-outline gap-2"
            disabled={filteredSales.length === 0}
          >
            <Download className="w-4 h-4" />
            Exporter CSV
          </button>
        </div>

        {/* Tableau */}
        <div className="overflow-x-auto">
          <table className="table table-zebra">
            <thead>
              <tr>
                <th>ID Vente</th>
                <th>Date & Heure</th>
                <th>Vendeur</th>
                <th>Articles</th>
                <th>Montant</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSales.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-base-content/60">
                    <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Aucune vente trouvée</p>
                  </td>
                </tr>
              ) : (
                filteredSales.map((sale) => {
                  const totalItems = sale.items.reduce(
                    (sum, item) => sum + item.quantity,
                    0
                  );

                  return (
                    <tr key={sale.id}>
                      {/* ID */}
                      <td>
                        <span className="font-mono text-sm">
                          {sale.id.substring(0, 8)}
                        </span>
                      </td>

                      {/* Date */}
                      <td>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-base-content/40" />
                          <span className="text-sm">
                            {formatDate(sale.createdAt)}
                          </span>
                        </div>
                      </td>

                      {/* Vendeur */}
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="avatar placeholder">
                            <div className="bg-neutral text-neutral-content rounded-full w-8">
                              <span className="text-xs">
                                {(sale.user.name || sale.user.email)[0].toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <span className="text-sm">
                            {sale.user.name || sale.user.email.split("@")[0]}
                          </span>
                        </div>
                      </td>

                      {/* Nombre d'articles */}
                      <td>
                        <span className="badge badge-ghost">
                          {totalItems} article{totalItems > 1 ? "s" : ""}
                        </span>
                      </td>

                      {/* Montant */}
                      <td>
                        <span className="font-bold text-lg text-success">
                          {sale.totalAmount} FCFA
                        </span>
                      </td>

                      {/* Actions */}
                      <td>
                        <div className="flex justify-end">
                          <button
                            onClick={() => setSelectedSale(sale)}
                            className="btn btn-ghost btn-sm gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Détails
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Résultats */}
        <div className="flex justify-between items-center mt-4 text-sm text-base-content/60">
          <span>
            {filteredSales.length} vente{filteredSales.length > 1 ? "s" : ""}{" "}
            affichée{filteredSales.length > 1 ? "s" : ""}
          </span>
          {filteredSales.length > 0 && (
            <span>
              Total:{" "}
              <span className="font-bold text-success">
                {filteredSales
                  .reduce((sum, sale) => sum + sale.totalAmount, 0)}
                FCFA
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Modal détails */}
      {selectedSale && (
        <SaleDetailsModal sale={selectedSale} onClose={() => setSelectedSale(null)} />
      )}
    </div>
  );
}