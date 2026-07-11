# Colugares — Guía de despliegue

> MongoDB Atlas · **Backend en Render** · **Frontend en Netlify**  
> (Alternativa histórica: Vercel — sigue válida; esta guía prioriza Render + Netlify.)

---

## Arquitectura en producción

| Pieza | Dónde | Qué hace |
|-------|-------|----------|
| **MongoDB Atlas** | Atlas (M10+ si usas Vector Search) | `places`, `users`, `events`, `itineraries` |
| **Backend Express** | **Render** (Web Service) | CMS lugares (`BACKEND_URL`), seed/scripts |
| **Frontend Next.js** | **Netlify** | UI + Auth.js + `/api/planner`, catálogo, itinerarios |

El **AI Planner** vive en las API Routes de Next.js. Render no es obligatorio para el chat, pero sí para el CMS admin de lugares vía `backend-proxy`.

---

## 1. MongoDB Atlas (primero)

1. Crear cluster (M10+ recomendado para `$vectorSearch`; M0 sirve para demo con cosine fallback).
2. Network Access → Allow `0.0.0.0/0` (o IPs de Render/Netlify).
3. Database User + connection string:
   `mongodb+srv://USER:PASS@cluster.mongodb.net/colugares`
4. Desde tu PC (una vez):

```powershell
cd backend
# .env con MONGODB_URI de Atlas
npm run setup-db
npm run reseed-events
```

Índice vectorial: ver sección al final / `places_vector_idx` (igual que antes).

---

## 2. Backend en Render

### Crear servicio
1. [render.com](https://render.com) → **New → Web Service**
2. Conectar repo `alphaplus14/Colugares`
3. Configuración:

| Campo | Valor |
|-------|--------|
| **Root Directory** | `backend` |
| **Runtime** | Node |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance** | Free o Starter |

### Variables de entorno (Render → Environment)

```env
MONGODB_URI=mongodb+srv://...
MONGODB_DB_NAME=colugares
PORT=4000
FRONTEND_URL=https://TU-SITIO.netlify.app
INTERNAL_API_KEY=genera-una-clave-larga-compartida
GEMINI_API_KEY=tu-key
GEMINI_LLM_MODEL=gemini-2.5-flash
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
USE_ATLAS_VECTOR_SEARCH=true
NODE_ENV=production
```

### Verificar
- `https://tu-backend.onrender.com/api/health`
- Anotar la URL pública → será `BACKEND_URL` en Netlify

> **Nota Free tier:** Render duerme el servicio tras inactividad (~15 min). El primer request puede tardar 30–60 s.

---

## 3. Frontend en Netlify

### Crear sitio
1. [app.netlify.com](https://app.netlify.com) → **Add new site → Import from Git**
2. Repo Colugares
3. Build settings:

| Campo | Valor |
|-------|--------|
| **Base directory** | `frontend` |
| **Build command** | `npm run build` |
| **Publish directory** | `.next` (Netlify Next runtime lo gestiona) |
| **Node version** | `20` (Environment `NODE_VERSION=20`) |

Netlify detecta Next.js 14 con el runtime oficial. Si pide plugin: `@netlify/plugin-nextjs` (suele auto-instalarse).

### Variables de entorno (Netlify → Site settings → Environment variables)

```env
MONGODB_URI=mongodb+srv://...   # misma Atlas
MONGODB_DB_NAME=colugares
AUTH_SECRET=openssl-rand-base64-32
NEXTAUTH_URL=https://TU-SITIO.netlify.app
AUTH_URL=https://TU-SITIO.netlify.app
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GEMINI_API_KEY=...
GEMINI_LLM_MODEL=gemini-2.5-flash
GEMINI_EMBEDDING_MODEL=gemini-embedding-001
USE_ATLAS_VECTOR_SEARCH=true
BACKEND_URL=https://tu-backend.onrender.com
INTERNAL_API_KEY=la-misma-clave-que-en-render
```

### Google OAuth
En Google Cloud Console → Credentials → Authorized redirect URIs:

```
https://TU-SITIO.netlify.app/api/auth/callback/google
```

Authorized JavaScript origins:

```
https://TU-SITIO.netlify.app
```

### CORS en backend
`FRONTEND_URL` en Render debe ser exactamente la URL de Netlify (sin slash final inconsistente).

---

## 4. Orden recomendado de subida

1. Atlas listo + `setup-db` / seed  
2. Deploy **Render** (backend) → copiar URL  
3. Deploy **Netlify** (frontend) con `BACKEND_URL`  
4. Actualizar OAuth redirect  
5. Probar checklist abajo  

---

## 5. Checklist post-deploy

| Check | Cómo |
|-------|------|
| Home | `https://TU-SITIO.netlify.app` carga |
| Login viajero | `/login` Google o email |
| Planner | `/planner` → Colu responde + mapa con **pin = Día N** |
| Admin | `/admin/login` → lugares (proxy a Render) |
| Eventos | Home muestra festividades |
| Auth callback | Google no da `redirect_uri_mismatch` |

---

## 6. Troubleshooting rápido

| Problema | Qué revisar |
|----------|-------------|
| Netlify build falla | `NODE_VERSION=20`, base `frontend`, `npm run build` local primero |
| Admin lugares 502 | `BACKEND_URL` + `INTERNAL_API_KEY` iguales en ambos lados; Render despierto |
| Planner sin mapa | Usuario viajero + onboarding; catálogo `/api/places/catalog` |
| Mongo timeout | Atlas Network Access `0.0.0.0/0` |
| OAuth error | `NEXTAUTH_URL` = URL Netlify exacta + redirect URI |

---

## 7. Índice vectorial Atlas (referencia)

```json
{
  "name": "places_vector_idx",
  "type": "vectorSearch",
  "definition": {
    "fields": [
      {
        "type": "vector",
        "path": "vector_embedding",
        "numDimensions": 768,
        "similarity": "cosine"
      },
      { "type": "filter", "path": "region" },
      { "type": "filter", "path": "is_subscriber" },
      { "type": "filter", "path": "active" },
      { "type": "filter", "path": "embedding_status" }
    ]
  }
}
```

---

## 8. Local vs producción

| Feature | Local | Producción |
|---------|-------|------------|
| Vector search | Cosine en memoria | `$vectorSearch` si `USE_ATLAS_VECTOR_SEARCH=true` |
| Front | `:3000` | Netlify |
| Back | `:4000` | Render |
| Mapa | MapLibre + Carto | Igual |

---

*Ver `ESTADO_ACTUAL.md` para el estado del MVP.*
