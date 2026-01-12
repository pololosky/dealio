"use client";

import { Menu, X, User } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useSession, signOut } from "next-auth/react";

const NavBar = () => {
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const isLoggedIn = status === "authenticated";

  // --- Menu Mobile ---
  const sideMenuRef = useRef<HTMLUListElement>(null);
  const openMenu = () => {
    if (sideMenuRef.current) {
      sideMenuRef.current.style.transform = "translateX(-16rem)";
    }
  };
  const closeMenu = () => {
    if (sideMenuRef.current) {
      sideMenuRef.current.style.transform = "translateX(16rem)";
    }
  };

  // --- Scroll ---
  const [isScroll, setIsScroll] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setIsScroll(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // --- Liens ---
  const pathName = usePathname();
  const isActiveLink = (href: string) => {
    return pathName.replace(/\/$/, "") === href.replace(/\/$/, "");
  };

  const links = [
    { name: "A propos", href: "#presentation" },
    { name: "Fonctionnalités", href: "#fonctionnalite" },
    { name: "Tarifs", href: "#tarif" },
    { name: "Documentation", href: "#doc" },
  ];

  const renderLinks = () => {
    return links.map((link) => (
      <li key={link.href}>
        <Link
          href={link.href}
          className={`rounded-2xl ${
            isActiveLink(link.href) ? "bg-accent text-white" : ""
          }`}
        >
          {link.name}
        </Link>
      </li>
    ));
  };

  // Affichage du rôle en français
  const roleDisplay = session?.user?.role
    ? {
        SUPERADMIN: "Super Admin",
        DIRECTEUR: "Directeur",
        GERANT: "Gérant",
        VENDEUR: "Vendeur",
        MAGASINIER: "Magasinier",
      }[session.user.role as string] ?? session.user.role
    : "";

  return (
    <div
      className={`flex justify-between items-center sticky top-0 z-50 transition-all ${
        isScroll ? "bg-white/50 backdrop-blur-lg shadow-sm" : ""
      } px-4 lg:px-8 xl:px-[8%] py-4`}
    >
      {/* --- LOGO --- */}
      <div>
        <Link href={"/"} className="flex items-center gap-2">
          <p translate="no" className="text-4xl italic font-bold">
            Dealio
          </p>
        </Link>
      </div>

      {/* --- MENU CENTRAL (Desktop) --- */}
      <nav>
        <ul
          className={`menu lg:menu-horizontal rounded-box hidden xl:flex items-center gap-4 rounded-2xl px-12 py-3 ${
            isScroll ? "" : "bg-white/50 shadow-sm"
          }`}
        >
          {renderLinks()}
        </ul>
      </nav>

      {/* --- PARTIE DROITE (Auth & Toggle) --- */}
      <div className="flex items-center gap-4">
        {isLoading ? (
          /* Squelette de chargement */
          <div className="skeleton h-10 w-10 rounded-full shrink-0"></div>
        ) : isLoggedIn ? (
          /* Avatar utilisateur si connecté */
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar bg-accent/10"
            >
              <User className="text-accent" />
            </div>
            <ul
              tabIndex={0}
              className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
            >
              {session?.user?.email && (
                <li className="menu-title text-xs opacity-60">
                  {session.user.email}
                </li>
              )}
              {roleDisplay && (
                <li className="menu-title text-sm font-medium">
                  {roleDisplay}
                </li>
              )}
              <li>
                <Link href="/profile">Profil</Link>
              </li>
              <li>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-error"
                >
                  Déconnexion
                </button>
              </li>
            </ul>
          </div>
        ) : (
          /* Boutons Connexion si déconnecté */
          <div className="hidden lg:flex items-center gap-2">
            <Link
              href="/sign-in"
              className="btn btn-ghost rounded-2xl shadow-sm"
            >
              Connexion
            </Link>
            <Link
              href="/sign-up"
              className="btn btn-accent rounded-2xl shadow-sm"
            >
              Inscription
            </Link>
          </div>
        )}

        {/* Bouton Menu Mobile (Burger) */}
        <button
          className="lg:hidden btn btn-accent btn-square rounded-2xl cursor-pointer"
          onClick={openMenu}
        >
          <Menu />
        </button>
      </div>

      {/* --- SIDEBAR MOBILE --- */}
      <ul
        ref={sideMenuRef}
        className="lg:hidden flex flex-col gap-4 py-20 px-10 fixed -right-64 top-0 bottom-0 w-64 h-screen bg-neutral-200 transition-transform duration-500 ease-in-out"
      >
        <div
          className="absolute right-6 top-6 cursor-pointer p-2 hover:bg-black/5 rounded-full"
          onClick={closeMenu}
        >
          <X size={24} />
        </div>

        {isLoggedIn ? (
          <>
            {session?.user?.email && (
              <div className="text-sm opacity-70 mb-2">
                {session.user.email}
              </div>
            )}
            {roleDisplay && (
              <div className="font-medium mb-4">{roleDisplay}</div>
            )}
            <hr className="border-black/10 my-2" />
          </>
        ) : (
          <>
            <li>
              <Link onClick={closeMenu} className="font-bold" href="/login">
                Connexion
              </Link>
            </li>
            <li>
              <Link onClick={closeMenu} className="font-bold" href="/signup">
                Inscription
              </Link>
            </li>
            <hr className="border-black/10 my-2" />
          </>
        )}

        {links.map((link) => (
          <li key={link.href}>
            <Link onClick={closeMenu} href={link.href}>
              {link.name}
            </Link>
          </li>
        ))}

        <li>
          <Link onClick={closeMenu} href="/htmlToImage">
            Html to image
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default NavBar;
