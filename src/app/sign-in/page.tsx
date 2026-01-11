// app/login/page.tsx
import { auth, signIn } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  const error = searchParams.error;

  // Pour renvoyer si on est connecté
  const session = await auth();
  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body p-8">
          <h2 className="card-title text-3xl font-bold text-center mb-2">
            Connexion
          </h2>
          <p className="text-center text-base-content/70 mb-6">
            Connectez-vous à votre compte Dealio
          </p>

          {/* Affichage du message d'erreur */}
          {error && (
            <div className="alert alert-error shadow-lg mb-6">
              <span>
                {error === "CredentialsSignin"
                  ? "Email ou mot de passe incorrect"
                  : "Une erreur est survenue lors de la connexion"}
              </span>
            </div>
          )}

          <form
            action={async (formData) => {
              "use server";

              try {
                await signIn("credentials", {
                  email: formData.get("email"),
                  password: formData.get("password"),
                  redirectTo: "/dashboard",
                });
              } catch (error) {
                // IMPORTANT : NextAuth lance une redirection en cas de succès
                // Il faut la laisser passer !
                if (isRedirectError(error)) {
                  throw error;
                }

                if (error instanceof AuthError) {
                  // Cas classique : mauvais identifiants
                  if (error.type === "CredentialsSignin") {
                    redirect("/login?error=CredentialsSignin");
                  }
                }
                
                // Autres erreurs inattendues
                console.error("Erreur de connexion:", error);
                redirect("/login?error=unknown");
              }
            }}
            className="space-y-5"
          >
            <div className="form-control">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                name="email"
                type="email"
                placeholder="exemple@dealio.com"
                className="input input-bordered w-full"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-control">
              <label className="label">
                <span className="label-text">Mot de passe</span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="••••••••"
                className="input input-bordered w-full"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full">
              Se connecter
            </button>
          </form>

          <div className="divider my-6">OU</div>

          <div className="text-center">
            <p className="text-base-content/70">
              Pas de compte ?{" "}
              <Link href="/signup" className="link link-primary">
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}