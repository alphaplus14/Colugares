# Colugares — Estado actual del proyecto

> Actualizado: julio 2026 · Stack: Next.js 14 · Express · MongoDB local · Gemini · MapLibre

---

## 1. Fases completadas

| Fase | Estado | Entregables |
|------|--------|-------------|
| **Fase 1 — Base** | ✅ | Auth.js, RBAC, Express, MongoDB driver nativo |
| **Fase 2 — CMS y datos** | ✅ | CRUD lugares, embeddings 768 dims |
| **Fase 3 — AI Trip Planner** | ✅ | Chat RAG Colu, onboarding, streaming SSE, `gemini-2.5-flash` |
| **Fase 4 — UI + itinerario** | ✅ | Split chat/mapa, parser, guardar itinerarios, hover con fotos |
| **Fase 5 — Eventos + deploy** | ✅ | RAG eventos, date extractor, home con calendario real, `DEPLOY.md` |
| **Fase 6 — Plantilla visual** | ✅ | Merge rama `frank` — home GoDominican-style |
| **Deploy producción** | ⏳ Manual | Atlas M10 + Vercel — ver `DEPLOY.md` |

### Datos en MongoDB local (`colugares`)

| Colección | Documentos | Estado |
|-----------|------------|--------|
| `users` | admin + viajeros | `travel_profile` vía onboarding |
| `places` | **84** (6 regiones) | `embedding_status: "ready"` en todos |
| `itineraries` | Por usuario | CRUD completo |
| `events` | 6 festividades | `npm run reseed-events` si faltan datos |

---

## 2. Merge rama `frank` (julio 2026)

**Commit:** `df9be19` — *cambios en el frontend con una plantilla*

### Qué trajo Frank
- **Paleta GoDominican:** `brand-navy`, `brand-orange`, `brand-cream`, `brand-sand`
- **Tipografías:** Dela Gothic One (display) + DM Sans (body)
- **Layouts por zona:** `(public)/layout`, `(auth)/layout`, admin rediseñado
- **Componentes UI:** `SiteHeader`, `SiteFooter`, `PillButton`, `SectionHeading`, `AdminHeader`
- **Home renovada:** hero, historias fullscreen, regiones, pasiones, destinos con carrusel
- **Íconos:** `public/icons/close.svg`, `filter.svg`
- **Imágenes remotas:** Pexels + Unsplash en `next.config.mjs`

### Qué conservamos de `cris` en el merge
- **Eventos reales** desde MongoDB en `EventsTeaser` (no estático)
- **`LoginPageClient`** con validación de Google OAuth (`auth-env.ts`)
- **Enlaces viajero** en header: Planner, Mis viajes, Cerrar sesión
- **Fix webpack cache** en dev (Windows — una sola instancia de `next dev`)
- **RAG, planner, mapa, itinerarios** — sin cambios funcionales

### Conflictos resueltos
| Archivo | Resolución |
|---------|------------|
| `next.config.mjs` | Pexels + Unsplash + webpack cache |
| `login/page.tsx` | Server component → `LoginPageClient` |
| `EventsTeaser.tsx` | Diseño Frank + datos MongoDB |
| `HomePage.tsx` | Props `events` desde servidor |
| `Navbar.tsx` | Eliminado → reemplazado por `SiteHeader` |

### Archivos WIP del rediseño planner (sin integrar aún)
Quedaron en el repo como base para la siguiente fase visual del planner:
- `ColuAvatar.tsx`, `QuickPrompts.tsx`, `TypingIndicator.tsx`
- `lib/planner-content.ts`, `lib/utils.ts`

---

## 3. Cómo correr en local

```powershell
# Terminal 1 — Backend
cd backend
npm run dev          # :4000

# Terminal 2 — Frontend (SOLO una instancia)
cd frontend
npm run dev          # :3000
```

**Si el puerto 3000 está ocupado:**
```powershell
Get-NetTCPConnection -LocalPort 3000 | Select OwningProcess -Unique | % { Stop-Process -Id $_.OwningProcess -Force }
Remove-Item -Recurse -Force frontend\.next
cd frontend; npm run dev
```

### Credenciales demo
| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | `admin@colugares.com` | `Admin123!` |
| Viajero | `viajero@colugares.com` | `Viajero123!` |

### Verificación rápida
- `http://localhost:3000` → Home con video hero y secciones Frank
- `http://localhost:3000/api/events` → JSON con festividades
- `http://localhost:3000/planner` → Chat + mapa (requiere login viajero + onboarding)

---

## 4. APIs disponibles

| Endpoint | Función |
|----------|---------|
| `POST /api/planner/chat` | RAG + eventos + streaming |
| `GET /api/events` | Calendario festividades |
| `GET /api/places/catalog` | Catálogo enriquecido para mapa |
| `GET/POST /api/itineraries` | Itinerarios guardados |
| `GET/PUT /api/user/profile` | Perfil viajero |

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

---

## 6. Comandos útiles

```powershell
cd backend && npm run reseed-places   # 84 lugares + embeddings
cd backend && npm run reseed-events   # Solo festividades
cd backend && npm run setup-db        # BD completa desde cero
cd frontend && npm run type-check
cd frontend && npm run build
```

---

## 7. Plan auth + CMS (decisiones cerradas — jul 2026)

### Recomendación profesional (punto 1)
- **Sin link público** al panel (ni footer ni header).
- Login staff solo en **`/admin/login`** (URL que conoce el equipo).
- Viajeros usan **`/login`** (visible: “Iniciar sesión”).

### Roles
| Rol | Acceso |
|-----|--------|
| `admin` (super-admin) | Todo + crear/gestionar empleados |
| `empleado` | CRUD de contenido (lugares, eventos, itinerarios); **sin** gestionar staff |
| `viajero` | Google o email/password → onboarding (datos) → planner |

### Viajero — cuenta
- Google **o** registro manual (nombre, email, password + confirmar).
- Tras Google: onboarding pide datos básicos importantes.
- Tras email: mismo onboarding.

### Orden de implementación
1. ✅ Fase A — Logins separados + middleware
2. ✅ Fase B — Registro/login viajero
3. ✅ Fase C — Dashboard + CRUD eventos, itinerarios, usuarios

### Fase C — CMS admin (hecho)
| Módulo | Rutas UI | API |
|--------|----------|-----|
| Dashboard | `/admin/dashboard` | `GET /api/admin/stats` |
| Festividades | `/admin/eventos` (+ nuevo/editar) | `/api/admin/events` |
| Itinerarios | `/admin/itinerarios` (+ detalle) | `/api/admin/itineraries` |
| Usuarios | `/admin/usuarios` | `/api/admin/users` (crear empleado solo admin) |
| Lugares | `/admin/lugares` | ya existía |

**Permisos:** empleado = CRUD contenido; admin = + eliminar permanente eventos, crear/desactivar/eliminar empleados y viajeros.

### Siguiente paso
Deploy producción (`DEPLOY.md`) + pruebas de flujo completo.

---

## 8. Estado del merge Git

El merge `origin/frank` → `cris` está **resuelto y verificado**.

```powershell
git add -A
git commit -m "feat: logins separados viajero/admin + registro viajero"
```

---

*Leer junto con `COLUGARES_CONTEXT_1.md`.*
