import type { ItineraryDay } from "../types/itinerary.types";

export interface ItinerarySeedTemplate {
  title: string;
  user_email: string;
  days: ItineraryDayTemplate[];
}

interface ItineraryDayTemplate {
  day_number: number;
  title: string;
  morning: ItinerarySlotTemplate;
  afternoon: ItinerarySlotTemplate;
  night: ItinerarySlotTemplate;
}

interface ItinerarySlotTemplate {
  place_name?: string;
  activity: string;
  price?: number;
  price_type: "real" | "estimado";
  notes?: string;
}

/** Plantillas de itinerarios — place_name se resuelve contra la colección places */
export const itinerariesSeed: ItinerarySeedTemplate[] = [
  {
    title: "3 días en Cartagena",
    user_email: "viajero@colugares.com",
    days: [
      {
        day_number: 1,
        title: "Historia y centro amurallado",
        morning: {
          place_name: "Castillo de San Felipe de Barajas",
          activity: "Recorrido por la fortaleza colonial",
          price: 35000,
          price_type: "real",
          notes: "Llevar agua y bloqueador solar",
        },
        afternoon: {
          place_name: "Hotel Boutique Casa San Agustín",
          activity: "Check-in y descanso en patios coloniales",
          price: 850000,
          price_type: "real",
        },
        night: {
          place_name: "Restaurante La Cevichería",
          activity: "Cena de mariscos en Getsemaní",
          price: 95000,
          price_type: "real",
        },
      },
      {
        day_number: 2,
        title: "Islas y mar Caribe",
        morning: {
          place_name: "Tour Islas del Rosario",
          activity: "Excursión en lancha con snorkel",
          price: 180000,
          price_type: "real",
        },
        afternoon: {
          place_name: "Playa Blanca Barú",
          activity: "Tarde de playa en aguas cristalinas",
          price: 25000,
          price_type: "estimado",
          notes: "Incluye transporte en lancha compartida",
        },
        night: {
          place_name: "Restaurante Carmen",
          activity: "Cena fusión caribeña de autor",
          price: 220000,
          price_type: "real",
        },
      },
      {
        day_number: 3,
        title: "Naturaleza y despedida",
        morning: {
          place_name: "Tour Manglar La Boquilla",
          activity: "Canoa por manglares y pesca artesanal",
          price: 65000,
          price_type: "real",
        },
        afternoon: {
          place_name: "Volcán de Lodo El Totumo",
          activity: "Baño de lodo medicinal",
          price: 55000,
          price_type: "real",
        },
        night: {
          activity: "Paseo libre por el centro histórico",
          price: 0,
          price_type: "estimado",
        },
      },
    ],
  },
  {
    title: "4 días Caribe: Santa Marta y Tayrona",
    user_email: "viajero@colugares.com",
    days: [
      {
        day_number: 1,
        title: "Llegada a Santa Marta",
        morning: {
          place_name: "Hotel Irotama Resort",
          activity: "Check-in frente al mar en El Rodadero",
          price: 620000,
          price_type: "real",
        },
        afternoon: {
          activity: "Paseo por el malecón y centro histórico",
          price: 0,
          price_type: "estimado",
        },
        night: {
          place_name: "Restaurante Donde Wippy",
          activity: "Cena de pescado frito costeño",
          price: 45000,
          price_type: "real",
        },
      },
      {
        day_number: 2,
        title: "Parque Tayrona",
        morning: {
          place_name: "Parque Nacional Natural Tayrona",
          activity: "Ingreso y caminata a Cabo San Juan",
          price: 62000,
          price_type: "real",
          notes: "Reservar con anticipación en temporada alta",
        },
        afternoon: {
          place_name: "Parque Nacional Natural Tayrona",
          activity: "Playa y snorkel en arrecifes",
          price: 0,
          price_type: "estimado",
        },
        night: {
          activity: "Camping o regreso a Santa Marta",
          price: 80000,
          price_type: "estimado",
        },
      },
      {
        day_number: 3,
        title: "Minca en la Sierra",
        morning: {
          place_name: "Minca Eco Lodge",
          activity: "Alojamiento ecológico en la montaña",
          price: 280000,
          price_type: "real",
        },
        afternoon: {
          activity: "Cascada Marinka y café de finca",
          price: 30000,
          price_type: "estimado",
        },
        night: {
          activity: "Observación de estrellas desde el lodge",
          price: 0,
          price_type: "estimado",
        },
      },
      {
        day_number: 4,
        title: "Despedida caribeña",
        morning: {
          place_name: "Ciudad Perdida Trek",
          activity: "Información y preparación para trek (opcional)",
          price: 0,
          price_type: "estimado",
          notes: "El trek completo requiere 4-5 días adicionales",
        },
        afternoon: {
          activity: "Compras de artesanías en Santa Marta",
          price: 50000,
          price_type: "estimado",
        },
        night: {
          activity: "Traslado al aeropuerto",
          price: 35000,
          price_type: "estimado",
        },
      },
    ],
  },
];
