import { auth } from "@/auth";
import Link from "next/link";
import React from "react";

const Presentation = async () => {
  const session = await auth();
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden" id="#presentation">
      <div className="relative z-10 container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center animate-fade-in">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
            </span>
            <span className="text-sm font-medium text-muted-foreground">
              {session
                ? `Bonjour ${session.user.email}`
                : "Bienvenue sur Dealio"}
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-bold mb-6">
            La gestion commerciale{" "}
            <span className="relative">
              <span className="relative z-10">simplifiée</span>
              <svg
                className="absolute -bottom-2 left-0 w-full h-3 text-primary/20"
                viewBox="0 0 200 12"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 6C50 6 50 2 100 2C150 2 150 10 200 10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
              </svg>
            </span>
          </h1>
          {/* Subheadline */}
          <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Gérez vos ventes, stocks et équipes en temps réel. Une plateforme
            SaaS multi-tenant pensée pour les commerces modernes.
          </p>

          {/* le call to action */}
          <div className="w-full justify-center flex md:flex-row flex-col items-center gap-2 mb-8">
            <Link
              href={`/sign-up`}
              className={`btn btn-accent btn-xl rounded-2xl shadow-sm ${
                session ? "hidden" : ""
              }`}
            >
              Commencez gratuitement
            </Link>
            <Link
              href={`/sign-in`}
              className={`btn btn-ghost btn-xl rounded-2xl shadow-sm ${
                session ? "hidden" : ""
              }`}
            >
              Voir la demo
            </Link>
            <Link
              href={`/dashboard`}
              className={`btn btn-accent btn-xl rounded-2xl shadow-sm ${
                session ? "" : "hidden"
              }`}
            >
              Dashboard
            </Link>
          </div>

          {/* les stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold">500+</div>
              <div className="text-sm text-muted-foreground mt-1">
                Commerces
              </div>
            </div>
            <div className="text-center border-x border-border">
              <div className="text-3xl md:text-4xl font-bold">2M+</div>
              <div className="text-sm text-muted-foreground mt-1">
                Transactions
              </div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold">99.9%</div>
              <div className="text-sm text-muted-foreground mt-1">Uptime</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Presentation;
