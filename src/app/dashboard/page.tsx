// app/dashboard/page.tsx
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../lib/prisma";
import StatsCards from "@/components/dashboard/StatsCards";
import RecentSales from "@/components/dashboard/RecentSales";
import TeamStatus from "@/components/dashboard/TeamStatus";

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { tenantId, role } = session.user;

  // Récupérer les statistiques du jour
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [todaySales, totalTransactions, productsCount, activeUsers] =
    await Promise.all([
      // Ventes du jour
      prisma.sale.aggregate({
        where: {
          tenantId,
          createdAt: { gte: today },
        },
        _sum: { totalAmount: true },
      }),

      // Nombre de transactions du jour
      prisma.sale.count({
        where: {
          tenantId,
          createdAt: { gte: today },
        },
      }),

      // Nombre de produits en stock
      prisma.product.count({
        where: {
          tenantId,
          stock: { gt: 0 },
        },
      }),

      // Utilisateurs actifs (connectés dans les dernières 24h)
      prisma.user.count({
        where: {
          tenantId,
          // On considère actif pour cette démo
        },
      }),
    ]);

  // Calcul comparaison avec le mois dernier (simplifié)
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);
  lastMonth.setHours(0, 0, 0, 0);

  const lastMonthSales = await prisma.sale.aggregate({
    where: {
      tenantId,
      createdAt: {
        gte: lastMonth,
        lt: today,
      },
    },
    _sum: { totalAmount: true },
  });

  const salesGrowth =
    lastMonthSales._sum.totalAmount && todaySales._sum.totalAmount
      ? ((todaySales._sum.totalAmount - lastMonthSales._sum.totalAmount) /
          lastMonthSales._sum.totalAmount) *
        100
      : 0;

  // Récupérer les ventes récentes
  const recentSales = await prisma.sale.findMany({
    where: { tenantId },
    include: {
      user: { select: { name: true } },
      items: { select: { quantity: true } },
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Récupérer l'équipe (si DIRECTEUR ou GERANT)
  let teamMembers: any = [];
  if (role === "DIRECTEUR" || role === "GERANT") {
    teamMembers = await prisma.user.findMany({
      where: { tenantId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      take: 5,
    });
  }

  // Récupérer le nom du tenant
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { name: true },
  });

  const stats = {
    todaySales: todaySales._sum.totalAmount || 0,
    salesGrowth: Math.round(salesGrowth),
    transactions: totalTransactions,
    productsInStock: productsCount,
    activeUsers: activeUsers,
    totalUsers: activeUsers, // Pour la démo
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Tableau de Bord</h1>
          <p className="text-base-content/70 mt-1">
            {tenant?.name} - Performance du jour
          </p>
        </div>

        <div className="flex gap-3">
          {(role === "DIRECTEUR" || role === "GERANT") && (
            <button className="btn btn-outline gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
              Gérer l'équipe
            </button>
          )}
          <button className="btn btn-primary gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
            Nouvelle Vente
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards stats={stats} />

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Sales */}
        <div className="lg:col-span-2">
          <RecentSales sales={recentSales} />
        </div>

        {/* Team Status - Takes 1 column */}
        {(role === "DIRECTEUR" || role === "GERANT") && (
          <div>
            <TeamStatus team={teamMembers} />
          </div>
        )}
      </div>
    </div>
  );
}
