import swaggerJSDoc from "swagger-jsdoc";

const definition = {
  openapi: "3.0.0",
  info: {
    title: "CoLugares — API Next.js (BFF)",
    version: "1.0.0",
    description:
      "API pública y de aplicación de CoLugares, construida como Route Handlers de Next.js (App Router). " +
      "Incluye: autenticación (NextAuth), CMS de administración (proxy hacia el microservicio de Places), " +
      "gestión de usuarios, eventos, itinerarios guardados, perfil de viaje/onboarding y el AI Trip Planner (RAG). " +
      "Las rutas del CMS (`/api/places*`, `/api/admin/*`) reenvían la petición al backend Express interno.",
  },
  servers: [{ url: "http://localhost:3000", description: "Servidor local" }],
  components: {
    securitySchemes: {
      sessionCookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "authjs.session-token",
        description:
          "Cookie de sesión creada por Auth.js (NextAuth) al iniciar sesión vía /api/auth/[...nextauth]. " +
          "En producción con HTTPS el nombre real de la cookie es '__Secure-authjs.session-token'.",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "error" },
          message: { type: "string" },
        },
      },
      PaginationMeta: {
        type: "object",
        properties: {
          page: { type: "integer", example: 1 },
          limit: { type: "integer", example: 10 },
          total: { type: "integer", example: 42 },
          totalPages: { type: "integer", example: 5 },
          hasNext: { type: "boolean" },
          hasPrev: { type: "boolean" },
        },
      },
      ColombiaRegion: {
        type: "string",
        enum: [
          "caribe",
          "andina",
          "pacifico",
          "amazonia",
          "llanos",
          "eje_cafetero",
        ],
      },
      UserRole: {
        type: "string",
        enum: ["admin", "empleado", "viajero"],
      },
      AdminUser: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          role: { $ref: "#/components/schemas/UserRole" },
          active: { type: "boolean" },
          onboarding_completed: { type: "boolean" },
          itineraries_count: { type: "integer" },
          created_at: { type: "string", format: "date-time" },
          last_login: { type: "string", format: "date-time" },
        },
      },
      AdminEvent: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          region: { $ref: "#/components/schemas/ColombiaRegion" },
          city: { type: "string" },
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time" },
          description: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
          month_label: { type: "string", example: "Agosto" },
          active: { type: "boolean" },
        },
      },
      EventInput: {
        type: "object",
        required: [
          "name",
          "region",
          "city",
          "start_date",
          "end_date",
          "description",
        ],
        properties: {
          name: { type: "string", minLength: 3, maxLength: 120 },
          region: { $ref: "#/components/schemas/ColombiaRegion" },
          city: { type: "string", minLength: 2, maxLength: 80 },
          start_date: { type: "string", format: "date-time" },
          end_date: { type: "string", format: "date-time" },
          description: { type: "string", minLength: 20, maxLength: 2000 },
          tags: { type: "array", items: { type: "string" }, default: [] },
          active: { type: "boolean", default: true },
        },
      },
      TravelProfile: {
        type: "object",
        properties: {
          primary_interests: {
            type: "array",
            items: { $ref: "#/components/schemas/ColombiaRegion" },
          },
          secondary_interests: {
            type: "array",
            items: { $ref: "#/components/schemas/ColombiaRegion" },
          },
          budget_range: { type: "string", enum: ["bajo", "medio", "alto"] },
          group_type: {
            type: "string",
            enum: ["solo", "pareja", "familia", "amigos"],
          },
          travel_pace: { type: "string", enum: ["intenso", "relajado"] },
          onboarding_completed: { type: "boolean" },
        },
      },
      ItinerarySlot: {
        type: "object",
        properties: {
          period: { type: "string", enum: ["mañana", "tarde", "noche"] },
          place_id: { type: "string" },
          place_name: { type: "string" },
          activity: { type: "string" },
          price_label: { type: "string" },
          coordinates: {
            type: "object",
            properties: {
              lat: { type: "number" },
              lng: { type: "number" },
            },
          },
        },
      },
      ItineraryDay: {
        type: "object",
        properties: {
          day_number: { type: "integer" },
          title: { type: "string" },
          slots: {
            type: "array",
            items: { $ref: "#/components/schemas/ItinerarySlot" },
          },
        },
      },
      ItineraryDetail: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
          region: { type: "string" },
          days: {
            type: "array",
            items: { $ref: "#/components/schemas/ItineraryDay" },
          },
          places_used: { type: "array", items: { type: "string" } },
          geography_warnings: { type: "array", items: { type: "string" } },
          raw_content: { type: "string" },
          created_at: { type: "string", format: "date-time" },
          updated_at: { type: "string", format: "date-time" },
        },
      },
      ItineraryListItem: {
        type: "object",
        properties: {
          _id: { type: "string" },
          title: { type: "string" },
          region: { type: "string" },
          days_count: { type: "integer" },
          created_at: { type: "string", format: "date-time" },
        },
      },
      PlaceSummary: {
        type: "object",
        properties: {
          _id: { type: "string" },
          name: { type: "string" },
          type: {
            type: "string",
            enum: ["hotel", "restaurante", "actividad", "atractivo", "agencia"],
          },
          region: { $ref: "#/components/schemas/ColombiaRegion" },
          department: { type: "string" },
          city: { type: "string" },
          description: { type: "string" },
          tags: { type: "array", items: { type: "string" } },
          budget_tier: { type: "string", enum: ["bajo", "medio", "alto"] },
          photos: { type: "array", items: { type: "string" } },
          coordinates: {
            type: "object",
            properties: {
              lat: { type: "number" },
              lng: { type: "number" },
            },
          },
        },
      },
    },
  },
};

const options: swaggerJSDoc.Options = {
  definition,
  apis: ["./src/app/api/**/route.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
