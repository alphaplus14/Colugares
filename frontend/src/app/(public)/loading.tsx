export default function PublicLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center pt-28">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 animate-pulse rounded-full bg-brand-orange/40" />
        <p className="text-sm text-brand-navy/45">Cargando...</p>
      </div>
    </div>
  );
}
