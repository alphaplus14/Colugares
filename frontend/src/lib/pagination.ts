/** Utilidades de paginación para APIs admin */

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export function parsePagination(
  searchParams: URLSearchParams,
  defaults: { page?: number; limit?: number; maxLimit?: number } = {},
): { page: number; limit: number; skip: number } {
  const defaultPage = defaults.page ?? 1;
  const defaultLimit = defaults.limit ?? 12;
  const maxLimit = defaults.maxLimit ?? 48;

  const rawPage = Number(searchParams.get("page") ?? defaultPage);
  const rawLimit = Number(searchParams.get("limit") ?? defaultLimit);

  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1;
  const limit = Number.isFinite(rawLimit)
    ? Math.min(Math.max(Math.floor(rawLimit), 1), maxLimit)
    : defaultLimit;

  return { page, limit, skip: (page - 1) * limit };
}

export function buildPaginationMeta(
  total: number,
  page: number,
  limit: number,
): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const safePage = Math.min(page, totalPages);

  return {
    page: safePage,
    limit,
    total,
    totalPages,
    hasNext: safePage < totalPages,
    hasPrev: safePage > 1,
  };
}
