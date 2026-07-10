# Colugares — Estado actual del proyecto

> Actualizado: julio 2026 · Stack: Next.js 14 · Express · MongoDB local · Gemini · MapLibre

---

## 1. Fases completadas

| Fase | Estado | Entregables |
|------|--------|-------------|
| **Fase 1 — Base** | ✅ | Auth.js, RBAC, Express, MongoDB driver nativo |
| **Fase 2 — CMS y datos** | ✅ | CRUD lugares, embeddings 768 dims, 25 places Caribe |
| **Fase 3 — AI Trip Planner** | ✅ | Chat RAG Colu, onboarding, streaming SSE, `gemini-2.5-flash` |
| **Fase 4 — UI + itinerario** | ✅ | Split chat/mapa, parser, guardar itinerarios, hover con fotos |
| **Fase 5 — Eventos + deploy** | ✅ | RAG eventos, date extractor, home con calendario real, `DEPLOY.md` |
| **Deploy producción** | ⏳ Manual | Atlas M10 + Vercel — ver `DEPLOY.md` |

### Datos en MongoDB local (`colugares`)

| Colección | Documentos | Estado |
|-----------|------------|--------|
| `users` | admin + viajeros | `travel_profile` vía onboarding |
| `places` | **84** (6 regiones) | `embedding_status: "ready"` en todos |
| `itineraries` | Por usuario | CRUD completo |
| `events` | 6 festividades | Seed Fase 5 — **ejecutar `npm run reseed-events` si tenías 4 eventos viejos** |

---

## 2. Fase 5 — Qué se implementó

### RAG con eventos
- `lib/rag/date-extractor.ts` — detecta fechas en español (*"en febrero"*, *"14 al 17 de agosto"*)
- `lib/rag/event-retriever.ts` — consulta `events` por región del viajero + solapamiento de fechas
- `lib/rag/chain.ts` — PASO 5 del pipeline: inyecta eventos en contexto
- `lib/prompts/system-prompt.ts` — regla de eventos: solo mencionar los de la BD

### Home y API pública
- `GET /api/events` — calendario de festividades (sin auth)
- `EventsTeaser` — datos reales desde MongoDB (ya no estático)

### Deploy
- `DEPLOY.md` — Atlas M10, índice `places_vector_idx`, variables Vercel
- `backend npm run reseed-events` — actualizar eventos sin borrar toda la BD

---

## 3. APIs disponibles

| Endpoint | Función |
|----------|---------|
| `POST /api/planner/chat` | RAG + eventos + streaming |
| `GET /api/events` | Calendario festividades |
| `GET /api/places/catalog` | Catálogo enriquecido para mapa |
| `GET/POST /api/itineraries` | Itinerarios guardados |
| `GET/PUT /api/user/profile` | Perfil viajero |

---

## 4. Cómo probar eventos en Colu

1. Actualizar eventos: `cd backend && npm run reseed-events`
2. Ir a `/planner` y escribir por ejemplo:
   - *"Quiero viajar a Medellín en agosto"* → Feria de las Flores
   - *"Plan para Cartagena en noviembre"* → Festival de Música del Caribe
   - *"Viaje a Barranquilla en febrero"* → Carnaval 2027

---

## 5. Catálogo de lugares por región

| Región | Lugares |
|--------|---------|
| Caribe | 25 |
| Andina | 15 |
| Eje Cafetero | 12 |
| Pacífico | 12 |
| Amazonía | 10 |
| Llanos | 10 |
| **Total** | **84** |

## 6. Comandos útiles

```powershell
cd backend && npm run dev
cd backend && npm run reseed-places   # Reemplaza todos los lugares + embeddings
cd backend && npm run reseed-events   # Solo festividades
cd backend && npm run setup-db      # BD completa desde cero
cd frontend && npm run dev
cd frontend && npm run type-check
```

---

## 7. Siguiente paso — Deploy producción

Seguir **`DEPLOY.md`**:

1. Crear cluster Atlas M10
2. Crear índice vectorial `places_vector_idx`
3. Migrar datos (`setup-db` + `reseed-events` contra Atlas URI)
4. Desplegar frontend en Vercel con `USE_ATLAS_VECTOR_SEARCH=true`

---

*Leer junto con `COLUGARES_CONTEXT_1.md`.*
