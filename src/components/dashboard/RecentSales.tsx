// components/dashboard/RecentSales.tsx
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface Sale {
  id: string;
  totalAmount: number;
  createdAt: Date;
  user: { name: string | null };
  items: { quantity: number }[];
}

interface RecentSalesProps {
  sales: Sale[];
}

export default function RecentSales({ sales }: RecentSalesProps) {
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffMins < 60) {
      return `Il y a ${diffMins} min`;
    } else if (diffHours < 24) {
      return `Il y a ${diffHours}h`;
    } else {
      return new Date(date).toLocaleDateString("fr-FR");
    }
  };

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="card-title text-xl">Ventes Récentes</h2>
          <Link
            href="/dashboard/sales"
            className="btn btn-ghost btn-sm gap-2 text-primary"
          >
            Voir tout
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {sales.length === 0 ? (
          <div className="text-center py-12 text-base-content/60">
            <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Aucune vente récente</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sales.map((sale) => {
              const totalItems = sale.items.reduce(
                (sum, item) => sum + item.quantity,
                0
              );

              return (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-4 rounded-lg hover:bg-base-200 transition-colors cursor-pointer"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">
                        #{sale.id.slice(0, 10)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-base-content/70">
                      <span>
                        {sale.user.name || "Client Anonyme"} • {totalItems}{" "}
                        article{totalItems > 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {sale.totalAmount.toFixed(2)}€
                    </p>
                    <p className="text-xs text-base-content/60">
                      {formatTimeAgo(sale.createdAt)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function ShoppingCart({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
      />
    </svg>
  );
}