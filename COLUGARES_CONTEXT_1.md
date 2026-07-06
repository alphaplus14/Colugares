# 🗺️ Colugares — Documento de Contexto y Arquitectura para IA

> **Uso:** Entrega este archivo como contexto inicial a Cursor, Claude Code o cualquier LLM de desarrollo antes de comenzar cualquier tarea. Contiene el rol del asistente, el stack técnico, la arquitectura RAG, el modelo de negocio y las reglas de desarrollo que deben respetarse en todo momento.

---

## 🤖 Rol del Asistente de Desarrollo

Actúa como un **Arquitecto de Software Full-Stack Senior** especializado en:
- Aplicaciones MERN modernas con TypeScript estricto
- Sistemas RAG (Retrieval-Augmented Generation) con MongoDB Atlas Vector Search
- Integración de LLMs (Gemini, OpenAI) en productos de consumo
- UI/UX de portales turísticos e-commerce (referencia visual: GoDominican Republic)

Tu responsabilidad es construir **Colugares**, un portal turístico inteligente para Colombia. Cada decisión técnica debe priorizar: (1) funcionamiento correcto del RAG, (2) experiencia de usuario fluida, (3) código limpio y tipado, (4) escalabilidad desde el MVP.

---

## 🏢 Modelo de Negocio

**Colugares** es un portal de turismo nacional colombiano que opera bajo un modelo de **suscripción B2B + servicio B2C**:

- **Suscriptores (B2B):** Hoteles, agencias de viaje, restaurantes y atractivos turísticos pagan una mensualidad para estar en la base de datos de la plataforma. Sus datos (precios, disponibilidad, fotos) son ingresados por un equipo interno a través del CMS.
- **Viajeros (B2C):** Usuarios finales que acceden al portal, crean su perfil de intereses y usan el AI Trip Planner para generar itinerarios personalizados de forma gratuita (o con plan premium futuro).

**Diferenciador principal:** La IA **nunca recomienda lugares que no estén suscritos** en la base de datos. Todo itinerario se construye exclusivamente con datos curados del CMS interno.

---

## 🎨 Referencia Visual y UX

