"use client";

import { FormEvent, useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { PillButton } from "@/components/ui/PillButton";

type AuthMode = "login" | "register";

interface LoginFormProps {
  googleOAuthEnabled: boolean;
}

function TravelerAuthForm({ googleOAuthEnabled }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawCallback = searchParams.get("callbackUrl") ?? "/planner";
  const callbackUrl = rawCallback.startsWith("/admin") ? "/planner" : rawCallback;

  const [mode, setMode] = useState<AuthMode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleGoogleSignIn() {
    if (!googleOAuthEnabled) {
      setError(
        "Google OAuth no está configurado. Agrega GOOGLE_CLIENT_ID y GOOGLE_CLIENT_SECRET en frontend/.env.local",
      );
      return;
    }

    setError(null);
    await signIn("google", { callbackUrl });
  }

  async function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      intent: "viajero",
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Correo o contraseña incorrectos.");
      return;
    }

    router.push(callbackUrl);
    router.refresh();
  }

  async function handleRegister(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setLoading(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, confirmPassword }),
    });

    const data = (await response.json()) as { message?: string };

    if (!response.ok) {
      setLoading(false);
      setError(data.message ?? "No se pudo crear la cuenta");
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      intent: "viajero",
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Cuenta creada, pero no pudimos iniciar sesión. Intenta entrar manualmente.");
      setMode("login");
      return;
    }

    router.push("/onboarding");
    router.refresh();
  }

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-brand-navy/10 bg-white p-8 shadow-xl shadow-brand-navy/5 md:p-10">
        <h1 className="text-display-md mb-2 text-brand-navy">
          {mode === "login" ? "Bienvenido" : "Crea tu cuenta"}
        </h1>
        <p className="mb-6 text-sm text-brand-navy/60">
          {mode === "login"
            ? "Entra con Google o con tu correo para planear tu viaje."
            : "Regístrate y completa tu perfil para que Colu arme tu itinerario."}
        </p>

        <div className="mb-6 grid grid-cols-2 gap-2 rounded-full bg-brand-cream p-1">
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            className={`rounded-full py-2 text-sm font-semibold transition ${
              mode === "login"
                ? "bg-white text-brand-navy shadow-sm"
                : "text-brand-navy/50"
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError(null);
            }}
            className={`rounded-full py-2 text-sm font-semibold transition ${
              mode === "register"
                ? "bg-white text-brand-navy shadow-sm"
                : "text-brand-navy/50"
            }`}
          >
            Crear cuenta
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {!googleOAuthEnabled && (
          <div className="mb-4 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Google OAuth no configurado. Puedes usar correo y contraseña, o define{" "}
            <code className="text-xs">GOOGLE_CLIENT_ID</code> en{" "}
            <code className="text-xs">.env.local</code>.
          </div>
        )}

        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={!googleOAuthEnabled || loading}
          className="mb-6 flex w-full items-center justify-center gap-2 rounded-full border border-brand-navy/15 py-3 text-sm font-medium text-brand-navy transition hover:bg-brand-cream disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continuar con Google
        </button>

        <div className="mb-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-brand-navy/10" />
          <span className="text-xs text-brand-navy/40">o con correo</span>
          <div className="h-px flex-1 bg-brand-navy/10" />
        </div>

        {mode === "login" ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-brand-navy">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-brand-navy/15 px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-brand-navy">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-brand-navy/15 px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-brand-navy py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-brand-navy/90 disabled:opacity-50"
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-brand-navy">
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                required
                minLength={2}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-brand-navy/15 px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                placeholder="Tu nombre"
              />
            </div>
            <div>
              <label htmlFor="reg-email" className="mb-1.5 block text-sm font-medium text-brand-navy">
                Correo electrónico
              </label>
              <input
                id="reg-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-brand-navy/15 px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                placeholder="tu@email.com"
              />
            </div>
            <div>
              <label htmlFor="reg-password" className="mb-1.5 block text-sm font-medium text-brand-navy">
                Contraseña
              </label>
              <input
                id="reg-password"
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-brand-navy/15 px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
                placeholder="Mínimo 8 caracteres"
              />
            </div>
            <div>
              <label htmlFor="confirm" className="mb-1.5 block text-sm font-medium text-brand-navy">
                Confirmar contraseña
              </label>
              <input
                id="confirm"
                type="password"
                required
                minLength={8}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-xl border border-brand-navy/15 px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-full bg-brand-orange py-3 text-sm font-semibold uppercase tracking-wide text-brand-navy transition hover:bg-brand-orange/90 disabled:opacity-50"
            >
              {loading ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>
        )}

        <div className="mt-8 text-center">
          <PillButton href="/planner" size="sm" className="mx-auto">
            Ir al Trip Planner
          </PillButton>
          <p className="mt-4 text-xs text-brand-navy/40">
            Al continuar aceptas planificar con destinos verificados de Colugares.
          </p>
        </div>
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
        <div className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center">
          <p className="text-sm text-brand-navy/40">Cargando...</p>
        </div>
      }
    >
      <TravelerAuthForm googleOAuthEnabled={googleOAuthEnabled} />
    </Suspense>
  );
}
