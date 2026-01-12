// BACKUP
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
            Inscrivez-vous en tant que Directeur et créez votre espace commercial
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
            action={async (formData: FormData) => {
              "use server";

              const emailRaw = formData.get("email")?.toString().trim();
              const password = formData.get("password")?.toString();
              const name = formData.get("name")?.toString().trim();
              const commerceName = formData.get("commerceName")?.toString().trim();
              const commerceDomain = formData.get("commerceDomain")?.toString().trim().toLowerCase();

              const email = emailRaw?.toLowerCase();

              // Validations basiques
              if (!email || !password || !name || !commerceName) {
                redirect("/signup?error=" + encodeURIComponent("Tous les champs obligatoires doivent être remplis"));
              }

              if (password.length < 8) {
                redirect("/signup?error=" + encodeURIComponent("Le mot de passe doit contenir au moins 8 caractères"));
              }

              if (commerceDomain && !/^[a-z0-9-]+$/.test(commerceDomain)) {
                redirect("/signup?error=" + encodeURIComponent("Le domaine ne peut contenir que lettres minuscules, chiffres et tirets"));
              }

              try {
                // Unicité email (insensible à la casse)
                const existingUser = await prisma.user.findFirst({
                  where: { email: { equals: email, mode: "insensitive" } },
                });
                if (existingUser) {
                  redirect("/signup?error=" + encodeURIComponent("Cet email est déjà utilisé"));
                }

                // Unicité tenant
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
                    redirect("/signup?error=" + encodeURIComponent("Ce nom de commerce est déjà utilisé"));
                  }
                  if (commerceDomain && existingTenant.domain === commerceDomain) {
                    redirect("/signup?error=" + encodeURIComponent("Ce domaine est déjà pris"));
                  }
                }

                // Création (transaction implicite via nested create)
                await prisma.user.create({
                  data: {
                    email,
                    name,
                    password: await bcrypt.hash(password, 12),
                    role: "DIRECTEUR",
                    twoFactorEnabled: false, // explicite
                    tenant: {
                      create: {
                        name: commerceName,
                        domain: commerceDomain || null,
                      },
                    },
                  },
                });

                // Connexion automatique
                await signIn("credentials", {
                  email,
                  password,
                  redirect: false, // ← important pour gérer la redirection nous-mêmes
                });

                redirect("/dashboard");
              } catch (err: any) {
                if (isRedirectError(err)) throw err;

                console.error("Erreur inscription :", err);

                let errorMsg = "Erreur lors de l'inscription";

                if (err.code === "P2002") {
                  const target = err.meta?.target ?? [];
                  if (target.includes("email")) errorMsg = "Cet email est déjà utilisé";
                  else if (target.includes("name")) errorMsg = "Ce nom de commerce est déjà utilisé";
                  else if (target.includes("domain")) errorMsg = "Ce domaine est déjà pris";
                }

                redirect(`/signup?error=${encodeURIComponent(errorMsg)}`);
              }
            }}
            className="space-y-5"
          >
            {/* ... le reste du formulaire reste IDENTIQUE à ton code original ... */}

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Votre nom complet *</span>
              </label>
              <input name="name" type="text" placeholder="Jean Dupont" className="input input-bordered w-full" required />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Email professionnel *</span>
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
                <span className="label-text font-semibold">Mot de passe * (min. 8 caractères)</span>
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

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Nom de votre commerce *</span>
              </label>
              <input
                name="commerceName"
                type="text"
                placeholder="Boutique Excellence"
                className="input input-bordered w-full"
                required
              />
              <label className="label">
                <span className="label-text-alt text-base-content/60">Ce nom doit être unique</span>
              </label>
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text font-semibold">Domaine personnalisé (optionnel)</span>
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
                <span className="label-text-alt text-base-content/60">Lettres minuscules, chiffres, tirets</span>
              </label>
            </div>

            <div className="alert alert-info text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                Vous serez <strong>Directeur</strong>. Vous pourrez inviter votre équipe ensuite.
              </span>
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Créer mon commerce
            </button>
          </form>

          <div className="divider my-6">OU</div>

          <p className="text-center text-base-content/70">
            Déjà inscrit ?{" "}
            <Link href="/login" className="link link-primary">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}