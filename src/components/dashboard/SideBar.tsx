// components/dashboard/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  BarChart3,
  Shield,
  Settings,
  LogOut,
  ChevronLeft,
} from "lucide-react";

interface SidebarProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    role: string;
    tenantId: string;
  };
}

// Configuration des menus selon les rôles
const menuByRole = {
  SUPERADMIN: [
    { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
    { href: "/dashboard/commerces", icon: Users, label: "Commerces" },
    {
      href: "/dashboard/analytics",
      icon: BarChart3,
      label: "Analytics Global",
    },
    { href: "/dashboard/security", icon: Shield, label: "Sécurité" },
    { href: "/dashboard/settings", icon: Settings, label: "Paramètres" },
  ],
  DIRECTEUR: [
    { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
    { href: "/dashboard/team", icon: Users, label: "Équipe" },
    { href: "/dashboard/pos", icon: ShoppingCart, label: "Ventes" },
    { href: "/dashboard/products", icon: Package, label: "Stocks" },
    { href: "/dashboard/sales", icon: BarChart3, label: "Rapports" },
    { href: "/dashboard/security", icon: Shield, label: "Sécurité" },
    { href: "/dashboard/settings", icon: Settings, label: "Paramètres" },
  ],
  GERANT: [
    { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
    { href: "/dashboard/team", icon: Users, label: "Équipe" },
    { href: "/dashboard/pos", icon: ShoppingCart, label: "Ventes" },
    { href: "/dashboard/products", icon: Package, label: "Stocks" },
    { href: "/dashboard/sales", icon: BarChart3, label: "Rapports" },
  ],
  VENDEUR: [
    { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
    { href: "/dashboard/pos", icon: ShoppingCart, label: "Ventes" },
    { href: "/dashboard/products", icon: Package, label: "Stocks" },
  ],
  MAGASINIER: [
    { href: "/dashboard", icon: LayoutDashboard, label: "Tableau de bord" },
    { href: "/dashboard/products", icon: Package, label: "Stocks" },
    { href: "/dashboard/sales", icon: BarChart3, label: "Rapports" },
  ],
};

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();
  const role = user.role;
  const menuItems =
    menuByRole[role as keyof typeof menuByRole] || menuByRole.VENDEUR;

  // Gestion du nom affiché
  const displayName = user.name || user.email?.split("@")[0] || "Utilisateur";
  const avatarInitial = displayName.charAt(0).toUpperCase();

  const isActive = (href: string) => {
    if (href === "/dashboard") return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <aside className="w-72 bg-base-100 border-r border-base-200 flex flex-col h-screen shadow-sm">
      {/* Header / Logo */}
      <div className="p-6 border-b border-base-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={"/"} className="flex items-center gap-2">
              <p translate="no" className="text-4xl italic font-bold">
                Dealio
              </p>
            </Link>
          </div>
          {/* Bouton réduire (optionnel, à activer si tu veux sidebar rétractable) */}
          <button className="btn btn-ghost btn-sm btn-circle lg:hidden">
            <ChevronLeft size={18} />
          </button>
        </div>
      </div>

      {/* Navigation principale */}
      <nav className="flex-1 px-3 py-6 overflow-y-auto">
        <ul className="menu gap-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`
                    group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                    ${
                      active
                        ? "bg-primary text-primary-content font-medium shadow-sm"
                        : "text-base-content hover:bg-base-200 active:bg-base-300"
                    }
                  `}
                >
                  <Icon className="w-5 h-5 opacity-80 group-hover:opacity-100 transition-opacity" />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Section utilisateur */}
      <div className="p-4 border-t border-base-200 mt-auto">
        <div className="flex items-center gap-3 p-3 bg-base-200/50 rounded-xl mb-3">
          <div className="avatar placeholder">
            <div className="bg-neutral-focus text-neutral-content rounded-full w-12 h-12">
              <span className="text-xl font-semibold">{avatarInitial}</span>
            </div>
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-medium truncate">{displayName}</p>
            <p className="text-xs opacity-70 capitalize mt-0.5">
              {role.toLowerCase().replace("_", " ")}
            </p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: "/sign-in" })}
          className="
            btn btn-ghost w-full justify-start gap-3 text-error 
            hover:bg-error/10 hover:text-error-content
            transition-colors
          "
        >
          <LogOut size={18} />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
