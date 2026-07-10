import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-cream">
      <header className="border-b border-brand-navy/10 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-display text-xl text-brand-navy">
            Colugares
          </Link>
          <Link
            href="/"
            className="text-sm font-medium text-brand-navy/70 hover:text-brand-navy"
          >
            Volver al inicio
          </Link>
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}
