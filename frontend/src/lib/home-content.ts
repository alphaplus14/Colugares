export type ColombiaRegion =
  | "caribe"
  | "andina"
  | "pacifico"
  | "amazonia"
  | "llanos"
  | "eje_cafetero";

export interface RegionData {
  id: ColombiaRegion;
  name: string;
  tagline: string;
  description: string;
  highlights: string[];
  image: string;
  position: { top: string; left: string };
}

export interface PassionCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  image: string;
}

export interface FeaturedDestination {
  id: string;
  name: string;
  region: string;
  category: string;
  description: string;
  image: string;
}

export interface StorySlide {
  number: string;
  title: string;
  highlight: string;
  description: string;
  image: string;
}

export interface UpcomingEvent {
  id: string;
  name: string;
  city: string;
  month: string;
  description: string;
}

export const storySlides: StorySlide[] = [
  {
    number: "01",
    title: "Despierta en el",
    highlight: "corazón de Colombia",
    description:
      "Desde playas del Caribe hasta picos andinos, cada amanecer te invita a descubrir un país de contrastes infinitos.",
    image: "/images/stories/despierta-colombia.jpg",
  },
  {
    number: "02",
    title: "Descubre tu",
    highlight: "espíritu aventurero",
    description:
      "Selva, montaña, río y mar: Colombia es el escenario perfecto para quien busca experiencias que marquen la vida.",
    image:
      "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1600&q=80",
  },
  {
    number: "03",
    title: "Saborea la",
    highlight: "tradición",
    description:
      "Cada región tiene su sabor: del café del eje al ceviche del Pacífico, la gastronomía es parte del viaje.",
    image:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1600&q=80",
  },
  {
    number: "04",
    title: "Relájate en el",
    highlight: "paraíso tropical",
    description:
      "Aguas cristalinas, palmeras y atardeceres dorados. El Caribe colombiano te espera sin prisa.",
    image:
      "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=1600&q=80",
  },
  {
    number: "05",
    title: "Vive la noche al",
    highlight: "ritmo colombiano",
    description:
      "Salsa, vallenato y cumbia: aquí la noche es celebración, calor humano y música que no se olvida.",
    image:
      "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=1600&q=80",
  },
];

export const regions: RegionData[] = [
  {
    id: "caribe",
    name: "Caribe",
    tagline: "Sol, mar y ciudades coloniales",
    description:
      "Cartagena, Santa Marta y San Andrés: historia, playas de arena blanca y la magia del Caribe colombiano.",
    highlights: ["Cartagena", "Tayrona", "San Andrés"],
    image:
      "https://images.unsplash.com/photo-1555881400-74d7aca8b915?w=1200&q=80",
    position: { top: "18%", left: "72%" },
  },
  {
    id: "andina",
    name: "Andina",
    tagline: "Montañas, cultura y ciudades vibrantes",
    description:
      "Bogotá, Medellín y Boyacá: arte urbano, museos de clase mundial y paisajes de montaña.",
    highlights: ["Bogotá", "Medellín", "Villa de Leyva"],
    image:
      "https://images.unsplash.com/photo-1569163138750-85260835f72c?w=1200&q=80",
    position: { top: "42%", left: "48%" },
  },
  {
    id: "pacifico",
    name: "Pacífico",
    tagline: "Selva, ballenas y sabores únicos",
    description:
      "Nuquí, Bahía Solano y Cali: biodiversidad extrema, avistamiento de ballenas y cocina afrocolombiana.",
    highlights: ["Nuquí", "Cali", "Bahía Solano"],
    image:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
    position: { top: "55%", left: "28%" },
  },
  {
    id: "amazonia",
    name: "Amazonía",
    tagline: "El pulmón verde del planeta",
    description:
      "Leticia y la triple frontera: ríos infinitos, comunidades indígenas y naturaleza en estado puro.",
    highlights: ["Leticia", "Río Amazonas", "Parque Amacayacu"],
    image:
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=1200&q=80",
    position: { top: "68%", left: "58%" },
  },
  {
    id: "llanos",
    name: "Llanos",
    tagline: "Horizontes infinitos y fauna salvaje",
    description:
      "Yopal y Casanare: safaris llaneros, atardeceres dorados y la auténtica cultura del joropo.",
    highlights: ["Yopal", "Casanare", "Arauca"],
    image:
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
    position: { top: "38%", left: "62%" },
  },
  {
    id: "eje_cafetero",
    name: "Eje Cafetero",
    tagline: "Café, valle y paisaje cultural",
    description:
      "Salento, Filandia y Manizales: fincas cafeteras, cocora y el paisaje patrimonio de la humanidad.",
    highlights: ["Salento", "Filandia", "Manizales"],
    image:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80",
    position: { top: "52%", left: "42%" },
  },
];

