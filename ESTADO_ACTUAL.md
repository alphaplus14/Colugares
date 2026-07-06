# Colugares — Estado actual del proyecto

> Generado: julio 2026 · Stack: Next.js 14 · Express · MongoDB local · Gemini API

---

## 1. Fases completadas

| Fase | Estado | Entregables |
|------|--------|-------------|
| **Fase 1 — Base** | ✅ Completada | Next.js 14 + TypeScript + Tailwind, MongoDB driver nativo, Auth.js (Google + Credentials), RBAC middleware `/admin`, Express + health check |
| **Fase 2 — CMS y datos** | ✅ Completada | Schema `Place`, CRUD CMS, embeddings Gemini (`gemini-embedding-001`), seed 25 lugares Caribe, admin `/admin/lugares` |
| **Home inmersiva (preview Fase 4)** | ✅ Parcial | Hero con video, secciones scroll, mapa regiones, carrusel destinos — inspirado en GoDominican |
| **Fase 3 — AI Trip Planner** | ⏳ Pendiente | Chat RAG, `/planner`, LangChain, streaming Vercel AI SDK |
| **Fase 4 — UI final** | ⏳ Pendiente | Hero con video real Colombia, Mapbox itinerario, perfil viajero |
| **Fase 5 — Eventos + deploy** | ⏳ Pendiente | Calendario festividades, Atlas M10, Vector Search en producción |

### Datos en MongoDB local (`colugares`)

| Colección | Documentos | Estado |
|-----------|------------|--------|
| `users` | 1 admin | `admin@colugares.com` / `Admin123!` |
| `places` | 25 (Caribe) | `embedding_status: "ready"`, vectores 768 dims |
| `itineraries` | — | No creada aún (Fase 3) |
| `events` | — | No creada aún (Fase 5) |

---

## 2. Archivos creados y su función

### Raíz del proyecto

| Archivo | Función |
|---------|---------|
| `COLUGARES_CONTEXT_1.md` | Documento de arquitectura, schemas, reglas de desarrollo |
| `README.md` | Instalación split frontend/backend |
| `ESTADO_ACTUAL.md` | Este resumen de estado |
| `.gitignore` | Ignora `node_modules`, `.next`, `dist`, `.env`, builds |

---

### Frontend (`frontend/`)

#### Configuración

| Archivo | Función |
|---------|---------|
| `package.json` | Dependencias: Next.js 14, Auth.js, Tailwind, MongoDB, Zod |
| `next.config.mjs` | Config Next.js (App Router) |
| `tailwind.config.ts` | Paleta `colombia-green/gold/red`, animaciones |
| `postcss.config.js` | Pipeline Tailwind |
| `tsconfig.json` | TypeScript estricto, alias `@/*` → `src/*` |
| `.env.example` / `.env.local` | URI MongoDB, Auth.js, proxy backend |

#### App Router — páginas

| Archivo | Ruta | Función |
|---------|------|---------|
| `src/app/layout.tsx` | — | Layout raíz + Navbar + SessionProvider |
| `src/app/globals.css` | — | Tailwind + scroll suave |
| `src/app/(public)/page.tsx` | `/` | Home inmersiva (compone `HomePage`) |
| `src/app/(auth)/login/page.tsx` | `/login` | Login admin (credentials) + Google OAuth |
| `src/app/admin/layout.tsx` | `/admin/*` | Sidebar panel admin |
| `src/app/admin/dashboard/page.tsx` | `/admin/dashboard` | Dashboard placeholder |
| `src/app/admin/lugares/page.tsx` | `/admin/lugares` | Listado CMS lugares |
| `src/app/admin/lugares/nuevo/page.tsx` | `/admin/lugares/nuevo` | Formulario crear lugar |
| `src/app/admin/lugares/[id]/editar/page.tsx` | `/admin/lugares/:id/editar` | Formulario editar lugar |

#### API Routes (proxy autenticado → backend)

| Archivo | Endpoint | Función |
|---------|----------|---------|
| `src/app/api/auth/[...nextauth]/route.ts` | `/api/auth/*` | Handler Auth.js v5 |
| `src/app/api/places/route.ts` | `GET/POST /api/places` | Lista y crea lugares (proxy) |
| `src/app/api/places/[id]/route.ts` | `GET/PUT/DELETE/PATCH /api/places/:id` | CRUD + deactivate + reindex |

#### Auth y seguridad

| Archivo | Función |
|---------|---------|
| `src/middleware.ts` | RBAC Edge-safe: bloquea `/admin/*` sin rol admin/empleado |
| `src/lib/auth.config.ts` | Config Auth.js ligera (sin MongoDB en Edge) |
| `src/lib/auth.ts` | Auth.js completo: Google + Credentials + callbacks MongoDB |
| `src/lib/mongodb.ts` | Driver nativo singleton (Auth callbacks) |
| `src/lib/backend-proxy.ts` | Valida sesión y reenvía al Express con `X-Internal-Key` |
| `src/lib/validators/auth.schema.ts` | Zod: email/password login |

