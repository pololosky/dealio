import {
  BarChart3,
  Users,
  ShoppingCart,
  Shield,
  Zap,
  Building2,
  Clock,
  Lock,
} from "lucide-react";

const features = [
  {
    icon: Building2,
    title: "Multi-Tenant",
    description:
      "Chaque commerce dispose de son propre espace isolé et sécurisé.",
  },
  {
    icon: Users,
    title: "Gestion d'équipe",
    description:
      "Gérez vos directeurs, gérants, vendeurs et magasiniers avec des rôles précis.",
  },
  {
    icon: ShoppingCart,
    title: "Caisse temps réel",
    description:
      "Interface de vente intuitive avec mise à jour instantanée des stocks.",
  },
  {
    icon: BarChart3,
    title: "Tableaux de bord",
    description:
      "Visualisez vos KPIs, chiffre d'affaires et statistiques en un coup d'œil.",
  },
  {
    icon: Shield,
    title: "Sécurité avancée",
    description:
      "Authentification 2FA, isolation des données et chiffrement bout en bout.",
  },
  {
    icon: Zap,
    title: "Ultra rapide",
    description:
      "Architecture optimisée pour des performances maximales à grande échelle.",
  },
  {
    icon: Clock,
    title: "Historique complet",
    description: "Traçabilité de toutes les transactions et modifications.",
  },
  {
    icon: Lock,
    title: "RBAC avancé",
    description: "Contrôle d'accès granulaire basé sur les rôles utilisateurs.",
  },
];
const Benefits = () => {
  return (
    <section className="py-24 bg-gray-400/10" id="fonctionnalite">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tout ce dont vous avez besoin
          </h2>
          <p className="text-lg text-muted-foreground">
            Une suite complète d'outils pour gérer votre activité commerciale de
            A à Z.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="hover:shadow-2xl rounded-xl border border-gray-300 p-6 transition-all duration-300 group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="h-12 w-12 rounded-xl bg-primary/5 flex items-center justify-center mb-4 group-hover:bg-black group-hover:text-white transition-all duration-300">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
              <p className="text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
