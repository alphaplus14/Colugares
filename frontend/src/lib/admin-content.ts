/** Assets visuales del panel admin — alineados a la home Colugares */

export const adminHeroImage =
  "https://images.unsplash.com/photo-1580976010575-92a8068a12a8?w=1600&q=80";

export const adminModuleVisuals = {
  lugares: {
    title: "Lugares",
    subtitle: "Destinos y suscriptores B2B",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7aca8b915?w=800&q=80",
    href: "/admin/lugares",
  },
  eventos: {
    title: "Festividades",
    subtitle: "Calendario cultural de Colombia",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80",
    href: "/admin/eventos",
  },
  itinerarios: {
    title: "Itinerarios",
    subtitle: "Planes guardados por viajeros",
    image:
      "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80",
    href: "/admin/itinerarios",
  },
  usuarios: {
    title: "Usuarios",
    subtitle: "Viajeros y equipo interno",
    image:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80",
    href: "/admin/usuarios",
  },
} as const;

export const regionCoverImages: Record<string, string> = {
  caribe:
    "https://images.unsplash.com/photo-1555881400-74d7aca8b915?w=600&q=80",
  andina:
    "https://images.unsplash.com/photo-1569163138750-85260835f72c?w=600&q=80",
  pacifico:
    "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80",
  amazonia:
    "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80",
  llanos:
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80",
  eje_cafetero:
    "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&q=80",
};

export const placeFallbackImage =
  "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80";
