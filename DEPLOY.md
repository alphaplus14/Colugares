# Colugares — Guía de despliegue en producción

> MongoDB Atlas M10+ · Vercel · Fase 5

---

## 1. MongoDB Atlas

### Cluster

1. Crear cluster **M10** o superior en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Habilitar **Atlas Search** / **Vector Search** (requiere M10+).
3. Obtener connection string: `mongodb+srv://user:pass@cluster.mongodb.net/colugares`

### Índice vectorial (`places_vector_idx`)

En Atlas → Database → Browse Collections → `places` → Search Indexes → Create:

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
      {
        "type": "filter",
        "path": "region"
      },
      {
        "type": "filter",
        "path": "is_subscriber"
      },
      {
        "type": "filter",
        "path": "active"
      },
      {
        "type": "filter",
        "path": "embedding_status"
      }
    ]
  }
}
```

### Índices de eventos

Se crean automáticamente con `npm run setup-db` en backend:

- `{ region: 1, active: 1 }`
- `{ start_date: 1, end_date: 1 }`

### Migrar datos locales → Atlas

```powershell
# Exportar local (opcional)
mongodump --uri="mongodb://127.0.0.1:27017" --db=colugares --out=./dump

# Importar en Atlas
mongorestore --uri="mongodb+srv://..." --db=colugares ./dump/colugares
```

O ejecutar en Atlas desde tu máquina apuntando al cluster:

```powershell
cd backend
# Configurar MONGODB_URI en .env apuntando a Atlas
npm run setup-db
npm run reseed-events
```

---

## 2. Variables de entorno — Vercel (frontend)

| Variable | Valor producción |
|----------|------------------|
| `MONGODB_URI` | `mongodb+srv://...` Atlas |
| `MONGODB_DB_NAME` | `colugares` |
| `AUTH_SECRET` | Generar con `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `https://tu-dominio.vercel.app` |
| `GOOGLE_CLIENT_ID` | OAuth con redirect de producción |
| `GOOGLE_CLIENT_SECRET` | — |
| `GEMINI_API_KEY` | Google AI Studio |
| `GEMINI_LLM_MODEL` | `gemini-2.5-flash` |
| `GEMINI_EMBEDDING_MODEL` | `gemini-embedding-001` |
| `USE_ATLAS_VECTOR_SEARCH` | `true` |
| `BACKEND_URL` | URL del backend si se despliega aparte |
| `INTERNAL_API_KEY` | Clave compartida con Express |

### Google OAuth — redirect URIs

Agregar en Google Cloud Console:

```
https://tu-dominio.vercel.app/api/auth/callback/google
```

---

## 3. Backend Express (opcional en Railway/Render)

Si despliegas el CMS Express por separado:

```env
MONGODB_URI=mongodb+srv://...
FRONTEND_URL=https://tu-dominio.vercel.app
INTERNAL_API_KEY=...
GEMINI_API_KEY=...
```

El AI Planner corre en **Next.js API Routes** (`/api/planner/chat`) — no requiere Express en producción para el chat.

---

## 4. Verificación post-deploy

| Check | Cómo verificar |
|-------|----------------|
| Auth Google | Login en `/login` |
| Home eventos | `/` muestra festividades desde MongoDB |
| RAG eventos | En `/planner`: *"Quiero viajar en agosto a Medellín"* → Colu menciona Feria de las Flores |
| Vector search | Logs sin fallback cosine; `USE_ATLAS_VECTOR_SEARCH=true` |
| CMS admin | `/admin/lugares` con credenciales admin |

---

## 5. Desarrollo local vs producción

| Feature | Local | Producción |
|---------|-------|------------|
| Vector search | Cosine en memoria | `$vectorSearch` Atlas |
| Eventos RAG | Colección `events` local | Misma colección en Atlas |
| Mapa | MapLibre + Carto (sin key) | Igual |

---

*Ver también `ESTADO_ACTUAL.md` para el estado del MVP.*
