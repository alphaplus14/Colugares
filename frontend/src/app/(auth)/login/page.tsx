"use client";

import { FormEvent, useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { PillButton } from "@/components/ui/PillButton";

function LoginForm() {
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
    setError(null);
    await signIn("google", { callbackUrl: "/" });
  }

  return (
    <div className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center px-6 py-12">
      <div className="w-full max-w-md rounded-3xl border border-brand-navy/10 bg-white p-8 shadow-xl shadow-brand-navy/5 md:p-10">
        <h1 className="text-display-md mb-2 text-brand-navy">Iniciar sesión</h1>
        <p className="mb-8 text-sm text-brand-navy/60">
          Personal interno: email y contraseña. Viajeros: continúa con Google.
        </p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-brand-navy"
            >
              Correo electrónico
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-brand-navy/15 px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
              placeholder="admin@colugares.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-brand-navy"
            >
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
            {loading ? "Ingresando..." : "Ingresar al panel"}
          </button>
        </form>

        <div className="my-8 flex items-center gap-3">
          <div className="h-px flex-1 bg-brand-navy/10" />
          <span className="text-xs text-brand-navy/40">o</span>
          <div className="h-px flex-1 bg-brand-navy/10" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignIn}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-brand-navy/15 py-3 text-sm font-medium text-brand-navy transition hover:bg-brand-cream"
        >
          Continuar con Google
        </button>

        <div className="mt-8 text-center">
          <PillButton href="/planner" size="sm" className="mx-auto">
            Soy viajero — Iniciar Aventura
          </PillButton>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-4.5rem)] items-center justify-center">
          <p className="text-sm text-brand-navy/40">Cargando...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
