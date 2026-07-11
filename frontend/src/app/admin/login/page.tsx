"use client";

import { FormEvent, useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const result = await signIn("credentials", {
      email,
      password,
      intent: "staff",
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Credenciales inválidas o sin permisos de personal interno.");
      return;
    }

    const safeCallback = callbackUrl.startsWith("/admin")
      ? callbackUrl
      : "/admin/dashboard";

    router.push(safeCallback);
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center px-6 py-12">
      {/* Fondo visual */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1580976010575-92a8068a12a8?w=1920&q=80"
          alt=""
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-brand-navy/85" />
      </div>

      <div className="relative z-10 w-full max-w-md rounded-3xl border border-white/15 bg-white/95 p-8 shadow-2xl backdrop-blur-md md:p-10">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-brand-orange-deep">
          Acceso interno
        </p>
        <h1 className="font-display text-3xl text-brand-navy">Colugares Admin</h1>
        <p className="mt-2 mb-8 text-sm text-brand-navy/55">
          Solo personal autorizado. Esta página no es pública para viajeros.
        </p>

        {error && (
          <div className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="mb-1.5 block text-sm font-medium text-brand-navy"
            >
              Correo corporativo
            </label>
            <input
              id="admin-email"
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-brand-navy/15 px-4 py-2.5 text-sm focus:border-brand-orange focus:outline-none focus:ring-2 focus:ring-brand-orange/20"
              placeholder="admin@colugares.com"
            />
          </div>

          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-sm font-medium text-brand-navy"
            >
              Contraseña
            </label>
            <input
              id="admin-password"
              type="password"
              required
              autoComplete="current-password"
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
            {loading ? "Verificando..." : "Entrar al panel"}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-brand-navy/40">
          ¿Eres viajero?{" "}
          <Link href="/login" className="font-medium text-brand-orange-deep hover:underline">
            Inicia sesión aquí
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-brand-navy">
          <p className="text-sm text-white/50">Cargando...</p>
        </div>
      }
    >
      <AdminLoginForm />
    </Suspense>
  );
}
