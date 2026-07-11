export default function MiPerfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-brand-cream px-4 pb-10 pt-28 sm:px-6">
      <div className="mx-auto max-w-4xl">{children}</div>
    </div>
  );
}
