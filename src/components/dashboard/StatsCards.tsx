"use client";

import { useEffect, useState } from "react";
import { Euro, ShoppingCart, Package, Users, Landmark } from "lucide-react";

interface StatsCardsProps {
  stats: {
    todaySales: number;
    salesGrowth: number;
    transactions: number;
    productsInStock: number;
    activeUsers: number;
    totalUsers: number;
  };
}

export default function StatsCards({ stats }: StatsCardsProps) {
  // État pour gérer l'hydratation
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const cards = [
    {
      title: "Ventes du Jour",
      // Utilisation d'une locale fixe pour éviter les écarts serveur/client
      value: `${stats.todaySales.toLocaleString("fr-FR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })} FCFA`,
      change: stats.salesGrowth,
      changeLabel: "vs mois dernier",
      icon: Landmark,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Transactions",
      value: stats.transactions.toLocaleString("fr-FR"),
      change: 12,
      changeLabel: "vs mois dernier",
      icon: ShoppingCart,
      iconBg: "bg-info/10",
      iconColor: "text-info",
    },
    {
      title: "Articles en Stock",
      value: stats.productsInStock.toLocaleString("fr-FR"),
      change: -3,
      changeLabel: "vs mois dernier",
      icon: Package,
      iconBg: "bg-warning/10",
      iconColor: "text-warning",
    },
    {
      title: "Équipe Active",
      value: `${stats.activeUsers}/${stats.totalUsers}`,
      change: null,
      changeLabel: "",
      icon: Users,
      iconBg: "bg-success/10",
      iconColor: "text-success",
    },
  ];

  // Si on est en phase de rendu serveur, on affiche un squelette vide ou des placeholders
  // Cela empêche React de comparer le HTML du serveur avec celui du client
  if (!mounted) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 rounded-xl bg-base-200 animate-pulse"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isPositive = card.change !== null && card.change > 0;
        const isNegative = card.change !== null && card.change < 0;

        return (
          <div
            key={index}
            className="card bg-base-100 shadow-md border border-base-200"
          >
            <div className="card-body p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-base-content/70 text-sm font-medium mb-1">
                    {card.title}
                  </p>
                  <h3 className="text-3xl font-bold tracking-tight">
                    {card.value}
                  </h3>

                  {card.change !== null && (
                    <div className="flex items-center gap-1 mt-2">
                      <span
                        className={`text-sm font-semibold flex items-center ${
                          isPositive
                            ? "text-success"
                            : isNegative
                            ? "text-error"
                            : "text-base-content/70"
                        }`}
                      >
                        {isPositive && "↗"}
                        {isNegative && "↘"}
                        {isPositive ? "+" : ""}
                        {card.change}%
                      </span>
                      <span className="text-xs text-base-content/60">
                        {card.changeLabel}
                      </span>
                    </div>
                  )}
                </div>

                <div className={`p-3 rounded-lg ${card.iconBg}`}>
                  <Icon className={`w-6 h-6 ${card.iconColor}`} />
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
