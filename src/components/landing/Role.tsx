import { Crown, Briefcase, Store, ShoppingBag, Package } from "lucide-react";

const roles = [
  {
    icon: Crown,
    title: "Superadmin",
    route: "/superadmin",
    description:
      "Vision globale de tous les commerces, gestion des abonnements et statistiques agrégées.",
    permissions: [
      "Vue globale",
      "Création d'espaces",
      "Gestion abonnements",
      "Statistiques globales",
    ],
  },
  {
    icon: Briefcase,
    title: "Directeur",
    route: "/admin",
    description:
      "Gère son commerce, son équipe et accède aux rapports détaillés de son activité.",
    permissions: [
      "Gestion équipe",
      "Rapports ventes",
      "Configuration boutique",
      "Gestion produits",
    ],
  },
  {
    icon: Store,
    title: "Gérant",
    route: "/app",
    description:
      "Supervise les opérations quotidiennes du magasin et gère le personnel.",
    permissions: [
      "Supervision ventes",
      "Gestion horaires",
      "Rapports journaliers",
      "Support vendeurs",
    ],
  },
  {
    icon: ShoppingBag,
    title: "Vendeur",
    route: "/app",
    description:
      "Interface de caisse optimisée pour les ventes rapides et le service client.",
    permissions: [
      "Point de vente",
      "Consultation stock",
      "Encaissements",
      "Fidélité client",
    ],
  },
  {
    icon: Package,
    title: "Magasinier",
    route: "/app",
    description: "Gestion complète des stocks, réceptions et inventaires.",
    permissions: [
      "Gestion stock",
      "Réceptions",
      "Inventaires",
      "Alertes rupture",
    ],
  },
];

export const Role = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Un espace pour chaque rôle
          </h2>
          <p className="text-lg text-gray-400">
            Interfaces adaptées aux besoins spécifiques de chaque membre de
            votre équipe.
          </p>
        </div>

        {/* Roles Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {roles.map((role, index) => (
            <div
              key={index}
              className="hover:shadow-2xl rounded-xl border border-gray-300 transition-all duration-300 p-8 relative overflow-hidden group"
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 from-primary/5 to-transparent rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Icon */}
              <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center mb-6 shadow-lg">
                <role.icon className="h-7 w-7 text-white" />
              </div>

              {/* Content */}
              <h3 className="font-bold text-xl mb-2">{role.title}</h3>
              <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
                {role.description}
              </p>

              {/* Permissions */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  Permissions
                </div>
                <div className="flex flex-wrap gap-2">
                  {role.permissions.map((permission, pIndex) => (
                    <span
                      key={pIndex}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-gray-300/40 text-xs font-medium"
                    >
                      {permission}
                    </span>
                  ))}
                </div>
              </div>

              {/* Route indicator */}
              <div className="mt-6 pt-4 border-t border-border">
                <code className="text-xs text-muted-foreground font-mono">
                  {role.route}/*
                </code>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