El diseño y experiencia de usuario debe inspirarse directamente en **[GoDominican Republic](https://www.godominicanrepublic.com/)** pero aplicado a Colombia:

- Hero banner con video en loop de paisajes colombianos
- Navegación limpia y minimalista
- Paleta cálida inspirada en la biodiversidad colombiana
- Llamado a la acción central: **"Iniciar Aventura"** que abre el AI Trip Planner
- Interfaz inmersiva, ultra visual, que inspire al viajero desde el primer clic
- El chat de la IA debe sentirse como hablar con un guía turístico experto, no con un bot

---

## 🛠️ Stack Tecnológico

### Frontend
| Tecnología | Versión | Uso |
|---|---|---|
| **Next.js** | 14+ (App Router) | Framework principal — SSR para SEO turístico |
| **TypeScript** | 5+ | Tipado estricto en todo el proyecto |
| **Tailwind CSS** | 3+ | Estilos utilitarios |
| **Mapbox GL JS** | Latest | Mapa interactivo del itinerario |
| **Vercel AI SDK** | Latest | Hook `useChat()` para streaming del LLM |

### Backend
| Tecnología | Versión | Uso |
|---|---|---|
| **Node.js** | 20+ | Runtime |
| **Express.js** | 4+ | API REST (o Next.js API Routes para MVP) |
| **TypeScript** | 5+ | Tipado estricto |
| **Zod** | Latest | Validación de schemas y payloads |
| **LangChain.js** | Latest | Orquestación del pipeline RAG |

### Base de Datos
| Tecnología | Uso |
|---|---|
| **MongoDB Atlas** | Base de datos principal — colecciones de lugares, usuarios, itinerarios |
| **Atlas Vector Search** | Búsqueda semántica sobre embeddings de lugares (índice `places_vector_idx`) |
| **MongoDB Native Driver** | Queries directas — NO usar Mongoose (bloquea `$vectorSearch`) |

### IA y Embeddings
| Servicio | Modelo | Uso |
|---|---|---|
| **Google Gemini** | `gemini-1.5-flash` | LLM principal del chat (tier gratuito en MVP) |
| **Google Gemini** | `text-embedding-004` | Generación de embeddings (gratis) |
| **OpenAI** | `gpt-4o-mini` | Alternativa de LLM (cuando se supere free tier) |
| **OpenAI** | `text-embedding-3-small` | Alternativa de embeddings ($0.02/1M tokens) |

### Auth y Sesiones
| Tecnología | Uso |
|---|---|
| **Auth.js (NextAuth v5)** | Autenticación — Google OAuth + Credentials |
| **JWT** | Tokens de sesión con rol embebido (Admin / Empleado / Viajero) |

### Infraestructura MVP
| Servicio | Uso |
|---|---|
| **Vercel** | Hosting frontend + API Routes (plan gratuito para MVP) |
| **MongoDB Atlas M0** | Base de datos gratuita para desarrollo |
| **MongoDB Atlas M10** | Producción — activa Vector Search ($57/mes) |

---

## 🏗️ Arquitectura del Sistema

### Estructura de carpetas (monorepo Next.js)

```
colugares/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Rutas públicas del portal
│   │   ├── page.tsx              # Home — Hero banner
│   │   ├── destinos/page.tsx     # Explorador de destinos
│   │   └── planner/page.tsx      # AI Trip Planner (chat)
│   ├── (auth)/                   # Login / registro viajero
│   │   └── login/page.tsx
│   └── admin/                    # Panel interno (Admin + Empleado)
│       ├── dashboard/page.tsx
│       ├── lugares/page.tsx      # CMS de destinos
│       └── usuarios/page.tsx     # Gestión de empleados
├── api/                          # API Routes de Next.js
│   ├── planner/
│   │   └── chat/route.ts         # Endpoint RAG principal (streaming)
│   ├── places/
│   │   └── route.ts              # CRUD de lugares
│   └── auth/
│       └── [...nextauth]/route.ts
├── lib/
│   ├── mongodb.ts                # Conexión al driver nativo de MongoDB
│   ├── embeddings.ts             # Generación de embeddings (Gemini)
│   ├── rag/
│   │   ├── retriever.ts          # $vectorSearch pipeline
│   │   ├── context-builder.ts    # Formatea documentos para el LLM
│   │   └── chain.ts              # LangChain.js — chain RAG completo
│   ├── prompts/
│   │   └── system-prompt.ts      # System Prompt blindado del planner
│   └── validators/
│       └── planner.schema.ts     # Schemas Zod de validación
├── components/
│   ├── planner/
│   │   ├── ChatWindow.tsx        # Interfaz del chat
│   │   ├── ItineraryCard.tsx     # Tarjeta del itinerario generado
│   │   └── MapView.tsx           # Mapa Mapbox del itinerario
│   ├── ui/                       # Componentes reutilizables
│   └── layout/
│       ├── Navbar.tsx
│       └── HeroBanner.tsx
└── types/
    ├── place.types.ts            # Tipos TypeScript de Place, Hotel, Activity
    ├── user.types.ts             # Tipos de User, TravelProfile
    └── itinerary.types.ts        # Tipos del itinerario generado
```

---

## 🗄️ Schemas de MongoDB

### Colección: `places`

```typescript
// types/place.types.ts
interface Place {
  _id: ObjectId;
  name: string;
  type: 'hotel' | 'restaurante' | 'actividad' | 'atractivo' | 'agencia';
  region: 'caribe' | 'andina' | 'pacifico' | 'amazonia' | 'llanos' | 'eje_cafetero';
  department: string;        // Ej: "Bolívar", "Antioquia"
  city: string;
  description: string;       // Texto largo — se vectoriza
  tags: string[];            // Ej: ["buceo", "familia", "gastronomia"]
  budget_tier: 'bajo' | 'medio' | 'alto';
  price_real?: {
    amount: number;          // En COP
    unit: 'noche' | 'persona' | 'grupo' | 'dia';
    currency: 'COP';
    season_note?: string;    // Ej: "temporada alta diciembre-enero"
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  photos: string[];          // URLs
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  vector_embedding: number[]; // 768 dims — generado automáticamente al guardar
  is_subscriber: boolean;     // Solo true si paga suscripción activa
  active: boolean;
  created_at: Date;
  updated_at: Date;
}
```

### Colección: `users`

```typescript
// types/user.types.ts
interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password_hash?: string;    // null si usa Google OAuth
  role: 'admin' | 'empleado' | 'viajero';
  travel_profile?: {         // Solo para viajeros
    primary_interests: string[];   // Filtro duro del RAG
    secondary_interests: string[]; // Sugerencias opcionales
    budget_range: 'bajo' | 'medio' | 'alto';
    travel_pace: 'intenso' | 'relajado';
    group_type: 'solo' | 'pareja' | 'familia' | 'amigos';
    onboarding_completed: boolean;
  };
  visited_places: ObjectId[];      // IDs de places ya visitados — excluidos del RAG
  saved_itineraries: ObjectId[];
  created_at: Date;
  last_login: Date;
}
```

### Colección: `itineraries`

```typescript
// types/itinerary.types.ts
interface Itinerary {
  _id: ObjectId;
  user_id: ObjectId;
  title: string;             // Ej: "4 días en el Eje Cafetero"
  days: ItineraryDay[];
  total_budget_real: number; // Suma de precios reales COP
  total_budget_estimated: number; // Suma de estimados COP
  generated_at: Date;
  places_used: ObjectId[];   // Referencias a places del RAG
}

interface ItineraryDay {
  day_number: number;
  title: string;
  morning: ItinerarySlot;
  afternoon: ItinerarySlot;
  night: ItinerarySlot;
}

interface ItinerarySlot {
  place_id?: ObjectId;       // null si es estimado
  activity: string;
  price?: number;
  price_type: 'real' | 'estimado';
  notes?: string;
  coordinates?: { lat: number; lng: number };
}
```

### Colección: `events`

```typescript
interface Event {
  _id: ObjectId;
  name: string;              // Ej: "Feria de las Flores"
  region: string;
  city: string;
  start_date: Date;
  end_date: Date;
  description: string;
  tags: string[];
  active: boolean;
}
```

---

## 🤖 Pipeline RAG — Flujo Completo

El pipeline se ejecuta en `api/planner/chat/route.ts` con cada mensaje del usuario:

```typescript
// Flujo simplificado del pipeline RAG
async function ragPipeline(userMessage: string, userId: string, history: Message[]) {

  // PASO 1 — Cargar perfil del usuario
  const user = await db.collection('users').findOne({ _id: userId });
  const profile = user.travel_profile;

  // PASO 2 — Generar embedding del mensaje
  const queryEmbedding = await generateEmbedding(userMessage);
  // Gemini text-embedding-004 → vector de 768 dimensiones

  // PASO 3 — $vectorSearch con filtros de perfil (RAG Retrieval)
  const places = await db.collection('places').aggregate([
    {
      $vectorSearch: {
        index: 'places_vector_idx',
        queryVector: queryEmbedding,
        filter: {
          region: { $in: profile.primary_interests },
          _id: { $nin: profile.visited_places },
          is_subscriber: true,
          active: true
        },
        numCandidates: 50,
        limit: 10
      }
    }
  ]).toArray();

  // PASO 4 — Búsqueda secundaria para intereses secundarios
  const secondaryPlaces = await db.collection('places').aggregate([
    {
      $vectorSearch: {
        index: 'places_vector_idx',
        queryVector: queryEmbedding,
        filter: { region: { $in: profile.secondary_interests }, is_subscriber: true },
        numCandidates: 20,
        limit: 3
      }
    }
  ]).toArray();

  // PASO 5 — Verificar eventos en fechas mencionadas
  const events = await checkEventsInDates(userMessage);

  // PASO 6 — Construir contexto para el LLM
  const context = buildContext(places, secondaryPlaces, events);

  // PASO 7 — Llamar al LLM con streaming
  const stream = await gemini.streamGenerateContent({
    systemInstruction: buildSystemPrompt(profile, context),
    contents: [...history, { role: 'user', parts: [{ text: userMessage }] }]
  });

  return stream; // Se envía como SSE al cliente
}
```

---

## 📋 System Prompt del AI Trip Planner

```
## IDENTIDAD
Eres "Colu", el asistente de viajes de Colugares — el portal turístico
inteligente de Colombia. Tu tono es cálido, profesional y cercano.
Hablas como un guía turístico experto en Colombia, nunca como un bot.
Usa "tú" con usuarios jóvenes y "usted" con contextos formales.

## PERFIL DEL VIAJERO
Nombre: {usuario.nombre}
Intereses principales: {usuario.primary_interests}
Presupuesto: {usuario.budget_range}
Ya visitó: {usuario.visited_places}
Tipo de grupo: {usuario.group_type}
Ritmo preferido: {usuario.travel_pace}

## REGLA ABSOLUTA — BASE DE DATOS
SOLO puedes recomendar lugares que aparezcan en "LUGARES DISPONIBLES"
que recibirás más abajo. Esta regla no tiene excepciones.

Si el usuario pide un destino que NO está en la lista:
  1. Díselo honestamente: "No tengo información registrada de ese lugar."
  2. Ofrece la alternativa más cercana que SÍ esté disponible.

NUNCA inventes nombres de hoteles, restaurantes o actividades.
NUNCA uses conocimiento general de Colombia para recomendar lugares.
NUNCA menciones TripAdvisor, Booking, Airbnb u otras plataformas.

## REGLA DE INTERESES
- Propón SIEMPRE primero destinos de: {primary_interests}
- Destinos de {secondary_interests}: solo al final como sugerencia opcional
  con la frase exacta: "Si en algún momento quieres explorar algo diferente..."

## REGLA DE PRECIOS
- Precio "real": muéstralo como precio oficial. Ej: "$320.000/noche"
- Precio "estimado": siempre agrega "(estimado)". Ej: "~$35.000 (estimado)"
- Si el total supera el presupuesto del perfil: alerta y propón alternativas.

## COMPORTAMIENTO CONVERSACIONAL
- Primer mensaje: propón un plan base día por día (mañana/tarde/noche)
  usando el perfil, sin esperar que el usuario lo solicite.
- Mensajes siguientes: ajusta el plan según instrucciones del usuario.
- Haz máximo 1 pregunta de aclaración por turno.
- Si detectas fechas, menciona eventos o festividades de esas fechas.
- Alerta de inconsistencias geográficas (ej: Cartagena + Amazonas en 2 días).

## FORMATO DE RESPUESTA
Usa markdown. Estructura los días así:
**Día 1 — [Título del día]**
🌅 Mañana: [actividad] — [precio si aplica]
☀️ Tarde: [actividad] — [precio si aplica]
🌙 Noche: [actividad] — [precio si aplica]

## LUGARES DISPONIBLES EN BASE DE DATOS
{contexto_recuperado_de_mongodb}

## EVENTOS EN LAS FECHAS DEL VIAJE
{eventos_detectados}
```

---

## 👥 Roles y Permisos (RBAC)

| Rol | Acceso | Restricciones |
|---|---|---|
| **Admin** | Total — todas las rutas `/admin/*` | Ninguna |
| **Empleado** | `/admin/lugares`, `/admin/contenido` | No puede eliminar registros permanentemente |
| **Viajero** | Portal público + AI Planner + perfil | No accede al panel admin |

Protección de rutas mediante middleware de Next.js que verifica el rol en el JWT.

Bloqueo de cuenta: 5 intentos fallidos → bloqueo 15 minutos + email de notificación.

---

## 🗓️ Épicas y Funcionalidades (Product Backlog)

### Épica 1 — Autenticación y Seguridad
- **HU-01:** Login Admin/Empleado con email + contraseña encriptada (bcrypt)
- **HU-02:** Cierre de sesión con invalidación de token
- **HU-03:** Creación de cuentas de empleados con envío de email de configuración

### Épica 2 — CMS Turístico
- **HU-04:** Formulario de carga de lugares (hoteles, actividades, atractivos)
  - Al guardar: generar `vector_embedding` automáticamente con Gemini Embeddings
  - Campos obligatorios: coordenadas lat/lng, medios de transporte recomendados
  - El lugar queda indexable por el motor de IA inmediatamente al publicar

### Épica 3 — Perfil del Viajero
- **HU-05:** Registro + quiz de onboarding (4 preguntas sobre intereses y estilo de viaje)
- Modificación dinámica de intereses desde `/mi-perfil/preferencias`
- Los cambios de perfil afectan inmediatamente las recomendaciones del planner

### Épica 4 — AI Trip Planner (Core)
- **HU-06:** Chat híbrido — la IA propone plan base desde el perfil y el usuario ajusta
- **HU-07:** Visualización del itinerario en mapa Mapbox con marcadores numerados
- Alerta geográfica automática si el itinerario es logísticamente inviable
- Los itinerarios se pueden guardar en el perfil del usuario

### Épica 5 — Eventos y Festividades
- **HU-08:** Calendario de festividades nacionales (colección `events` en MongoDB)
- La IA detecta automáticamente si el viaje coincide con un evento e inyecta la info

### Épica 6 — UI/UX Inmersiva
- **HU-09:** Hero banner con video en loop + botón "Iniciar Aventura"
- Diseño al estilo GoDominican — inmersivo, visual, inspiracional

---

## ⚠️ Reglas de Desarrollo (Obligatorias)

1. **TypeScript estricto:** `strict: true` en `tsconfig.json`. Sin `any` explícitos.
2. **Driver nativo MongoDB:** No usar Mongoose. Las queries de `$vectorSearch` requieren el driver nativo.
3. **Zod en todos los endpoints:** Validar input del usuario antes de cualquier operación.
4. **Variables de entorno:** Nunca hardcodear API keys. Usar `.env.local` con tipos en `env.d.ts`.
5. **Embeddings en background:** Al guardar un `place` en el CMS, generar el embedding en un job asíncrono (no bloquear la respuesta del usuario).
6. **Streaming obligatorio:** El endpoint del planner siempre responde con SSE, nunca con JSON síncrono.
7. **Sin alucinaciones:** El System Prompt del LLM debe incluirse completo en cada llamada. No confiar en "memoria" del modelo entre sesiones.
8. **Separación de contextos RAG:** El pool de `primary_interests` y `secondary_interests` siempre se pasan al LLM en secciones separadas del prompt.
9. **Errores amigables:** Nunca exponer stack traces al cliente. Mensajes de error en español colombiano.
10. **Comentarios en español:** El código puede estar en inglés técnico, los comentarios de lógica de negocio en español para claridad del equipo.

---

## 🔑 Variables de Entorno Requeridas

```env
# MongoDB
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=colugares

# Google Gemini
GEMINI_API_KEY=...

# OpenAI (alternativa / embeddings de respaldo)
OPENAI_API_KEY=...

# Auth.js
NEXTAUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Mapbox
NEXT_PUBLIC_MAPBOX_TOKEN=...

# Email (notificaciones de cuenta)
SMTP_HOST=...
SMTP_PORT=...
SMTP_USER=...
SMTP_PASS=...
```

---

## 🚀 Orden de Desarrollo Sugerido (MVP)

```
Fase 1 — Base (semanas 1-2)
  ✅ Setup Next.js 14 + TypeScript + Tailwind
  ✅ Conexión MongoDB Atlas + driver nativo
  ✅ Auth.js con Google OAuth + Credentials
  ✅ RBAC middleware para rutas /admin

Fase 2 — CMS y datos (semanas 3-4)
  ✅ Schema de Place en MongoDB + índice vectorial en Atlas
  ✅ Formulario CMS de carga de lugares
  ✅ Job de generación de embeddings al guardar un place
  ✅ Seed de datos iniciales (20-30 lugares del Caribe colombiano)

Fase 3 — AI Planner (semanas 5-6)
  ✅ Endpoint POST /api/planner/chat con pipeline RAG completo
  ✅ System Prompt blindado implementado
  ✅ Streaming con Vercel AI SDK + useChat() en frontend
  ✅ Onboarding quiz del viajero (4 preguntas)

Fase 4 — UI inmersiva (semanas 7-8)
  ✅ Hero banner con video en loop
  ✅ Chat UI del planner
  ✅ Mapa Mapbox del itinerario
  ✅ Perfil del viajero + historial de itinerarios

Fase 5 — Polish y lanzamiento
  ✅ Calendario de eventos y festividades
  ✅ Alertas geográficas del planner
  ✅ Deploy en Vercel + MongoDB Atlas M10
  ✅ Pruebas con usuarios reales
```

---

*Documento generado para el proyecto Colugares — Portal Turístico Inteligente de Colombia*
*Stack: Next.js 14 · TypeScript · MongoDB Atlas · Gemini AI · LangChain.js · Mapbox*
