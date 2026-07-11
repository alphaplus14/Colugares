import type { TripDateRange } from "@/types/event.types";

const SPANISH_MONTHS: Record<string, number> = {
  enero: 0,
  febrero: 1,
  marzo: 2,
  abril: 3,
  mayo: 4,
  junio: 5,
  julio: 6,
  agosto: 7,
  septiembre: 8,
  setiembre: 8,
  octubre: 9,
  noviembre: 10,
  diciembre: 11,
};

const MONTH_PATTERN = Object.keys(SPANISH_MONTHS).join("|");

/** Crea fecha UTC a medianoche */
function utcDate(year: number, month: number, day: number): Date {
  return new Date(Date.UTC(year, month, day));
}

/** Último día del mes en UTC */
function endOfMonth(year: number, month: number): Date {
  return new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));
}

/** Si el mes ya pasó este año, usar el siguiente */
function resolveYear(
  monthIndex: number,
  explicitYear: number | undefined,
  now: Date,
): number {
  if (explicitYear) {
    return explicitYear;
  }

  const currentYear = now.getUTCFullYear();
  if (monthIndex < now.getUTCMonth()) {
    return currentYear + 1;
  }

  return currentYear;
}

function parseExplicitRange(text: string, now: Date): TripDateRange | null {
  const rangeRegex = new RegExp(
    `(?:del\\s+)?(\\d{1,2})\\s*(?:al|a|-)\\s*(\\d{1,2})\\s+de\\s+(${MONTH_PATTERN})(?:\\s+(\\d{4}))?`,
    "i",
  );
  const match = text.match(rangeRegex);

  if (!match) {
    return null;
  }

  const startDay = Number.parseInt(match[1] ?? "1", 10);
  const endDay = Number.parseInt(match[2] ?? "1", 10);
  const monthKey = match[3]?.toLowerCase() ?? "";
  const monthIndex = SPANISH_MONTHS[monthKey];

  if (monthIndex === undefined) {
    return null;
  }

  const year = resolveYear(
    monthIndex,
    match[4] ? Number.parseInt(match[4], 10) : undefined,
    now,
  );

  return {
    start: utcDate(year, monthIndex, startDay),
    end: utcDate(year, monthIndex, endDay),
    source: "explicit_range",
  };
}

function parseMonthReference(text: string, now: Date): TripDateRange | null {
  const monthRegex = new RegExp(
    `(?:en\\s+|para\\s+)?(${MONTH_PATTERN})(?:\\s+(\\d{4}))?`,
    "i",
  );
  const match = text.match(monthRegex);

  if (!match) {
    return null;
  }

  const monthKey = match[1]?.toLowerCase() ?? "";
  const monthIndex = SPANISH_MONTHS[monthKey];

  if (monthIndex === undefined) {
    return null;
  }

  const year = resolveYear(
    monthIndex,
    match[2] ? Number.parseInt(match[2], 10) : undefined,
    now,
  );

  return {
    start: utcDate(year, monthIndex, 1),
    end: endOfMonth(year, monthIndex),
    source: "month",
  };
}

function parseIsoDate(text: string): TripDateRange | null {
  const isoMatch = text.match(/\b(\d{4})-(\d{2})-(\d{2})\b/);
  if (!isoMatch) {
    return null;
  }

  const year = Number.parseInt(isoMatch[1] ?? "2026", 10);
  const month = Number.parseInt(isoMatch[2] ?? "1", 10) - 1;
  const day = Number.parseInt(isoMatch[3] ?? "1", 10);

  const date = utcDate(year, month, day);
  return {
    start: date,
    end: date,
    source: "explicit_range",
  };
}

/**
 * Extrae rango de fechas del mensaje del usuario en español.
 * Si no hay fechas, retorna null (el retriever usará eventos próximos).
 */
export function extractTripDateRange(
  message: string,
  referenceDate: Date = new Date(),
): TripDateRange | null {
  const normalized = message
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  return (
    parseExplicitRange(normalized, referenceDate) ??
    parseIsoDate(normalized) ??
    parseMonthReference(normalized, referenceDate)
  );
}
