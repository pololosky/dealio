// components/dashboard/StatsCards.tsx
import { Euro, ShoppingCart, Package, Users } from "lucide-react";

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
  const cards = [
    {
      title: "Ventes du Jour",
      value: `${stats.todaySales.toFixed(2)} FCFA`,
      change: stats.salesGrowth,
      changeLabel: "vs mois dernier",
      icon: Euro,
      iconBg: "bg-primary/10",
      iconColor: "text-primary",
    },
    {
      title: "Transactions",
      value: stats.transactions,
      change: null,
      changeLabel: "",
      icon: ShoppingCart,
      iconBg: "bg-info/10",
      iconColor: "text-info",
    },
    {
      title: "Articles en Stock",
      value: stats.productsInStock.toLocaleString(),
      change: null,
      changeLabel: "",
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        const isPositive = card.change && card.change > 0;
        const isNegative = card.change && card.change < 0;

        return (
          <div key={index} className="card bg-base-100 shadow-md">
            <div className="card-body p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-base-content/70 text-sm font-medium mb-1">
                    {card.title}
                  </p>
                  <h3 className="text-3xl font-bold">{card.value}</h3>

                  {card.change !== null && (
                    <div className="flex items-center gap-1 mt-2">
                      <span
                        className={`text-sm font-semibold ${
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
