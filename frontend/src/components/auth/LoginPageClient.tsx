"use client";

import { FormEvent, useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

interface LoginFormProps {
  googleOAuthEnabled: boolean;
}

function LoginForm({ googleOAuthEnabled }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleCredentialsSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Correo o contraseña incorrectos. Solo personal autorizado.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  async function handleGoogleSignIn() {
    if (!googleOAuthEnabled) {
      setError(
        "Google OAuth no está configurado. Agrega GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en frontend/.env.local",
      );
      return;
    }

    setError(null);
    const destination =
      callbackUrl.startsWith("/admin") ? "/" : callbackUrl;
    await signIn("google", { callbackUrl: destination });
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-colombia-green">
          Iniciar sesión
        </h1>
        <p className="mb-6 text-sm text-gray-500">
          Personal interno: email y contraseña. Viajeros: continúa con Google.
        </p>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-colombia-green focus:outline-none focus:ring-1 focus:ring-colombia-green"
              placeholder="admin@colugares.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-colombia-green focus:outline-none focus:ring-1 focus:ring-colombia-green"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-colombia-green py-2.5 text-sm font-semibold text-white hover:bg-colombia-green/90 disabled:opacity-50"
          >
            {loading ? "Ingresando..." : "Ingresar al panel"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">o</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        {!googleOAuthEnabled && (
          <div className="mb-4 rounded-md bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Google OAuth no configurado. Define{" "}
            <code className="text-xs">GOOGLE_CLIENT_ID</code> y{" "}
            <code className="text-xs">GOOGLE_CLIENT_SECRET</code> en{" "}
            <code className="text-xs">frontend/.env.local</code> y reinicia el
            servidor.
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={!googleOAuthEnabled}
          className="flex w-full items-center justify-center gap-2 rounded-md border border-gray-300 py-2.5 text-sm font-medium hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continuar con Google
        </button>
      </div>
    </div>
  );
}

interface LoginPageClientProps {
  googleOAuthEnabled: boolean;
}

export default function LoginPageClient({
  googleOAuthEnabled,
}: LoginPageClientProps) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center">
          <p className="text-sm text-gray-400">Cargando...</p>
        </div>
      }
    >
      <LoginForm googleOAuthEnabled={googleOAuthEnabled} />
    </Suspense>
  );
}
