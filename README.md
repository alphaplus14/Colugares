# Colugares — Portal Turístico Inteligente de Colombia

Portal de turismo nacional con planificación de itinerarios asistida por IA.

## Estructura del proyecto

```
Colugares/
├── frontend/    # Next.js 14 + TypeScript + Tailwind
└── backend/     # Node.js + Express + TypeScript
```

## Instalación

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev       # http://localhost:3000
```

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev       # http://localhost:4000
```

## Stack
- **Frontend:** Next.js 14, TypeScript, Tailwind CSS, Mapbox GL JS, Vercel AI SDK
- **Backend:** Node.js, Express, TypeScript, MongoDB Atlas, LangChain.js, Gemini AI
- **Base de datos:** MongoDB Atlas con Vector Search
