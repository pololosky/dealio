// app/login/page.tsx
import { auth, signIn } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthError } from "next-auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";

export default async function LoginPage() {
  // Redirection si déjà connecté
  const session = await auth();
  if (session) redirect("/dashboard");

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body p-8">
          <h2 className="card-title text-3xl font-bold justify-center mb-2">
            Connexion
          </h2>
          <p className="text-center text-base-content/70 mb-6">
            Connectez-vous à votre compte Dealio
          </p>

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
                if (isRedirectError(error)) throw error;

                if (error instanceof AuthError) {
                  // Redirection vers /login/CredentialsSignin par exemple
                  return redirect(`/login/${error.type}`);
                }
                // Redirection vers /login/unknown
                return redirect("/login/unknown");
              }
            }}
            className="space-y-5"
          >
            <div className="form-control flex flex-col">
              <label className="label">
                <span className="label-text">Email</span>
              </label>
              <input
                name="email"
                type="email"
                className="input input-bordered w-full"
                placeholder="vous@exemple.com"
                required
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Mot de passe</span>
              </label>
              <input
                name="password"
                type="password"
                className="input input-bordered w-full"
                placeholder="••••••••"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary w-full">
              Se connecter
            </button>
          </form>

          <div className="divider my-6">OU</div>
          <div className="text-center">
            <Link href="/sign-up" className="link link-primary">
              Créer un compte
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
