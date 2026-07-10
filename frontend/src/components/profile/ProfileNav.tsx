import Link from "next/link";

const links = [
  { href: "/mi-perfil/preferencias", label: "Preferencias" },
  { href: "/mi-perfil/itinerarios", label: "Mis itinerarios" },
  { href: "/planner", label: "Volver a Colu" },
];

interface ProfileNavProps {
  current: "preferencias" | "itinerarios";
}

export default function ProfileNav({ current }: ProfileNavProps) {
  return (
    <nav className="mb-8 flex flex-wrap gap-2 border-b border-gray-200 pb-4">
      {links.map((link) => {
        const isActive =
          (current === "preferencias" && link.href.includes("preferencias")) ||
          (current === "itinerarios" && link.href.includes("itinerarios"));

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`rounded-full px-4 py-2 text-sm font-medium transition ${
              isActive
                ? "bg-colombia-green text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