#### Tipos

| Archivo | Función |
|---------|---------|
| `src/types/user.types.ts` | User, TravelProfile, roles |
| `src/types/place.types.ts` | Place, labels UI, form types |
| `src/types/next-auth.d.ts` | Extensión sesión JWT con `role` |

#### Componentes — layout

| Archivo | Función |
|---------|---------|
| `src/components/providers/SessionProvider.tsx` | Wrapper `next-auth/react` |
| `src/components/layout/Navbar.tsx` | Nav con estado de sesión |

#### Componentes — home (público)

| Archivo | Función |
|---------|---------|
| `src/components/home/HomePage.tsx` | Orquesta todas las secciones home |
| `src/components/home/HeroBanner.tsx` | Hero full-screen + video + CTA |
| `src/components/home/StorySections.tsx` | 5 secciones scroll (estilo GoDominican) |
| `src/components/home/RegionExplorer.tsx` | Mapa interactivo 6 regiones Colombia |
| `src/components/home/PassionCategories.tsx` | Grid categorías (playas, aventura…) |
| `src/components/home/DestinationShowcase.tsx` | Carrusel destinos destacados |
| `src/components/home/EventsTeaser.tsx` | Preview festividades (Fase 5) |
| `src/components/home/FinalCta.tsx` | CTA final "Iniciar Aventura" |
| `src/components/home/ScrollReveal.tsx` | Animaciones al scroll (IntersectionObserver) |
| `src/lib/home-content.ts` | Datos estáticos home (regiones, destinos, eventos) |

#### Componentes — admin CMS

| Archivo | Función |
|---------|---------|
| `src/components/admin/PlaceForm.tsx` | Formulario Zod-compatible crear/editar lugar |
| `src/components/admin/PlacesListClient.tsx` | Tabla lugares, filtros, re-indexar, RBAC delete |

---

### Backend (`backend/`)

#### Configuración

| Archivo | Función |
|---------|---------|
| `package.json` | Express, MongoDB, Gemini, Zod, bcrypt, scripts `seed`/`reindex` |
| `tsconfig.json` | TypeScript → `dist/` |
| `.env.example` / `.env` | MongoDB local, Gemini, INTERNAL_API_KEY |

#### Entry point y rutas

| Archivo | Función |
|---------|---------|
| `src/index.ts` | Express :4000, CORS, monta `/api/health` y `/api/places` |
| `src/routes/health.routes.ts` | `GET /api/health` — ping servidor + MongoDB |

#### Módulo places (patrón instructor: routes → controller)

| Archivo | Función |
|---------|---------|
| `src/places/place.routes.ts` | Rutas CRUD protegidas con `internalAuth` |
| `src/places/place.controller.ts` | Lógica CRUD, encola embedding al guardar |

#### Servicios IA

| Archivo | Función |
|---------|---------|
| `src/services/embeddings.ts` | Gemini `gemini-embedding-001` vía REST, 768 dims |
| `src/services/embeddingJob.ts` | Job async post-save (no bloquea HTTP) |

#### Middleware

| Archivo | Función |
|---------|---------|
| `src/middleware/internalAuth.ts` | Valida `X-Internal-Key` + rol desde Next.js proxy |
| `src/middleware/authMiddleware.ts` | JWT `protect` + `requireRole` (API REST futura) |
| `src/middleware/errorMiddleware.ts` | Errores en español, sin stack trace |
| `src/middleware/checkObjectId.ts` | Valida `:id` MongoDB |

#### Tipos, validación, utils

| Archivo | Función |
|---------|---------|
| `src/types/user.types.ts` | User, JwtPayload |
| `src/types/place.types.ts` | Place completo + PlacePublicResponse |
| `src/validators/place.schema.ts` | Zod create/update Place |
| `src/utils/params.ts` | Parseo seguro `req.params.id` |
| `src/config/mongodb.ts` | Driver nativo singleton (NO Mongoose) |

#### Scripts y datos

| Archivo | Función |
|---------|---------|
| `src/scripts/seed.ts` | Crea admin + 25 lugares Caribe |
| `src/scripts/reindex-pending.ts` | Re-genera embeddings pending/failed |
| `src/data/caribe-seed.ts` | Array 25 lugares seed Caribe colombiano |

---

## 3. Decisiones técnicas tomadas

### Arquitectura

- **Split `frontend/` + `backend/`** (no monorepo de raíz). El diagrama en `COLUGARES_CONTEXT_1.md` es conceptual; la implementación real sigue el README.
- **Auth en Next.js (Auth.js v5)**, no JWT manual como el proyecto del instructor.
- **CMS vía proxy**: el browser llama `/api/places` en Next.js → valida sesión → Express con `INTERNAL_API_KEY`. El browser nunca habla directo con `:4000` para mutaciones.

