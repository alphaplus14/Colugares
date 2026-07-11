import Link from "next/link";

const links = [
  { href: "/mi-perfil/preferencias", label: "Preferencias", key: "preferencias" },
  { href: "/mi-perfil/visitados", label: "Visitados", key: "visitados" },
  { href: "/mi-perfil/itinerarios", label: "Mis itinerarios", key: "itinerarios" },
  { href: "/planner", label: "Volver a Colu", key: "planner" },
] as const;

interface ProfileNavProps {
  current: "preferencias" | "itinerarios" | "visitados";
}

export default function ProfileNav({ current }: ProfileNavProps) {
  return (
    <nav className="mb-8 flex flex-wrap gap-2 border-b border-brand-navy/10 pb-4">
      {links.map((link) => {
        const isActive = link.key === current;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-brand-navy text-white"
                : "bg-white text-brand-navy/70 hover:bg-brand-sand"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
