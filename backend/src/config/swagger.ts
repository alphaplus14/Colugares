import swaggerJSDoc from "swagger-jsdoc";

const definition = {
  openapi: "3.0.0",
  info: {
    title: "Places API",
    version: "1.0.0",
    description:
      "API interna (CMS) para gestión de lugares (hoteles, restaurantes, actividades, atractivos, agencias) con generación de embeddings vectoriales en background.",
  },
  servers: [
    { url: "http://localhost:4000", description: "Servidor local" },
  ],
  components: {
    securitySchemes: {
      internalKeyAuth: {
        type: "apiKey",
        in: "header",
        name: "X-Internal-Key",
        description:
          "Clave interna compartida entre el proxy de Next.js y este servicio. Requerida en todas las rutas de /api/places.",
      },
      userRoleHeader: {
        type: "apiKey",
        in: "header",
        name: "X-User-Role",
        description:
          "Rol del usuario ya verificado por Auth.js en el proxy. Valores válidos: 'admin' o 'empleado'. Algunas rutas requieren específicamente 'admin'.",
      },
    },
    schemas: {
      PlacePrice: {
        type: "object",
        properties: {
          amount: { type: "number", example: 250000 },
          unit: {
            type: "string",
            enum: ["noche", "persona", "grupo", "dia"],
          },
          currency: { type: "string", enum: ["COP"] },
          season_note: { type: "string", maxLength: 200 },
        },
        required: ["amount", "unit", "currency"],
      },
      PlaceCoordinates: {
        type: "object",
        properties: {
          lat: { type: "number", minimum: -90, maximum: 90, example: 10.4236 },
          lng: { type: "number", minimum: -180, maximum: 180, example: -75.5253 },
        },
        required: ["lat", "lng"],
      },
      PlaceContact: {
        type: "object",
        properties: {
          phone: { type: "string", maxLength: 30 },
          email: { type: "string", format: "email" },
          website: { type: "string", format: "uri" },
        },
      },
      PlaceInput: {
        type: "object",
        required: [
          "name",
          "type",
          "region",
          "department",
          "city",
          "description",
          "tags",
          "budget_tier",
          "coordinates",
          "recommended_transport",
        ],
        properties: {
          name: { type: "string", minLength: 2, maxLength: 120 },
          type: {
            type: "string",
            enum: ["hotel", "restaurante", "actividad", "atractivo", "agencia"],
          },
          region: {
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
          department: { type: "string", minLength: 2, maxLength: 80 },
          city: { type: "string", minLength: 2, maxLength: 80 },
          description: {
            type: "string",
            minLength: 20,
            maxLength: 5000,
            description: "Debe tener suficiente contenido para generar el embedding vectorial",
          },
          tags: {
            type: "array",
            items: { type: "string", maxLength: 40 },
            minItems: 1,
          },
          budget_tier: { type: "string", enum: ["bajo", "medio", "alto"] },
          price_real: { $ref: "#/components/schemas/PlacePrice" },
          coordinates: { $ref: "#/components/schemas/PlaceCoordinates" },
          photos: {
            type: "array",
            items: { type: "string", format: "uri" },
            default: [],
          },
          contact: { $ref: "#/components/schemas/PlaceContact" },
          recommended_transport: {
            type: "array",
            items: { type: "string", maxLength: 60 },
            minItems: 1,
          },
          is_subscriber: { type: "boolean", default: true },
          active: { type: "boolean", default: true },
        },
      },
      Place: {
        allOf: [
          { $ref: "#/components/schemas/PlaceInput" },
          {
            type: "object",
            properties: {
              _id: { type: "string", example: "6650f1c2e4b0a1b2c3d4e5f6" },
              embedding_status: {
                type: "string",
                enum: ["pending", "ready", "failed"],
              },
              created_at: { type: "string", format: "date-time" },
              updated_at: { type: "string", format: "date-time" },
            },
          },
        ],
      },
      ErrorResponse: {
        type: "object",
        properties: {
          status: { type: "string", example: "error" },
          message: { type: "string" },
        },
      },
    },
  },
  // se aplica por defecto a todas las rutas de /api/places (montan internalAuth)
  security: [{ internalKeyAuth: [], userRoleHeader: [] }],
};

const options: swaggerJSDoc.Options = {
  definition,
  apis: ["./src/places/*.ts", "./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
