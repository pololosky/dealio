// app/dashboard/sales/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import SalesHistory from "./SalesHistory";

export default async function SalesPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { tenantId, role } = session.user;

  // Accessible par tous sauf MAGASINIER
  if (role === "MAGASINIER") {
    redirect("/dashboard");
  }

  // Récupérer toutes les ventes avec détails
  const sales = await prisma.sale.findMany({
    where: { tenantId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  // Statistiques
  const totalSales = sales.length;
  const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
  const totalItemsSold = sales.reduce(
    (sum, sale) => sum + sale.items.reduce((s, item) => s + item.quantity, 0),
    0
  );

  // Vente moyenne
  const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Récupérer la liste des vendeurs pour le filtre
  const sellers = await prisma.user.findMany({
    where: {
      tenantId,
      role: { in: ["DIRECTEUR", "GERANT", "VENDEUR"] },
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  // Récupérer le nom du tenant
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { name: true },
  });

  const stats = {
    totalSales,
    totalRevenue,
    totalItemsSold,
    averageSale,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Historique des Ventes</h1>
        <p className="text-base-content/70 mt-1">
          {tenant?.name} - {totalSales} vente{totalSales > 1 ? "s" : ""}{" "}
          enregistrée
          {totalSales > 1 ? "s" : ""}
        </p>
      </div>

      {/* Stats rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="stat-title text-sm">Total Ventes</div>
                <div className="stat-value text-2xl">{totalSales}</div>
              </div>
              <div className="p-3 bg-primary/10 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="stat-title text-sm">Chiffre d'Affaires</div>
                <div className="stat-value text-2xl text-success">
                  {totalRevenue} FCFA
                </div>
              </div>
              <div className="p-3 bg-success/10 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-success"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="stat-title text-sm">Articles Vendus</div>
                <div className="stat-value text-2xl text-info">
                  {totalItemsSold}
                </div>
              </div>
              <div className="p-3 bg-info/10 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-info"
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
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-base-100 shadow-md">
          <div className="card-body p-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="stat-title text-sm">Panier Moyen</div>
                <div className="stat-value text-2xl text-warning">
                  {averageSale} FCFA
                </div>
              </div>
              <div className="p-3 bg-warning/10 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-warning"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Historique des ventes */}
      <SalesHistory sales={sales} sellers={sellers} currentUserRole={role} />
    </div>
  );
}