### Base de datos

- **Driver nativo MongoDB** obligatorio (sin Mongoose) — requisito para `$vectorSearch` en Fase 3.
- **MongoDB local** en desarrollo: `mongodb://127.0.0.1:27017`, base `colugares`.
- Atlas + índice vectorial `places_vector_idx` reservado para producción (M10+).

### Embeddings

- Modelo original `text-embedding-004` **retirado por Google (2026)**.
- Reemplazo: **`gemini-embedding-001`** con `outputDimensionality: 768` vía REST API.
- Embeddings se generan **en background** al crear/editar lugar (regla de negocio COLUGARES).
- Estado trackeado en `embedding_status`: `pending` | `ready` | `failed`.

### Auth y RBAC

| Rol | Acceso |
|-----|--------|
| `admin` | Todo `/admin/*`, eliminar lugares permanentemente |
| `empleado` | CMS lugares, desactivar (no delete) |
| `viajero` | Portal público + Google OAuth (Fase 3: planner) |

- Middleware Edge separado (`auth.config.ts`) para no importar MongoDB en Edge Runtime.

### Validación y tipos

- **Zod** en todos los endpoints backend.
- **TypeScript estricto**, sin `any`.
- Comentarios de lógica de negocio en español.

### Referencia visual

- Home inspirada en **GoDominican Republic** — hero video, scroll storytelling, regiones interactivas.
- CTAs apuntan a `/planner` (ruta aún no implementada).

---

## 4. Variables de entorno requeridas (desarrollo local)

### `backend/.env`

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB_NAME=colugares
PORT=4000
FRONTEND_URL=http://localhost:3000
JWT_SECRET=...
INTERNAL_API_KEY=...          # misma key en frontend
GEMINI_API_KEY=...            # https://aistudio.google.com/apikey
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
SEED_ADMIN_EMAIL=admin@colugares.com
SEED_ADMIN_PASSWORD=Admin123!
```

### `frontend/.env.local`

```env
MONGODB_URI=mongodb://127.0.0.1:27017
MONGODB_DB_NAME=colugares
AUTH_SECRET=...
NEXTAUTH_URL=http://localhost:3000
BACKEND_URL=http://localhost:4000
INTERNAL_API_KEY=...          # misma key que backend
```

---

## 5. Comandos útiles

```powershell
# Backend
cd backend
npm run dev          # http://localhost:4000
npm run seed         # admin + 25 lugares
npm run reindex      # embeddings pending/failed

# Frontend
cd frontend
npm run dev          # http://localhost:3000
npm run type-check
npm run build
```

---

## 6. Siguiente paso exacto — Fase 3: AI Trip Planner

### Objetivo
Implementar el chat RAG con streaming que propone itinerarios **solo con lugares suscritos** de MongoDB.

### Orden de implementación recomendado

1. **Dependencias**
   - `frontend`: verificar `ai` (Vercel AI SDK) ya instalado
   - `backend` o `frontend`: agregar `langchain` / `@langchain/google-genai` según arquitectura elegida

2. **Ruta pública `/planner`**
   - `frontend/src/app/(public)/planner/page.tsx`
   - Componentes: `ChatWindow.tsx`, onboarding quiz básico (4 preguntas) si no hay perfil

3. **Pipeline RAG** (según `COLUGARES_CONTEXT_1.md`)
   - `frontend/src/app/api/planner/chat/route.ts` (SSE streaming)
   - `lib/rag/retriever.ts` — `$vectorSearch` con filtros de perfil
   - `lib/rag/context-builder.ts` — formatea documentos para LLM
   - `lib/rag/chain.ts` — LangChain.js
   - `lib/prompts/system-prompt.ts` — System Prompt blindado de Colu

4. **Tipos y colecciones**
   - `types/itinerary.types.ts`
   - Perfil viajero en `users.travel_profile` (onboarding)

5. **LLM**
   - Gemini `gemini-1.5-flash` (tier gratuito) vía Vercel AI SDK `useChat()`

6. **Prerequisito producción RAG**
   - MongoDB Atlas M10 + índice `places_vector_idx` (768 dims, cosine)
   - En local: `$vectorSearch` no funciona en MongoDB Community — usar fallback `$text` o Atlas dev cluster para probar RAG completo

### Primer archivo a crear
```
frontend/src/app/(public)/planner/page.tsx
frontend/src/app/api/planner/chat/route.ts
frontend/src/lib/prompts/system-prompt.ts
```

### Criterio de éxito Fase 3
- Viajero logueado abre `/planner`, escribe "Quiero 3 días en Cartagena" y recibe itinerario streaming basado **solo** en los 25 lugares seed, sin alucinaciones.

---

*Documento generado para continuidad de contexto entre sesiones de desarrollo.*
