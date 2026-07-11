import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { loadPublicPlaceById } from "@/lib/places/load-public-places";
import { formatPlacePrice } from "@/lib/place-format";
import { PillButton } from "@/components/ui/PillButton";
import {
  PLACE_TYPE_LABELS,
  REGION_LABELS,
} from "@/types/place.types";

interface DestinationDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({
  params,
}: DestinationDetailPageProps): Promise<Metadata> {
  const place = await loadPublicPlaceById(params.id);

  if (!place) {
    return { title: "Destino no encontrado | Colugares" };
  }

  return {
    title: `${place.name} | Colugares`,
    description: place.description.slice(0, 160),
    openGraph: {
      title: place.name,
      description: place.description.slice(0, 160),
      images: place.photos[0] ? [{ url: place.photos[0] }] : undefined,
      type: "article",
    },
  };
}

export default async function DestinationDetailPage({
  params,
}: DestinationDetailPageProps) {
  const place = await loadPublicPlaceById(params.id);

  if (!place) {
    notFound();
  }

  const priceLabel = formatPlacePrice(place.price_real, place.budget_tier);
  const hero = place.photos[0];

  return (
    <article className="pb-20 pt-24">
      <div className="relative h-[42vh] min-h-[280px] w-full overflow-hidden bg-brand-navy">
        {hero ? (
          <Image
            src={hero}
            alt={place.name}
            fill
            priority
            className="object-cover opacity-90"
            sizes="100vw"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-7xl px-6 pb-10">
          <Link
            href="/destinos"
            className="mb-4 inline-block text-sm text-white/70 hover:text-brand-orange"
          >
            ← Todos los destinos
          </Link>
          <div className="mb-3 flex flex-wrap gap-2">
            <span className="rounded-full bg-brand-orange px-3 py-1 text-xs font-bold uppercase text-brand-navy">
              {REGION_LABELS[place.region]}
            </span>
            <span className="rounded-full border border-white/30 px-3 py-1 text-xs text-white/90">
              {PLACE_TYPE_LABELS[place.type]}
            </span>
          </div>
          <h1 className="font-display text-4xl text-white md:text-5xl">
            {place.name}
          </h1>
          <p className="mt-2 text-white/75">
            {place.city}, {place.department}
          </p>
        </div>
      </div>

      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-12 lg:grid-cols-[1.4fr_0.8fr]">
        <div>
          <h2 className="mb-4 font-display text-2xl text-brand-navy">
            Sobre este lugar
          </h2>
          <p className="whitespace-pre-line leading-relaxed text-brand-navy/75">
            {place.description}
          </p>

          {place.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {place.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-brand-sand px-3 py-1 text-xs font-medium text-brand-navy/70"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {place.photos.length > 1 && (
            <div className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3">
              {place.photos.slice(1, 7).map((photo) => (
                <div
                  key={photo}
                  className="relative aspect-[4/3] overflow-hidden rounded-xl"
                >
                  <Image
                    src={photo}
                    alt=""
                    fill
                    className="object-cover"
                    sizes="33vw"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-brand-navy/10 bg-white p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-orange-deep">
            Precio
          </p>
          <p className="mt-1 font-display text-xl text-brand-navy">{priceLabel}</p>

          {place.recommended_transport.length > 0 && (
            <div className="mt-6">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-navy/50">
                Transporte
              </p>
              <ul className="mt-2 space-y-1 text-sm text-brand-navy/70">
                {place.recommended_transport.map((item) => (
                  <li key={item}>· {item}</li>
                ))}
              </ul>
            </div>
          )}

          {(place.contact.website ||
            place.contact.phone ||
            place.contact.email) && (
            <div className="mt-6 space-y-1 text-sm text-brand-navy/70">
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-navy/50">
                Contacto
              </p>
              {place.contact.phone && <p>{place.contact.phone}</p>}
              {place.contact.email && <p>{place.contact.email}</p>}
              {place.contact.website && (
                <a
                  href={place.contact.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-orange-deep underline-offset-2 hover:underline"
                >
                  Sitio web
                </a>
              )}
            </div>
          )}

          <div className="mt-8">
            <PillButton href="/planner" variant="dark" className="w-full">
              Incluir en mi viaje
            </PillButton>
          </div>
        </aside>
      </div>
    </article>
  );
}
