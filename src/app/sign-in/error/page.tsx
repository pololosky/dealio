// app/login/error/page.tsx
import Link from "next/link";

export default async function LoginErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;

  const getErrorMessage = (errorType: string) => {
    switch (errorType) {
      case "CredentialsSignin":
        return "Email ou mot de passe incorrect.";
      case "OAuthAccountNotLinked":
        return "Cet email est déjà associé à un autre compte.";
      case "unknown":
        return "Une erreur inattendue est survenue.";
      default:
        return "Impossible de vous connecter pour le moment.";
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200 px-4">
      <div className="card bg-base-100 shadow-xl max-w-md w-full">
        <div className="card-body p-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-error/10 p-4 rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-error"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
          </div>

          <h2 className="text-2xl font-bold mb-2">Erreur de connexion</h2>
          <p className="text-base-content/70 mb-8">
            {getErrorMessage(type || "default")}
          </p>

          <div className="flex flex-col gap-3">
            <Link href="/login" className="btn btn-primary">
              Réessayer
            </Link>
            <Link href="/" className="btn btn-ghost">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
