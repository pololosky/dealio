import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { prisma } from "../../../../lib/prisma";
import POSInterface from "@/components/dashboard/pos/POSInterface";

export default async function POSPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const { tenantId, role, id: userId } = session.user;

  // Seuls DIRECTEUR, GÉRANT et VENDEUR peuvent accéder à la caisse
  if (!["DIRECTEUR", "GERANT", "VENDEUR"].includes(role)) {
    redirect("/dashboard");
  }

  // Récupérer tous les produits en stock
  const products = await prisma.product.findMany({
    where: { 
      tenantId,
      stock: { gt: 0 } // Uniquement les produits en stock
    },
    orderBy: { name: "asc" },
  });

  // Récupérer le nom du tenant
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { name: true },
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Caisse</h1>
        <p className="text-base-content/70 mt-1">
          {tenant?.name} - Point de vente
        </p>
      </div>

      {/* Interface de caisse */}
      <POSInterface products={products} userId={userId} />
    </div>
  );
}