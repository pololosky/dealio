// app/signup/page.tsx
import { redirect } from "next/navigation";
import { signIn } from "@/auth";
import Link from "next/link";
import { prisma } from "../../../lib/prisma";
import bcrypt from "bcryptjs";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default async function SignUpPage({
  searchParams,
}: {
  searchParams: { error?: string; message?: string };
}) {
  const error = searchParams.error;
  const message = searchParams.message;

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body p-8">
          <h2 className="card-title text-3xl font-bold text-center mb-2">
            Créer votre commerce
          </h2>
          <p className="text-center text-base-content/70 mb-6">
            Inscrivez-vous en tant que Directeur et créez votre espace
            commercial
          </p>

          {message && (
            <div className="alert alert-success shadow-lg mb-6">
              <span>{message}</span>
            </div>
          )}
          {error && (
            <div className="alert alert-error shadow-lg mb-6">
              <span>{error}</span>
            </div>
          )}

          <form
            action={async (formData) => {
              "use server";

              const emailRaw = formData.get("email")?.toString().trim();
              const password = formData.get("password")?.toString();
              const name = formData.get("name")?.toString().trim();
              const commerceName = formData
                .get("commerceName")
                ?.toString()
                .trim();
              const commerceDomain = formData
                .get("commerceDomain")
                ?.toString()
                .trim()
                .toLowerCase();

              // Normalisation de l'email (minuscules)
              const email = emailRaw?.toLowerCase();

              // Validations
              if (!email || !password || !name || !commerceName) {
                redirect(
                  "/signup?error=" +
                    encodeURIComponent(
                      "Tous les champs obligatoires doivent être remplis"
                    )
                );
              }

              if (password.length < 8) {
                redirect(
                  "/signup?error=" +
                    encodeURIComponent(
                      "Le mot de passe doit contenir au moins 8 caractères"
                    )
                );
              }

              // Validation du domaine (slug format)
              if (commerceDomain && !/^[a-z0-9-]+$/.test(commerceDomain)) {
                redirect(
                  "/signup?error=" +
                    encodeURIComponent(
                      "Le domaine ne peut contenir que des lettres minuscules, chiffres et tirets"
                    )
                );
              }

              try {
                // Vérification de l'existence de l'email
                const existingUser = await prisma.user.findFirst({
                  where: {
                    email: {
                      equals: email,
                      mode: "insensitive",
                    },
                  },
                });

                if (existingUser) {
                  redirect(
                    "/signup?error=" +
                      encodeURIComponent("Cet email est déjà utilisé")
                  );
                }

                // Vérification de l'unicité du nom de commerce
                const existingTenant = await prisma.tenant.findFirst({
                  where: {
                    OR: [
                      { name: commerceName },
                      ...(commerceDomain ? [{ domain: commerceDomain }] : []),
                    ],
                  },
                });

                if (existingTenant) {
                  if (existingTenant.name === commerceName) {
                    redirect(
                      "/signup?error=" +
                        encodeURIComponent(
                          "Ce nom de commerce est déjà utilisé"
                        )
                    );
                  }
                  if (existingTenant.domain === commerceDomain) {
                    redirect(
                      "/signup?error=" +
                        encodeURIComponent("Ce domaine est déjà pris")
                    );
                  }
                }

                // Création du Directeur et de son commerce (transaction atomique)
                await prisma.user.create({
                  data: {
                    email,
                    name,
                    password: await bcrypt.hash(password, 12),
                    role: "DIRECTEUR", // Rôle fixe pour l'inscription publique
                    tenant: {
                      create: {
                        name: commerceName,
                        domain: commerceDomain || null,
                      },
                    },
                  },
                });

                // Connexion automatique
                try {
                  await signIn("credentials", {
                    email,
                    password,
                    redirectTo: "/dashboard",
                  });
                } catch (signInError) {
                  // IMPORTANT : Laisser passer les redirections de succès
                  if (isRedirectError(signInError)) {
                    throw signInError;
                  }

                  // Si la connexion échoue, rediriger vers login
                  console.error(
                    "Erreur lors de la connexion automatique:",
                    signInError
                  );
                  redirect(
                    "/login?message=" +
                      encodeURIComponent(
                        "Compte créé avec succès ! Veuillez vous connecter."
                      )
                  );
                }
              } catch (err: any) {
                // IMPORTANT : Laisser passer les redirections de succès
                if (isRedirectError(err)) {
                  throw err;
                }

                console.error("ERREUR INSCRIPTION DÉTAILLÉE :", {
                  message: err.message,
                  code: err.code,
                  meta: err.meta,
                  stack: err.stack?.substring(0, 300),
                });

                let errorMsg = "Erreur lors de l'inscription";

                if (err.code === "P2002") {
                  const target = err.meta?.target;
                  if (target?.includes("email")) {
                    errorMsg = "Cet email est déjà utilisé";
                  } else if (target?.includes("name")) {
                    errorMsg = "Ce nom de commerce est déjà utilisé";
                  } else if (target?.includes("domain")) {
                    errorMsg = "Ce domaine est déjà pris";
                  } else {
                    errorMsg = "Une valeur unique est déjà utilisée";
                  }
                } else if (err.code === "P2003") {
                  errorMsg = "Erreur lors de la création du commerce associé";
                } else if (err.message?.includes("tenant")) {
                  errorMsg = "Erreur lors de la création du commerce";
                }

                redirect(`/signup?error=${encodeURIComponent(errorMsg)}`);
              }
            }}
            className="space-y-5"
          >
            {/* Informations personnelles */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Votre nom complet *
                </span>
              </label>
              <input
                name="name"
                type="text"
                placeholder="Jean Dupont"
                className="input input-bordered w-full"
                required
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Email professionnel *
                </span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="jean@moncommerce.com"
                className="input input-bordered w-full"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Mot de passe * (min. 8 caractères)
                </span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            <div className="divider my-2">Informations du commerce</div>

            {/* Informations du commerce */}
            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Nom de votre commerce *
                </span>
              </label>
              <input
                name="commerceName"
                type="text"
                placeholder="Boutique Excellence"
                className="input input-bordered w-full"
                required
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Ce nom doit être unique sur la plateforme
                </span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">
                  Domaine personnalisé (optionnel)
                </span>
              </label>
              <div className="join w-full">
                <input
                  name="commerceDomain"
                  type="text"
                  placeholder="mon-commerce"
                  className="input input-bordered join-item flex-1"
                  pattern="[a-z0-9-]+"
                />
                <span className="btn btn-ghost join-item">.dealio.com</span>
              </div>
              <label className="label">
                <span className="label-text-alt text-base-content/60">
                  Uniquement lettres minuscules, chiffres et tirets
                </span>
              </label>
            </div>

            {/* Information sur le rôle */}
            <div className="alert alert-info">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="stroke-current shrink-0 w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <span className="text-sm">
                Vous serez enregistré en tant que <strong>Directeur</strong>.
                Vous pourrez ensuite inviter votre équipe (gérants, vendeurs,
                magasiniers).
              </span>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Créer mon commerce
            </button>
          </form>

          <div className="divider my-6">OU</div>

          <div className="text-center">
            <p className="text-base-content/70">
              Déjà inscrit ?{" "}
              <Link href="/sign-in" className="link link-primary">
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
