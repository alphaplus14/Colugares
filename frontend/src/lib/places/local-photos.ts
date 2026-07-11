import fs from "fs";
import path from "path";

/** Slug estable alineado con LISTA_IMAGENES / carpetas public/images/places */
export function slugifyPlaceName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/**
 * Si existen fotos locales en public/images/places/{region}/{slug}/,
 * las prioriza sobre URLs remotas (Unsplash) del seed.
 */
export function resolvePlacePhotos(
  region: string,
  name: string,
  remotePhotos: string[],
): string[] {
  const slug = slugifyPlaceName(name);
  const dir = path.join(
    process.cwd(),
    "public",
    "images",
    "places",
    region,
    slug,
  );

  try {
    if (!fs.existsSync(dir)) {
      return remotePhotos;
    }

    const files = fs
      .readdirSync(dir)
      .filter((file) => /\.(jpe?g|png|webp)$/i.test(file))
      .sort((a, b) => a.localeCompare(b, "es"));

    if (files.length === 0) {
      return remotePhotos;
    }

    return files.map(
      (file) => `/images/places/${region}/${slug}/${file}`,
    );
  } catch {
    return remotePhotos;
  }
}