export const passionCategories: PassionCategory[] = [
  {
    id: "playas",
    title: "Playas",
    subtitle: "Caribe y Pacífico",
    icon: "🏖️",
    image:
      "https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80",
  },
  {
    id: "aventura",
    title: "Aventura",
    subtitle: "Naturaleza y deportes",
    icon: "⛰️",
    image:
      "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800&q=80",
  },
  {
    id: "gastronomia",
    title: "Gastronomía",
    subtitle: "Sabores de Colombia",
    icon: "🍽️",
    image:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80",
  },
  {
    id: "cultura",
    title: "Cultura",
    subtitle: "Historia y patrimonio",
    icon: "🏛️",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7aca8b915?w=800&q=80",
  },
  {
    id: "cafe",
    title: "Café",
    subtitle: "Eje Cafetero",
    icon: "☕",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=800&q=80",
  },
  {
    id: "fauna",
    title: "Fauna",
    subtitle: "Parques y reservas",
    icon: "🦜",
    image:
      "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=800&q=80",
  },
];

export const featuredDestinations: FeaturedDestination[] = [
  {
    id: "cartagena",
    name: "Cartagena",
    region: "Caribe",
    category: "Ciudad amurallada",
    description:
      "Murallas coloniales, calles coloridas y el atardecer más romántico del Caribe colombiano.",
    image:
      "https://images.unsplash.com/photo-1555881400-74d7aca8b915?w=1200&q=80",
  },
  {
    id: "salento",
    name: "Salento",
    region: "Eje Cafetero",
    category: "Valle de Cocora",
    description:
      "Palmas de cera gigantes, fincas cafeteras y el pueblo más pintoresco del Quindío.",
    image:
      "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=1200&q=80",
  },
  {
    id: "medellin",
    name: "Medellín",
    region: "Andina",
    category: "Ciudad eterna primavera",
    description:
      "Innovación urbana, Comuna 13, museos y la energía de la segunda ciudad del país.",
    image:
      "https://images.unsplash.com/photo-1569163138750-85260835f72c?w=1200&q=80",
  },
  {
    id: "san-andres",
    name: "San Andrés",
    region: "Caribe",
    category: "Mar de siete colores",
    description:
      "Aguas turquesas, cultura raizal y el mar más cristalino del archipiélago.",
    image:
      "https://images.unsplash.com/photo-1540202404-a2f29016b523?w=1200&q=80",
  },
];

export const upcomingEvents: UpcomingEvent[] = [
  {
    id: "feria-flores",
    name: "Feria de las Flores",
    city: "Medellín",
    month: "Agosto",
    description: "Desfile de silleteros, conciertos y la fiesta más colorida de Antioquia.",
  },
  {
    id: "carnaval-barranquilla",
    name: "Carnaval de Barranquilla",
    city: "Barranquilla",
    month: "Febrero",
    description: "Patrimonio UNESCO: cuatro días de música, danza y tradición costeña.",
  },
  {
    id: "festival-vallenato",
    name: "Festival Vallenato",
    city: "Valledupar",
    month: "Abril",
    description: "La cuna del vallenato celebra sus leyendas en la tierra de Francisco el Hombre.",
  },
];

/** Videos de fondo hero — clips locales comprimidos (H.264, sin audio) */
export const heroVideoUrls = [
  "/videos/hero-1.mp4",
  "/videos/hero-2.mp4",
] as const;

export const heroPosterUrl = "/videos/hero-poster.jpg";
