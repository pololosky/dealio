import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import ProductsList from "@/components/dashboard/products/ProductsList";
import AddProductButton from "@/components/dashboard/products/AddProductButton";

export default async function ProductsPage() {
  const session = await auth();

  if (!session?.user?.tenantId) {
    redirect("/login");
  }

  const { tenantId, role } = session.user;

  const products = await prisma.product.findMany({
    where: { tenantId },
    orderBy: { name: "asc" },
  });

  const totalProducts = products.length;
  const inStock = products.filter((p) => p.stock > 0).length;
  const outOfStock = products.filter((p) => p.stock === 0).length;
  const lowStock = products.filter((p) => p.stock > 0 && p.stock < 10).length;

  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { name: true },
  });

  const canModifyStock = ["DIRECTEUR", "GERANT", "MAGASINIER"].includes(role);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Produits</h1>
          <p className="text-base-content/70 mt-1">
            {tenant?.name ?? "Mon commerce"} – {totalProducts} produit
            {totalProducts !== 1 ? "s" : ""}
          </p>
        </div>

        {canModifyStock && <AddProductButton />}
      </div>

      {/* Cartes statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Total Produits"
          value={totalProducts}
          icon="package"
          color="primary"
        />
        <StatCard
          title="En Stock"
          value={inStock}
          icon="check-circle"
          color="success"
        />
        <StatCard
          title="Stock Bas"
          value={lowStock}
          icon="alert-triangle"
          color="warning"
        />
        <StatCard
          title="Rupture"
          value={outOfStock}
          icon="x-circle"
          color="error"
        />
      </div>

      <ProductsList
        products={products}
        currentUserRole={role}
        canModifyStock={canModifyStock}
      />
    </div>
  );
}

type StatCardProps = {
  title: string;
  value: number;
  icon: string;
  color: "primary" | "success" | "warning" | "error";
};

function StatCard({ title, value, icon, color }: StatCardProps) {
  const icons = {
    package: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4",
    "check-circle": "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
    "alert-triangle":
      "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z",
    "x-circle": "M6 18L18 6M6 6l12 12",
  };

  const colors = {
    primary: "text-primary bg-primary/10",
    success: "text-success bg-success/10",
    warning: "text-warning bg-warning/10",
    error: "text-error bg-error/10",
  };

  return (
    <div className="card bg-base-100 shadow-md">
      <div className="card-body p-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="stat-title text-sm">{title}</div>
            <div className="stat-value text-2xl">{value}</div>
          </div>
          <div className={`p-3 rounded-lg ${colors[color]}`}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={icons[icon as keyof typeof icons]}
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
