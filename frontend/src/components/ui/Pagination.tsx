"use client";

interface PaginationProps {
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
  label?: string;
}

/** Controles de paginación del CMS admin */
export function Pagination({
  page,
  totalPages,
  total,
  onPageChange,
  label = "elementos",
}: PaginationProps) {
  if (totalPages <= 1 && total === 0) {
    return null;
  }

  const pages = buildPageWindow(page, totalPages);

  return (
    <div className="mt-8 flex flex-col items-center justify-between gap-4 sm:flex-row">
      <p className="text-xs text-brand-navy/50">
        Página {page} de {totalPages} · {total} {label}
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-full border border-brand-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-brand-navy transition hover:bg-brand-cream disabled:cursor-not-allowed disabled:opacity-40"
        >
          Anterior
        </button>

        {pages.map((item, index) =>
          item === "…" ? (
            <span
              key={`ellipsis-${index}`}
              className="px-1 text-xs text-brand-navy/40"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={`min-w-[2rem] rounded-full px-2.5 py-1.5 text-xs font-semibold transition ${
                item === page
                  ? "bg-brand-navy text-white"
                  : "border border-brand-navy/15 bg-white text-brand-navy hover:bg-brand-cream"
              }`}
            >
              {item}
            </button>
          ),
        )}

        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-full border border-brand-navy/15 bg-white px-3 py-1.5 text-xs font-semibold text-brand-navy transition hover:bg-brand-cream disabled:cursor-not-allowed disabled:opacity-40"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}

function buildPageWindow(
  current: number,
  totalPages: number,
): Array<number | "…"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages = new Set<number>();
  pages.add(1);
  pages.add(totalPages);
  pages.add(current);
  pages.add(current - 1);
  pages.add(current + 1);

  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);

  const result: Array<number | "…"> = [];
  let prev = 0;

  for (const p of sorted) {
    if (prev && p - prev > 1) {
      result.push("…");
    }
    result.push(p);
    prev = p;
  }

  return result;
}
