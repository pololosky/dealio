// import { Button } from "@/components/ui/button";
import { Check, ArrowRight } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Starter",
    description: "Parfait pour démarrer",
    price: "29",
    period: "/mois",
    features: [
      "1 boutique",
      "3 utilisateurs",
      "Ventes illimitées",
      "Rapports basiques",
      "Support email"
    ],
    cta: "Commencer",
    popular: false
  },
  {
    name: "Business",
    description: "Pour les commerces en croissance",
    price: "79",
    period: "/mois",
    features: [
      "3 boutiques",
      "10 utilisateurs",
      "Ventes illimitées",
      "Rapports avancés",
      "Support prioritaire",
      "API access",
      "Multi-caisse"
    ],
    cta: "Essai gratuit 14 jours",
    popular: true
  },
  {
    name: "Enterprise",
    description: "Pour les grandes enseignes",
    price: "Sur mesure",
    period: "",
    features: [
      "Boutiques illimitées",
      "Utilisateurs illimités",
      "Déploiement on-premise",
      "SLA personnalisé",
      "Account manager dédié",
      "Formation équipe",
      "Intégrations custom"
    ],
    cta: "Nous contacter",
    popular: false
  }
];

export const Pricing = () => {
  return (
    <section className="py-24 bg-gray-400/10" id="#tarif">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Tarification transparente
          </h2>
          <p className="text-lg text-muted-foreground">
            Choisissez le plan adapté à la taille de votre commerce.
          </p>
        </div>
        
        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`dealio-card p-8 relative rounded-xl ${
                plan.popular 
                  ? "border-2 border-primary shadow-xl scale-105" 
                  : "border border-gray-300"
              }`}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Populaire
                  </span>
                </div>
              )}
              
              {/* Plan Info */}
              <div className="text-center mb-8">
                <h3 className="font-bold text-xl mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  {plan.description}
                </p>
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  {plan.period && (
                    <span className="text-muted-foreground">{plan.period}</span>
                  )}
                </div>
              </div>
              
              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature, fIndex) => (
                  <li key={fIndex} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-success/10 flex items-center justify-center">
                      <Check className="h-3 w-3 text-success" />
                    </div>
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              
              {/* CTA */}
              <button
                className={`w-full flex rounded-xl p-4 justify-center ${plan.popular ? "text-white bg-black" : "outline"}`}
              >
                <Link href="/auth/signup" className="flex items-center">
                  {plan.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
