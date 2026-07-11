/** Contenido visual del AI Trip Planner — estética inmersiva tipo GoDominican */

export const plannerVideoUrl =
  "https://videos.pexels.com/video-files/4434242/4434242-uhd_2560_1440_25fps.mp4";

export const plannerPosterUrl =
  "https://images.unsplash.com/photo-1580976010575-92a8068a12a8?w=1920&q=80";

export interface QuickPrompt {
  id: string;
  label: string;
  message: string;
  emoji: string;
}

/** Sugerencias rápidas para iniciar la conversación con Colu */
export const quickPrompts: QuickPrompt[] = [
  {
    id: "caribe",
    label: "Caribe colonial",
    emoji: "🏝️",
    message: "Quiero 4 días en Cartagena y playas del Caribe",
  },
  {
    id: "cafe",
    label: "Eje Cafetero",
    emoji: "☕",
    message: "Planifica un fin de semana en el Eje Cafetero con café y naturaleza",
  },
  {
    id: "aventura",
    label: "Aventura",
    emoji: "⛰️",
    message: "Busco aventura: trekking, ríos y naturaleza en 5 días",
  },
  {
    id: "gastronomia",
    label: "Gastronomía",
    emoji: "🍽️",
    message: "Un viaje gastronómico por Medellín y la región Andina",
  },
  {
    id: "eventos",
    label: "Con festivales",
    emoji: "🎉",
    message: "¿Hay algún festival próximo que pueda incluir en mi viaje?",
  },
  {
    id: "familia",
    label: "En familia",
    emoji: "👨‍👩‍👧",
    message: "Itinerario familiar de 3 días, actividades para niños",
  },
];
