# Lista de imágenes Colugares — checklist de descarga

> Generado desde seeders + home. Guarda cada archivo **exactamente** con el nombre indicado.
>
> **Ruta base lugares:** `frontend/public/images/places/{region}/{slug}/`
> **Ruta base home/UI:** `frontend/public/images/...` (ver sección A)
>
> Formato recomendado: **JPG** (o WebP), horizontal 16:9 o 4:3, mínimo **1600px** de ancho para covers.
>
> **Total lugares en seed:** 84 · **3 fotos por lugar** = **252** archivos de lugares

---

## Convención de nombres

| Pieza | Carpeta | Archivos |
|-------|---------|----------|
| Lugar (CMS / mapa / ficha) | `images/places/{region}/{slug}/` | `01-….jpg`, `02-….jpg`, `03-….jpg` |
| Home historias | `images/stories/` | ver sección A |
| Home regiones | `images/regions/` | ver sección A |
| Home pasiones | `images/passions/` | ver sección A |
| Destinos destacados | `images/featured/` | ver sección A |
| Eventos / festividades | `images/events/` | ver sección A |
| UI (login admin, splash, planner) | `images/ui/` | ver sección A |

Cuando termines de bajarlas, avísame y las cableamos en seed + `home-content.ts`.

---

## A) Home y UI (prioridad alta — se ven en la landing)

### A1. Historias fullscreen (`StorySections`)

| # | Guardar como | Qué buscar (descripción visual) | Estado |
|---|--------------|----------------------------------|--------|
| 1 | `frontend/public/images/stories/despierta-colombia.jpg` | Amanecer colombiano / paisaje despertar (ya existe local) | ✅ YA EN REPO |
| 2 | `frontend/public/images/stories/espiritu-aventurero.jpg` | Selva, montaña o río — aventura Colombia | ⬜ FALTA |
| 3 | `frontend/public/images/stories/saborea-tradicion.jpg` | Café, plato típico o mercado gastronómico colombiano | ⬜ FALTA |
| 4 | `frontend/public/images/stories/paraiso-tropical.jpg` | Playa Caribe, aguas turquesa, palmeras, atardecer | ⬜ FALTA |
| 5 | `frontend/public/images/stories/noche-colombiana.jpg` | Vida nocturna / salsa / gente bailando / luces ciudad | ⬜ FALTA |

### A2. Regiones (`RegionExplorer`)

| Región | Guardar como | Qué buscar |
|--------|--------------|------------|
| Caribe | `frontend/public/images/regions/caribe.jpg` | Cartagena murallas / playa Caribe / ciudad colonial costa |
| Andina | `frontend/public/images/regions/andina.jpg` | Bogotá, Medellín o cordillera andina urbana/montaña |
| Pacífico | `frontend/public/images/regions/pacifico.jpg` | Selva húmeda, costa Pacífico, ballenas o Nuquí |
| Amazonía | `frontend/public/images/regions/amazonia.jpg` | Río Amazonas, dosel selvático, Leticia |
| Llanos | `frontend/public/images/regions/llanos.jpg` | Sabana infinita, atardecer llanero, ganado/fauna |
| Eje Cafetero | `frontend/public/images/regions/eje-cafetero.jpg` | Valle de Cocora / palmas de cera / finca cafetera |

### A3. Pasiones (`PassionCategories`)

| Pasión | Guardar como | Qué buscar |
|--------|--------------|------------|
| Playas | `frontend/public/images/passions/playas.jpg` | Playa colombiana (Caribe o Pacífico) |
| Aventura | `frontend/public/images/passions/aventura.jpg` | Trekking, rafting, selva o montaña |
| Gastronomía | `frontend/public/images/passions/gastronomia.jpg` | Platos típicos / mesa colombiana |
| Cultura | `frontend/public/images/passions/cultura.jpg` | Centro histórico / patrimonio / arte |
| Café | `frontend/public/images/passions/cafe.jpg` | Granos, taza o finca cafetera |
| Fauna | `frontend/public/images/passions/fauna.jpg` | Aves, delfines, fauna de parque natural |

### A4. Destinos destacados (`DestinationShowcase`)

| Destino | Guardar como | Qué buscar |
|---------|--------------|------------|
| Cartagena | `frontend/public/images/featured/cartagena.jpg` | Murallas / calles coloridas Cartagena |
| Salento | `frontend/public/images/featured/salento.jpg` | Cocora / pueblo Salento / palmas de cera |
| Medellín | `frontend/public/images/featured/medellin.jpg` | Skyline Medellín / Comuna 13 / metrocable |
| San Andrés | `frontend/public/images/featured/san-andres.jpg` | Mar de siete colores / Johnny Cay |

### A5. Festividades (`events` — 6 en BD)

| Evento | Guardar como | Qué buscar |
|--------|--------------|------------|
| Feria de las Flores | `frontend/public/images/events/feria-flores.jpg` | Silleteros / desfile floral Medellín |
| Jazz al Parque | `frontend/public/images/events/jazz-al-parque.jpg` | Concierto al aire libre / parque Simón Bolívar |
| Festival Música del Caribe | `frontend/public/images/events/musica-caribe.jpg` | Concierto / champeta / Cartagena de noche |
| Carnaval de Barranquilla | `frontend/public/images/events/carnaval-barranquilla.jpg` | Comparsas, disfraces, Batalla de Flores |
| Festival Iberoamericano Teatro | `frontend/public/images/events/teatro-iberoamericano.jpg` | Escenario teatro / público / Bogotá cultural |
| Festival Leyenda Vallenata | `frontend/public/images/events/leyenda-vallenata.jpg` | Acordeón / Valledupar / vallenato |

### A6. UI / fondos (opcionales pero recomendados)

| Uso | Guardar como | Qué buscar |
|-----|--------------|------------|
| Intro splash | `frontend/public/images/ui/splash.jpg` | Imagen fuerte Colombia (playa o paisaje) |
| Login admin fondo | `frontend/public/images/ui/admin-login.jpg` | Paisaje serio / Colombia institucional |
| Planner fondo estático | `frontend/public/images/ui/planner-bg.jpg` | Paisaje suave para chat (baja saturación) |
| Poster hero (ya hay video) | `frontend/public/videos/hero-poster.jpg` | Frame poster hero (ya existe) | ✅ YA |
| Brand | `frontend/public/brand/logo.png` + `icon.png` | Ya trajo Frank | ✅ YA |

---

## B) Lugares de la base (seed MongoDB — 3 fotos c/u)

Cada lugar usa esta carpeta:

```
frontend/public/images/places/{region}/{slug}/
  01-….jpg   ← cover principal (mapa, cards, ficha)
  02-….jpg   ← segunda toma
  03-….jpg   ← tercera toma
```

### Caribe (25 lugares)

#### 1. Hotel Boutique Casa San Agustín

- **Tipo:** Hotel · **Ciudad:** Cartagena (Bolívar)
- **Tags:** lujo, historia, pareja, colonial
- **Descripción (para buscar fotos):** Hotel de lujo en el centro histórico amurallado. Patios coloniales, piscina y servicio concierge. Ideal para parejas y viajeros que buscan autenticidad caribeña con confort premium.
- **Carpeta:** `frontend/public/images/places/caribe/hotel-boutique-casa-san-agustin/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-fachada.jpg` | Fachada o entrada del hotel Hotel Boutique Casa San Agustín en Cartagena. Exterior reconocible. |
| `02-ambiente.jpg` | Lobby, patio, piscina o habitación típica de Hotel Boutique Casa San Agustín. Ambiente del hospedaje. |
| `03-detalle.jpg` | Detalle que refuerce: lujo, historia, pareja, colonial. Contexto: Hotel de lujo en el centro histórico amurallado. Patios coloniales, piscina y servicio concierge. Ideal para parejas y v |

#### 2. Restaurante La Cevichería

- **Tipo:** Restaurante · **Ciudad:** Cartagena (Bolívar)
- **Tags:** gastronomia, mariscos, nocturno, getsemani
- **Descripción (para buscar fotos):** Ceviches frescos y coctelería caribeña en Getsemaní. Ambiente bohemio, carta creativa con pescado del día y mariscos locales. Reserva recomendada en fines de semana.
- **Carpeta:** `frontend/public/images/places/caribe/restaurante-la-cevicheria/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-plato.jpg` | Plato o mesa emblemática de Restaurante La Cevichería (Cartagena). Comida acorde a: gastronomia, mariscos, nocturno, getsemani. |
| `02-local.jpg` | Interior o terraza del restaurante Restaurante La Cevichería. |
| `03-ambiente.jpg` | Ambiente gastronómico / barrio. Ceviches frescos y coctelería caribeña en Getsemaní. Ambiente bohemio, carta creativa con pescado del día y mariscos loc |

#### 3. Tour Islas del Rosario

- **Tipo:** Actividad · **Ciudad:** Cartagena (Bolívar)
- **Tags:** buceo, playa, familia, snorkel
- **Descripción (para buscar fotos):** Excursión en lancha rápida al archipiélago del Rosario. Snorkel en arrecifes de coral, almuerzo en isla y tiempo de playa. Incluye guía bilingüe y equipo de snorkel.
- **Carpeta:** `frontend/public/images/places/caribe/tour-islas-del-rosario/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-accion.jpg` | Personas haciendo la actividad de Tour Islas del Rosario en Cartagena. |
| `02-escenario.jpg` | Paisaje o escenario principal donde ocurre: buceo, playa, familia, snorkel. |
| `03-experiencia.jpg` | Momento memorable de la experiencia. Excursión en lancha rápida al archipiélago del Rosario. Snorkel en arrecifes de coral, almuerzo en isla y tiempo de play |

#### 4. Castillo de San Felipe de Barajas

- **Tipo:** Atractivo · **Ciudad:** Cartagena (Bolívar)
- **Tags:** historia, cultura, familia, patrimonio
- **Descripción (para buscar fotos):** Fortaleza colonial más grande de América. Laberinto de túneles, vistas panorámicas de la ciudad y recorrido histórico sobre la defensa contra piratas. Patrimonio UNESCO.
- **Carpeta:** `frontend/public/images/places/caribe/castillo-de-san-felipe-de-barajas/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-vista.jpg` | Vista icónica / postcard de Castillo de San Felipe de Barajas (Cartagena). |
| `02-detalle.jpg` | Detalle arquitectónico, natural o cultural de Castillo de San Felipe de Barajas. |
| `03-contexto.jpg` | Visitantes o contexto del lugar. Fortaleza colonial más grande de América. Laberinto de túneles, vistas panorámicas de la ciudad y recorrido histórico so |

#### 5. Hotel Irotama Resort

- **Tipo:** Hotel · **Ciudad:** Santa Marta (Magdalena)
- **Tags:** familia, playa, resort, piscina
- **Descripción (para buscar fotos):** Resort frente al mar con múltiples piscinas, toboganes y actividades para familias. Ubicado en la zona de El Rodadero, cerca del aeropuerto Simón Bolívar.
- **Carpeta:** `frontend/public/images/places/caribe/hotel-irotama-resort/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-fachada.jpg` | Fachada o entrada del hotel Hotel Irotama Resort en Santa Marta. Exterior reconocible. |
| `02-ambiente.jpg` | Lobby, patio, piscina o habitación típica de Hotel Irotama Resort. Ambiente del hospedaje. |
| `03-detalle.jpg` | Detalle que refuerce: familia, playa, resort, piscina. Contexto: Resort frente al mar con múltiples piscinas, toboganes y actividades para familias. Ubicado en la zona de El Rodadero, c |

#### 6. Parque Nacional Natural Tayrona

- **Tipo:** Atractivo · **Ciudad:** Santa Marta (Magdalena)
- **Tags:** naturaleza, senderismo, playa, aventura
- **Descripción (para buscar fotos):** Reserva natural donde la selva tropical se encuentra con el Caribe. Senderos a Cabo San Juan, avistamiento de fauna y playas vírgenes. Reserva con antelación en temporada alta.
- **Carpeta:** `frontend/public/images/places/caribe/parque-nacional-natural-tayrona/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-vista.jpg` | Vista icónica / postcard de Parque Nacional Natural Tayrona (Santa Marta). |
| `02-detalle.jpg` | Detalle arquitectónico, natural o cultural de Parque Nacional Natural Tayrona. |
| `03-contexto.jpg` | Visitantes o contexto del lugar. Reserva natural donde la selva tropical se encuentra con el Caribe. Senderos a Cabo San Juan, avistamiento de fauna y pl |

#### 7. Ciudad Perdida Trek

- **Tipo:** Actividad · **Ciudad:** Santa Marta (Magdalena)
- **Tags:** aventura, trekking, arqueologia, sierra nevada
- **Descripción (para buscar fotos):** Trekking de 4 días por la Sierra Nevada hasta la Ciudad Perdida, ruinas arqueológicas de la cultura Tayrona. Incluye guía indígena, acampada y comidas. Nivel de dificultad alto.
- **Carpeta:** `frontend/public/images/places/caribe/ciudad-perdida-trek/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-accion.jpg` | Personas haciendo la actividad de Ciudad Perdida Trek en Santa Marta. |
| `02-escenario.jpg` | Paisaje o escenario principal donde ocurre: aventura, trekking, arqueologia, sierra nevada. |
| `03-experiencia.jpg` | Momento memorable de la experiencia. Trekking de 4 días por la Sierra Nevada hasta la Ciudad Perdida, ruinas arqueológicas de la cultura Tayrona. Incluye guí |

#### 8. Restaurante Donde Wippy

- **Tipo:** Restaurante · **Ciudad:** Santa Marta (Magdalena)
- **Tags:** gastronomia, local, pescado, tradicional
- **Descripción (para buscar fotos):** Comida costeña auténtica: pescado frito, arroz con coco y patacones. Ambiente local sin pretensiones, favorito de samarios y viajeros que buscan sabor tradicional.
- **Carpeta:** `frontend/public/images/places/caribe/restaurante-donde-wippy/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-plato.jpg` | Plato o mesa emblemática de Restaurante Donde Wippy (Santa Marta). Comida acorde a: gastronomia, local, pescado, tradicional. |
| `02-local.jpg` | Interior o terraza del restaurante Restaurante Donde Wippy. |
| `03-ambiente.jpg` | Ambiente gastronómico / barrio. Comida costeña auténtica: pescado frito, arroz con coco y patacones. Ambiente local sin pretensiones, favorito de samari |

#### 9. Decameron San Luis

- **Tipo:** Hotel · **Ciudad:** San Andrés (San Andrés y Providencia)
- **Tags:** todo incluido, playa, familia, snorkel
- **Descripción (para buscar fotos):** Resort todo incluido en la isla de San Andrés. Acceso directo a playa, deportes acuáticos y entretenimiento nocturno. Mar de siete colores a pocos pasos.
- **Carpeta:** `frontend/public/images/places/caribe/decameron-san-luis/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-fachada.jpg` | Fachada o entrada del hotel Decameron San Luis en San Andrés. Exterior reconocible. |
| `02-ambiente.jpg` | Lobby, patio, piscina o habitación típica de Decameron San Luis. Ambiente del hospedaje. |
| `03-detalle.jpg` | Detalle que refuerce: todo incluido, playa, familia, snorkel. Contexto: Resort todo incluido en la isla de San Andrés. Acceso directo a playa, deportes acuáticos y entretenimiento nocturno. Ma |

#### 10. Johnny Cay Tour

- **Tipo:** Actividad · **Ciudad:** San Andrés (San Andrés y Providencia)
- **Tags:** playa, snorkel, isla, medio dia
- **Descripción (para buscar fotos):** Excursión en lancha a Johnny Cay, isla de arena blanca con aguas cristalinas. Ideal para snorkel, relax y fotografía. Duración medio día con guía local.
- **Carpeta:** `frontend/public/images/places/caribe/johnny-cay-tour/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-accion.jpg` | Personas haciendo la actividad de Johnny Cay Tour en San Andrés. |
| `02-escenario.jpg` | Paisaje o escenario principal donde ocurre: playa, snorkel, isla, medio dia. |
| `03-experiencia.jpg` | Momento memorable de la experiencia. Excursión en lancha a Johnny Cay, isla de arena blanca con aguas cristalinas. Ideal para snorkel, relax y fotografía. Du |

#### 11. Hotel Las Américas Resort

- **Tipo:** Hotel · **Ciudad:** Barranquilla (Atlántico)
- **Tags:** resort, playa, spa, negocios
- **Descripción (para buscar fotos):** Resort de playa en Puerto Colombia con spa, campos de golf y convention center. Base ideal para combinar negocios y descanso cerca de Barranquilla.
- **Carpeta:** `frontend/public/images/places/caribe/hotel-las-americas-resort/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-fachada.jpg` | Fachada o entrada del hotel Hotel Las Américas Resort en Barranquilla. Exterior reconocible. |
| `02-ambiente.jpg` | Lobby, patio, piscina o habitación típica de Hotel Las Américas Resort. Ambiente del hospedaje. |
| `03-detalle.jpg` | Detalle que refuerce: resort, playa, spa, negocios. Contexto: Resort de playa en Puerto Colombia con spa, campos de golf y convention center. Base ideal para combinar negocios y desc |

#### 12. Carnaval de Barranquilla Experience

- **Tipo:** Actividad · **Ciudad:** Barranquilla (Atlántico)
- **Tags:** cultura, carnaval, musica, tradicion
- **Descripción (para buscar fotos):** Tour guiado por el museo del Carnaval y recorrido por los preparativos de la fiesta más grande de Colombia. Incluye taller de disfraces y degustación de cocina costeña.
- **Carpeta:** `frontend/public/images/places/caribe/carnaval-de-barranquilla-experience/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-accion.jpg` | Personas haciendo la actividad de Carnaval de Barranquilla Experience en Barranquilla. |
| `02-escenario.jpg` | Paisaje o escenario principal donde ocurre: cultura, carnaval, musica, tradicion. |
| `03-experiencia.jpg` | Momento memorable de la experiencia. Tour guiado por el museo del Carnaval y recorrido por los preparativos de la fiesta más grande de Colombia. Incluye tall |

#### 13. Restaurante El Cactus

- **Tipo:** Restaurante · **Ciudad:** Barranquilla (Atlántico)
- **Tags:** gastronomia, fine dining, nocturno
- **Descripción (para buscar fotos):** Alta cocina caribeña con toques internacionales. Butifarra santandereana reinventada, ceviches y coctelería de autor en ambiente elegante del norte de la ciudad.
- **Carpeta:** `frontend/public/images/places/caribe/restaurante-el-cactus/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-plato.jpg` | Plato o mesa emblemática de Restaurante El Cactus (Barranquilla). Comida acorde a: gastronomia, fine dining, nocturno. |
| `02-local.jpg` | Interior o terraza del restaurante Restaurante El Cactus. |
| `03-ambiente.jpg` | Ambiente gastronómico / barrio. Alta cocina caribeña con toques internacionales. Butifarra santandereana reinventada, ceviches y coctelería de autor en  |

#### 14. Playa Blanca Barú

- **Tipo:** Atractivo · **Ciudad:** Cartagena (Bolívar)
- **Tags:** playa, dia completo, snorkel, baru
- **Descripción (para buscar fotos):** Playa de arena blanca y mar turquesa a 45 minutos en lancha desde Cartagena. Perfecta para día de sol, deportes acuáticos y relax. Evitar fines de semana muy concurridos.
- **Carpeta:** `frontend/public/images/places/caribe/playa-blanca-baru/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-vista.jpg` | Vista icónica / postcard de Playa Blanca Barú (Cartagena). |
| `02-detalle.jpg` | Detalle arquitectónico, natural o cultural de Playa Blanca Barú. |
| `03-contexto.jpg` | Visitantes o contexto del lugar. Playa de arena blanca y mar turquesa a 45 minutos en lancha desde Cartagena. Perfecta para día de sol, deportes acuático |

#### 15. Agencia Caribe Tours

- **Tipo:** Agencia · **Ciudad:** Cartagena (Bolívar)
- **Tags:** agencia, tours, personalizado, multilingual
- **Descripción (para buscar fotos):** Agencia local especializada en tours personalizados por el Caribe colombiano: Rosario, Barú, Mompox y combo Cartagena-Santa Marta. Atención en español e inglés.
- **Carpeta:** `frontend/public/images/places/caribe/agencia-caribe-tours/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-marca.jpg` | Oficina, stand o identidad visual de Agencia Caribe Tours en Cartagena. |
| `02-experiencia.jpg` | Turistas en una experiencia típica que vende la agencia (agencia, tours, personalizado, multilingual). |
| `03-destino.jpg` | Destino representativo vinculado a Agencia Caribe Tours. Agencia local especializada en tours personalizados por el Caribe colombiano: Rosario, Barú, Mompox y combo Cartagena-Sa |

#### 16. Hotel Zuana

- **Tipo:** Hotel · **Ciudad:** Santa Marta (Magdalena)
- **Tags:** boutique, pareja, vista, sierra nevada
- **Descripción (para buscar fotos):** Hotel boutique en la Bahía de Santa Marta con vista a la Sierra Nevada. Piscina infinity, restaurante de autor y ambiente romántico para parejas.
- **Carpeta:** `frontend/public/images/places/caribe/hotel-zuana/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-fachada.jpg` | Fachada o entrada del hotel Hotel Zuana en Santa Marta. Exterior reconocible. |
| `02-ambiente.jpg` | Lobby, patio, piscina o habitación típica de Hotel Zuana. Ambiente del hospedaje. |
| `03-detalle.jpg` | Detalle que refuerce: boutique, pareja, vista, sierra nevada. Contexto: Hotel boutique en la Bahía de Santa Marta con vista a la Sierra Nevada. Piscina infinity, restaurante de autor y ambient |

#### 17. Minca Eco Lodge

- **Tipo:** Hotel · **Ciudad:** Minca (Magdalena)
- **Tags:** ecoturismo, aves, naturaleza, café
- **Descripción (para buscar fotos):** Eco-lodge en la montaña a 30 min de Santa Marta. Avistamiento de aves, cascadas de Marinka y café de finca. Desconexión total en la selva tropical.
- **Carpeta:** `frontend/public/images/places/caribe/minca-eco-lodge/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-fachada.jpg` | Fachada o entrada del hotel Minca Eco Lodge en Minca. Exterior reconocible. |
| `02-ambiente.jpg` | Lobby, patio, piscina o habitación típica de Minca Eco Lodge. Ambiente del hospedaje. |
| `03-detalle.jpg` | Detalle que refuerce: ecoturismo, aves, naturaleza, café. Contexto: Eco-lodge en la montaña a 30 min de Santa Marta. Avistamiento de aves, cascadas de Marinka y café de finca. Desconexión  |

#### 18. Tour Manglar La Boquilla

- **Tipo:** Actividad · **Ciudad:** Cartagena (Bolívar)
- **Tags:** cultura, naturaleza, comunitario, aves
- **Descripción (para buscar fotos):** Recorrido en canoa por los manglares de La Boquilla con pescadores locales. Avistamiento de aves, cangrejos y aprendizaje sobre la cultura afrocolombiana costeña.
- **Carpeta:** `frontend/public/images/places/caribe/tour-manglar-la-boquilla/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-accion.jpg` | Personas haciendo la actividad de Tour Manglar La Boquilla en Cartagena. |
| `02-escenario.jpg` | Paisaje o escenario principal donde ocurre: cultura, naturaleza, comunitario, aves. |
| `03-experiencia.jpg` | Momento memorable de la experiencia. Recorrido en canoa por los manglares de La Boquilla con pescadores locales. Avistamiento de aves, cangrejos y aprendizaj |

#### 19. Restaurante Mistura

- **Tipo:** Restaurante · **Ciudad:** San Andrés (San Andrés y Providencia)
- **Tags:** gastronomia, mariscos, atardecer, isla
- **Descripción (para buscar fotos):** Fusión caribeña-isleña con énfasis en langosta, pargo rojo y plátano. Terraza con vista al mar y ambiente relajado para cenas al atardecer.
- **Carpeta:** `frontend/public/images/places/caribe/restaurante-mistura/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-plato.jpg` | Plato o mesa emblemática de Restaurante Mistura (San Andrés). Comida acorde a: gastronomia, mariscos, atardecer, isla. |
| `02-local.jpg` | Interior o terraza del restaurante Restaurante Mistura. |
| `03-ambiente.jpg` | Ambiente gastronómico / barrio. Fusión caribeña-isleña con énfasis en langosta, pargo rojo y plátano. Terraza con vista al mar y ambiente relajado para  |

#### 20. Providencia Island Dive Center

- **Tipo:** Actividad · **Ciudad:** Providencia (San Andrés y Providencia)
- **Tags:** buceo, snorkel, arrecife, aventura
- **Descripción (para buscar fotos):** Buceo y snorkel en el segundo arrecife de barrera más grande del Caribe. Visibilidad excepcional, tortugas marinas y formaciones de coral prístinas.
- **Carpeta:** `frontend/public/images/places/caribe/providencia-island-dive-center/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-accion.jpg` | Personas haciendo la actividad de Providencia Island Dive Center en Providencia. |
| `02-escenario.jpg` | Paisaje o escenario principal donde ocurre: buceo, snorkel, arrecife, aventura. |
| `03-experiencia.jpg` | Momento memorable de la experiencia. Buceo y snorkel en el segundo arrecife de barrera más grande del Caribe. Visibilidad excepcional, tortugas marinas y for |

#### 21. Hostal Casa en el Aire

- **Tipo:** Hotel · **Ciudad:** Mompox (Bolívar)
- **Tags:** historia, colonial, patrimonio, economico
- **Descripción (para buscar fotos):** Hostal con encanto colonial en el centro histórico de Mompox, patrimonio UNESCO. Patios interiores, hamacas y acceso a la Cienaga de Pijiño para avistamiento de aves.
- **Carpeta:** `frontend/public/images/places/caribe/hostal-casa-en-el-aire/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-fachada.jpg` | Fachada o entrada del hotel Hostal Casa en el Aire en Mompox. Exterior reconocible. |
| `02-ambiente.jpg` | Lobby, patio, piscina o habitación típica de Hostal Casa en el Aire. Ambiente del hospedaje. |
| `03-detalle.jpg` | Detalle que refuerce: historia, colonial, patrimonio, economico. Contexto: Hostal con encanto colonial en el centro histórico de Mompox, patrimonio UNESCO. Patios interiores, hamacas y acceso a l |

#### 22. Kitesurf Cartagena

- **Tipo:** Actividad · **Ciudad:** Cartagena (Bolívar)
- **Tags:** kitesurf, deportes, aventura, playa
- **Descripción (para buscar fotos):** Escuela de kitesurf en la Playa de Manzanillo con vientos constantes todo el año. Clases para principiantes y avanzados, equipo incluido y certificación IKO.
- **Carpeta:** `frontend/public/images/places/caribe/kitesurf-cartagena/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-accion.jpg` | Personas haciendo la actividad de Kitesurf Cartagena en Cartagena. |
| `02-escenario.jpg` | Paisaje o escenario principal donde ocurre: kitesurf, deportes, aventura, playa. |
| `03-experiencia.jpg` | Momento memorable de la experiencia. Escuela de kitesurf en la Playa de Manzanillo con vientos constantes todo el año. Clases para principiantes y avanzados, |

#### 23. Restaurante Carmen

- **Tipo:** Restaurante · **Ciudad:** Cartagena (Bolívar)
- **Tags:** fine dining, gastronomia, lujo, centro historico
- **Descripción (para buscar fotos):** Alta gastronomía colombiana en una casona del centro histórico. Menú degustación con ingredientes locales reinventados. Reservación obligatoria.
- **Carpeta:** `frontend/public/images/places/caribe/restaurante-carmen/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-plato.jpg` | Plato o mesa emblemática de Restaurante Carmen (Cartagena). Comida acorde a: fine dining, gastronomia, lujo, centro historico. |
| `02-local.jpg` | Interior o terraza del restaurante Restaurante Carmen. |
| `03-ambiente.jpg` | Ambiente gastronómico / barrio. Alta gastronomía colombiana en una casona del centro histórico. Menú degustación con ingredientes locales reinventados.  |

#### 24. Aviatur Caribe

- **Tipo:** Agencia · **Ciudad:** Cartagena (Bolívar)
- **Tags:** agencia, paquetes, vuelos, corporativo
- **Descripción (para buscar fotos):** Paquetes integrales Caribe colombiano: vuelos, hoteles y experiencias en Cartagena, San Andrés y Santa Marta. Atención corporativa y vacacional con más de 40 años de experiencia.
- **Carpeta:** `frontend/public/images/places/caribe/aviatur-caribe/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-marca.jpg` | Oficina, stand o identidad visual de Aviatur Caribe en Cartagena. |
| `02-experiencia.jpg` | Turistas en una experiencia típica que vende la agencia (agencia, paquetes, vuelos, corporativo). |
| `03-destino.jpg` | Destino representativo vinculado a Aviatur Caribe. Paquetes integrales Caribe colombiano: vuelos, hoteles y experiencias en Cartagena, San Andrés y Santa Marta. Atención c |

#### 25. Volcán de Lodo El Totumo

- **Tipo:** Atractivo · **Ciudad:** Galapa (Atlántico)
- **Tags:** aventura, medio dia, unico, relax
- **Descripción (para buscar fotos):** Experiencia única flotando en un volcán de lodo a 45 min de Cartagena. Propiedades terapéuticas del lodo y masaje incluido. Tour de medio día muy popular.
- **Carpeta:** `frontend/public/images/places/caribe/volcan-de-lodo-el-totumo/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-vista.jpg` | Vista icónica / postcard de Volcán de Lodo El Totumo (Galapa). |
| `02-detalle.jpg` | Detalle arquitectónico, natural o cultural de Volcán de Lodo El Totumo. |
| `03-contexto.jpg` | Visitantes o contexto del lugar. Experiencia única flotando en un volcán de lodo a 45 min de Cartagena. Propiedades terapéuticas del lodo y masaje inclui |

### Andina (15 lugares)

#### 1. Hotel Casa Medina

- **Tipo:** Hotel · **Ciudad:** Bogotá (Cundinamarca)
- **Tags:** lujo, boutique, gastronomia, zona g
- **Descripción (para buscar fotos):** Hotel boutique de lujo en la Zona G. Arquitectura colonial restaurada, restaurante gourmet y ubicación premium cerca de zonas rosa y financiera.
- **Carpeta:** `frontend/public/images/places/andina/hotel-casa-medina/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-fachada.jpg` | Fachada o entrada del hotel Hotel Casa Medina en Bogotá. Exterior reconocible. |
| `02-ambiente.jpg` | Lobby, patio, piscina o habitación típica de Hotel Casa Medina. Ambiente del hospedaje. |
| `03-detalle.jpg` | Detalle que refuerce: lujo, boutique, gastronomia, zona g. Contexto: Hotel boutique de lujo en la Zona G. Arquitectura colonial restaurada, restaurante gourmet y ubicación premium cerca de  |

#### 2. Cerro de Monserrate

- **Tipo:** Atractivo · **Ciudad:** Bogotá (Cundinamarca)
- **Tags:** mirador, cultura, familia, iconico
- **Descripción (para buscar fotos):** Mirador icónico a 3.152 m.s.n.m. con vistas panorámicas de Bogotá. Santuario, restaurante y acceso en funicular o teleférico. Imperdible al atardecer.
- **Carpeta:** `frontend/public/images/places/andina/cerro-de-monserrate/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-vista.jpg` | Vista icónica / postcard de Cerro de Monserrate (Bogotá). |
| `02-detalle.jpg` | Detalle arquitectónico, natural o cultural de Cerro de Monserrate. |
| `03-contexto.jpg` | Visitantes o contexto del lugar. Mirador icónico a 3.152 m.s.n.m. con vistas panorámicas de Bogotá. Santuario, restaurante y acceso en funicular o telefé |

#### 3. Museo del Oro

- **Tipo:** Atractivo · **Ciudad:** Bogotá (Cundinamarca)
- **Tags:** museo, cultura, historia, familia
- **Descripción (para buscar fotos):** Colección más grande de orfebrería prehispánica del mundo. Sala de la Balsa Muisca y piezas de culturas indígenas colombianas. Entrada gratuita los domingos.
- **Carpeta:** `frontend/public/images/places/andina/museo-del-oro/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-vista.jpg` | Vista icónica / postcard de Museo del Oro (Bogotá). |
| `02-detalle.jpg` | Detalle arquitectónico, natural o cultural de Museo del Oro. |
| `03-contexto.jpg` | Visitantes o contexto del lugar. Colección más grande de orfebrería prehispánica del mundo. Sala de la Balsa Muisca y piezas de culturas indígenas colomb |

#### 4. Andrés Carne de Res

- **Tipo:** Restaurante · **Ciudad:** Chía (Cundinamarca)
- **Tags:** nocturno, gastronomia, musica, iconico
- **Descripción (para buscar fotos):** Experiencia gastronómica y festiva con decoración ecléctica, música en vivo y carnes premium. Destino nocturno emblemático cerca de Bogotá desde hace décadas.
- **Carpeta:** `frontend/public/images/places/andina/andres-carne-de-res/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-plato.jpg` | Plato o mesa emblemática de Andrés Carne de Res (Chía). Comida acorde a: nocturno, gastronomia, musica, iconico. |
| `02-local.jpg` | Interior o terraza del restaurante Andrés Carne de Res. |
| `03-ambiente.jpg` | Ambiente gastronómico / barrio. Experiencia gastronómica y festiva con decoración ecléctica, música en vivo y carnes premium. Destino nocturno emblemáti |

#### 5. Hotel The Charlee

- **Tipo:** Hotel · **Ciudad:** Medellín (Antioquia)
- **Tags:** lujo, diseno, poblado, rooftop
- **Descripción (para buscar fotos):** Hotel de diseño en el Poblado con rooftop, piscina infinita y vistas a las montañas. Favorito de viajeros internacionales por su ubicación y estilo urbano.
- **Carpeta:** `frontend/public/images/places/andina/hotel-the-charlee/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-fachada.jpg` | Fachada o entrada del hotel Hotel The Charlee en Medellín. Exterior reconocible. |
| `02-ambiente.jpg` | Lobby, patio, piscina o habitación típica de Hotel The Charlee. Ambiente del hospedaje. |
| `03-detalle.jpg` | Detalle que refuerce: lujo, diseno, poblado, rooftop. Contexto: Hotel de diseño en el Poblado con rooftop, piscina infinita y vistas a las montañas. Favorito de viajeros internacionale |

#### 6. Tour Comuna 13

- **Tipo:** Actividad · **Ciudad:** Medellín (Antioquia)
- **Tags:** cultura, arte urbano, historia, guia local
- **Descripción (para buscar fotos):** Recorrido guiado por la transformación urbana de la Comuna 13. Grafitis, escaleras eléctricas, hip hop y historia de resiliencia paisa. Guías locales certificados.
- **Carpeta:** `frontend/public/images/places/andina/tour-comuna-13/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-accion.jpg` | Personas haciendo la actividad de Tour Comuna 13 en Medellín. |
| `02-escenario.jpg` | Paisaje o escenario principal donde ocurre: cultura, arte urbano, historia, guia local. |
| `03-experiencia.jpg` | Momento memorable de la experiencia. Recorrido guiado por la transformación urbana de la Comuna 13. Grafitis, escaleras eléctricas, hip hop y historia de res |

#### 7. Parque Arví

- **Tipo:** Atractivo · **Ciudad:** Medellín (Antioquia)
- **Tags:** naturaleza, senderismo, familia, metrocable
- **Descripción (para buscar fotos):** Reserva forestal accesible en metrocable. Senderos ecológicos, mercado campesino y clima fresco a minutos del centro. Ideal para familias y amantes de la naturaleza.
- **Carpeta:** `frontend/public/images/places/andina/parque-arvi/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-vista.jpg` | Vista icónica / postcard de Parque Arví (Medellín). |
| `02-detalle.jpg` | Detalle arquitectónico, natural o cultural de Parque Arví. |
| `03-contexto.jpg` | Visitantes o contexto del lugar. Reserva forestal accesible en metrocable. Senderos ecológicos, mercado campesino y clima fresco a minutos del centro. Id |

#### 8. Restaurante Oci.Mde

- **Tipo:** Restaurante · **Ciudad:** Medellín (Antioquia)
- **Tags:** fine dining, gastronomia, poblado, autor
- **Descripción (para buscar fotos):** Alta cocina paisa contemporánea en El Poblado. Ingredientes locales con técnicas de autor. Carta de vinos colombianos y coctelería de autor.
- **Carpeta:** `frontend/public/images/places/andina/restaurante-oci-mde/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-plato.jpg` | Plato o mesa emblemática de Restaurante Oci.Mde (Medellín). Comida acorde a: fine dining, gastronomia, poblado, autor. |
| `02-local.jpg` | Interior o terraza del restaurante Restaurante Oci.Mde. |
| `03-ambiente.jpg` | Ambiente gastronómico / barrio. Alta cocina paisa contemporánea en El Poblado. Ingredientes locales con técnicas de autor. Carta de vinos colombianos y  |

#### 9. Plaza Mayor de Villa de Leyva

- **Tipo:** Atractivo · **Ciudad:** Villa de Leyva (Boyacá)
- **Tags:** colonial, patrimonio, pueblo, fin de semana
- **Descripción (para buscar fotos):** La plaza de armas más grande de Colombia rodeada de arquitectura colonial blanca. Pueblo patrimonio ideal para escapada de fin de semana desde Bogotá.
- **Carpeta:** `frontend/public/images/places/andina/plaza-mayor-de-villa-de-leyva/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-vista.jpg` | Vista icónica / postcard de Plaza Mayor de Villa de Leyva (Villa de Leyva). |
| `02-detalle.jpg` | Detalle arquitectónico, natural o cultural de Plaza Mayor de Villa de Leyva. |
| `03-contexto.jpg` | Visitantes o contexto del lugar. La plaza de armas más grande de Colombia rodeada de arquitectura colonial blanca. Pueblo patrimonio ideal para escapada  |

#### 10. Hotel Plazuela de San Agustín

- **Tipo:** Hotel · **Ciudad:** Villa de Leyva (Boyacá)
- **Tags:** colonial, boutique, romantico, chimenea
- **Descripción (para buscar fotos):** Hotel colonial con chimenea, patio interior y habitaciones con detalles artesanales. A dos cuadras de la plaza principal. Desayuno boyacense incluido.
- **Carpeta:** `frontend/public/images/places/andina/hotel-plazuela-de-san-agustin/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-fachada.jpg` | Fachada o entrada del hotel Hotel Plazuela de San Agustín en Villa de Leyva. Exterior reconocible. |
| `02-ambiente.jpg` | Lobby, patio, piscina o habitación típica de Hotel Plazuela de San Agustín. Ambiente del hospedaje. |
| `03-detalle.jpg` | Detalle que refuerce: colonial, boutique, romantico, chimenea. Contexto: Hotel colonial con chimenea, patio interior y habitaciones con detalles artesanales. A dos cuadras de la plaza principal |

#### 11. Caminata Real Barichara–Guane

- **Tipo:** Actividad · **Ciudad:** Barichara (Santander)
- **Tags:** senderismo, patrimonio, pueblo, naturaleza
- **Descripción (para buscar fotos):** Sendero histórico de 9 km entre dos pueblos patrimonio. Adoquines originales, paisaje de montaña y pueblo Guane con museo paleontológico al final.
- **Carpeta:** `frontend/public/images/places/andina/caminata-real-barichara-guane/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-accion.jpg` | Personas haciendo la actividad de Caminata Real Barichara–Guane en Barichara. |
| `02-escenario.jpg` | Paisaje o escenario principal donde ocurre: senderismo, patrimonio, pueblo, naturaleza. |
| `03-experiencia.jpg` | Momento memorable de la experiencia. Sendero histórico de 9 km entre dos pueblos patrimonio. Adoquines originales, paisaje de montaña y pueblo Guane con muse |

#### 12. Hotel Serranía de Barichara

- **Tipo:** Hotel · **Ciudad:** Barichara (Santander)
- **Tags:** campestre, vistas, pueblo, relax
- **Descripción (para buscar fotos):** Hotel campestre con vistas al cañón del Suárez. Piscina, restaurante de comida santandereana y habitaciones con balcón. Pueblo más bonito de Colombia.
- **Carpeta:** `frontend/public/images/places/andina/hotel-serrania-de-barichara/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-fachada.jpg` | Fachada o entrada del hotel Hotel Serranía de Barichara en Barichara. Exterior reconocible. |
| `02-ambiente.jpg` | Lobby, patio, piscina o habitación típica de Hotel Serranía de Barichara. Ambiente del hospedaje. |
| `03-detalle.jpg` | Detalle que refuerce: campestre, vistas, pueblo, relax. Contexto: Hotel campestre con vistas al cañón del Suárez. Piscina, restaurante de comida santandereana y habitaciones con balcón.  |

#### 13. Parque Nacional del Chicamocha

- **Tipo:** Atractivo · **Ciudad:** Aratoca (Santander)
- **Tags:** canon, aventura, teleferico, familia
- **Descripción (para buscar fotos):** Cañón del Chicamocha con teleférico, mirador 360° y deportes de aventura. Uno de los paisajes más impresionantes de los Andes colombianos.
- **Carpeta:** `frontend/public/images/places/andina/parque-nacional-del-chicamocha/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-vista.jpg` | Vista icónica / postcard de Parque Nacional del Chicamocha (Aratoca). |
| `02-detalle.jpg` | Detalle arquitectónico, natural o cultural de Parque Nacional del Chicamocha. |
| `03-contexto.jpg` | Visitantes o contexto del lugar. Cañón del Chicamocha con teleférico, mirador 360° y deportes de aventura. Uno de los paisajes más impresionantes de los  |

#### 14. Laguna de Guatavita

- **Tipo:** Atractivo · **Ciudad:** Sesquilé (Cundinamarca)
- **Tags:** historia, muisca, naturaleza, leyenda
- **Descripción (para buscar fotos):** Laguna sagrada muisca origen de la leyenda de El Dorado. Sendero guiado por ecosistema de páramo. Ceremonias indígenas recreadas los fines de semana.
- **Carpeta:** `frontend/public/images/places/andina/laguna-de-guatavita/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-vista.jpg` | Vista icónica / postcard de Laguna de Guatavita (Sesquilé). |
| `02-detalle.jpg` | Detalle arquitectónico, natural o cultural de Laguna de Guatavita. |
| `03-contexto.jpg` | Visitantes o contexto del lugar. Laguna sagrada muisca origen de la leyenda de El Dorado. Sendero guiado por ecosistema de páramo. Ceremonias indígenas r |

#### 15. Agencia Colombia Raíz

- **Tipo:** Agencia · **Ciudad:** Bogotá (Cundinamarca)
- **Tags:** agencia, tours, andina, paquetes
- **Descripción (para buscar fotos):** Tours por la región Andina: Villa de Leyva, Barichara, Medellín y Boyacá. Paquetes personalizados con guías bilingües y transporte privado.
- **Carpeta:** `frontend/public/images/places/andina/agencia-colombia-raiz/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-marca.jpg` | Oficina, stand o identidad visual de Agencia Colombia Raíz en Bogotá. |
| `02-experiencia.jpg` | Turistas en una experiencia típica que vende la agencia (agencia, tours, andina, paquetes). |
| `03-destino.jpg` | Destino representativo vinculado a Agencia Colombia Raíz. Tours por la región Andina: Villa de Leyva, Barichara, Medellín y Boyacá. Paquetes personalizados con guías bilingües y  |

### Eje Cafetero (12 lugares)

#### 1. Valle del Cocora

- **Tipo:** Atractivo · **Ciudad:** Salento (Quindío)
- **Tags:** naturaleza, palmas, senderismo, iconico
- **Descripción (para buscar fotos):** Hogar de la palma de cera nacional, árbol más alto del mundo. Senderos entre niebla, caballos y vistas de montaña. Experiencia icónica del Eje Cafetero.
- **Carpeta:** `frontend/public/images/places/eje_cafetero/valle-del-cocora/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-vista.jpg` | Vista icónica / postcard de Valle del Cocora (Salento). |
| `02-detalle.jpg` | Detalle arquitectónico, natural o cultural de Valle del Cocora. |
| `03-contexto.jpg` | Visitantes o contexto del lugar. Hogar de la palma de cera nacional, árbol más alto del mundo. Senderos entre niebla, caballos y vistas de montaña. Exper |

#### 2. Hacienda San Alberto

- **Tipo:** Hotel · **Ciudad:** Buenavista (Quindío)
- **Tags:** cafe, lujo, hacienda, cata
- **Descripción (para buscar fotos):** Hacienda cafetera de lujo con tour de café premium, cata profesional y suites con vista a los cafetales. Experiencia de café de especialidad reconocida internacionalmente.
- **Carpeta:** `frontend/public/images/places/eje_cafetero/hacienda-san-alberto/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-fachada.jpg` | Fachada o entrada del hotel Hacienda San Alberto en Buenavista. Exterior reconocible. |
| `02-ambiente.jpg` | Lobby, patio, piscina o habitación típica de Hacienda San Alberto. Ambiente del hospedaje. |
| `03-detalle.jpg` | Detalle que refuerce: cafe, lujo, hacienda, cata. Contexto: Hacienda cafetera de lujo con tour de café premium, cata profesional y suites con vista a los cafetales. Experiencia de  |

#### 3. Mirador de Filandia

- **Tipo:** Atractivo · **Ciudad:** Filandia (Quindío)
- **Tags:** pueblo, mirador, artesanias, cafe
- **Descripción (para buscar fotos):** Pueblo colorido con mirador en la torre de la iglesia y vistas al valle del Cauca. Artesanías, café y arquitectura tradicional cafetera conservada.
- **Carpeta:** `frontend/public/images/places/eje_cafetero/mirador-de-filandia/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-vista.jpg` | Vista icónica / postcard de Mirador de Filandia (Filandia). |
| `02-detalle.jpg` | Detalle arquitectónico, natural o cultural de Mirador de Filandia. |
| `03-contexto.jpg` | Visitantes o contexto del lugar. Pueblo colorido con mirador en la torre de la iglesia y vistas al valle del Cauca. Artesanías, café y arquitectura tradi |

#### 4. Tour Finca Cafetera El Ocaso

- **Tipo:** Actividad · **Ciudad:** Salento (Quindío)
- **Tags:** cafe, tour, cultura, degustacion
- **Descripción (para buscar fotos):** Recorrido por finca cafetera tradicional: siembra, beneficio y tostión. Degustación de café de origen con guía experto. Duración 3 horas en español e inglés.
- **Carpeta:** `frontend/public/images/places/eje_cafetero/tour-finca-cafetera-el-ocaso/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-accion.jpg` | Personas haciendo la actividad de Tour Finca Cafetera El Ocaso en Salento. |
| `02-escenario.jpg` | Paisaje o escenario principal donde ocurre: cafe, tour, cultura, degustacion. |
| `03-experiencia.jpg` | Momento memorable de la experiencia. Recorrido por finca cafetera tradicional: siembra, beneficio y tostión. Degustación de café de origen con guía experto.  |

#### 5. Hotel Bioxury

- **Tipo:** Hotel · **Ciudad:** Armenia (Quindío)
- **Tags:** sostenible, spa, naturaleza, relax
- **Descripción (para buscar fotos):** Hotel sostenible rodeado de naturaleza con spa, piscina y restaurante de cocina regional. Certificación ambiental y programas de turismo responsable.
- **Carpeta:** `frontend/public/images/places/eje_cafetero/hotel-bioxury/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-fachada.jpg` | Fachada o entrada del hotel Hotel Bioxury en Armenia. Exterior reconocible. |
| `02-ambiente.jpg` | Lobby, patio, piscina o habitación típica de Hotel Bioxury. Ambiente del hospedaje. |
| `03-detalle.jpg` | Detalle que refuerce: sostenible, spa, naturaleza, relax. Contexto: Hotel sostenible rodeado de naturaleza con spa, piscina y restaurante de cocina regional. Certificación ambiental y prog |

#### 6. Termales de Santa Rosa

- **Tipo:** Atractivo · **Ciudad:** Santa Rosa de Cabal (Caldas)
- **Tags:** termales, cascada, relax, naturaleza
- **Descripción (para buscar fotos):** Cascada termal de aguas calientes en medio del bosque andino. Pozos naturales y piscinas con vista a la catarata. Experiencia de bienestar en la montaña.
- **Carpeta:** `frontend/public/images/places/eje_cafetero/termales-de-santa-rosa/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-vista.jpg` | Vista icónica / postcard de Termales de Santa Rosa (Santa Rosa de Cabal). |
| `02-detalle.jpg` | Detalle arquitectónico, natural o cultural de Termales de Santa Rosa. |
| `03-contexto.jpg` | Visitantes o contexto del lugar. Cascada termal de aguas calientes en medio del bosque andino. Pozos naturales y piscinas con vista a la catarata. Experi |

#### 7. Restaurante Brasa Parrilla Bar

- **Tipo:** Restaurante · **Ciudad:** Pereira (Risaralda)
- **Tags:** gastronomia, parrilla, nocturno, cafe
- **Descripción (para buscar fotos):** Parrilla de carnes premium y cocina risaraldense en el centro de Pereira. Ambiente elegante, cava de vinos y postres de autor con café local.
- **Carpeta:** `frontend/public/images/places/eje_cafetero/restaurante-brasa-parrilla-bar/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-plato.jpg` | Plato o mesa emblemática de Restaurante Brasa Parrilla Bar (Pereira). Comida acorde a: gastronomia, parrilla, nocturno, cafe. |
| `02-local.jpg` | Interior o terraza del restaurante Restaurante Brasa Parrilla Bar. |
| `03-ambiente.jpg` | Ambiente gastronómico / barrio. Parrilla de carnes premium y cocina risaraldense en el centro de Pereira. Ambiente elegante, cava de vinos y postres de  |

#### 8. Parque Nacional del Café

- **Tipo:** Atractivo · **Ciudad:** Montenegro (Quindío)
- **Tags:** familia, cafe, parque, folclor
- **Descripción (para buscar fotos):** Parque temático del café con shows folclóricos, teleférico, museo del café y montaña rusa. Diversión familiar con identidad cafetera en cada rincón.
- **Carpeta:** `frontend/public/images/places/eje_cafetero/parque-nacional-del-cafe/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-vista.jpg` | Vista icónica / postcard de Parque Nacional del Café (Montenegro). |
| `02-detalle.jpg` | Detalle arquitectónico, natural o cultural de Parque Nacional del Café. |
| `03-contexto.jpg` | Visitantes o contexto del lugar. Parque temático del café con shows folclóricos, teleférico, museo del café y montaña rusa. Diversión familiar con identi |

#### 9. Hotel Mocawa

- **Tipo:** Hotel · **Ciudad:** Pereira (Risaralda)
- **Tags:** negocios, piscina, centrico, confort
- **Descripción (para buscar fotos):** Hotel de negocios y ocio en el eje cafetero con piscina, gimnasio y salones de eventos. Ubicación céntrica ideal para combinar Pereira y pueblos cercanos.
- **Carpeta:** `frontend/public/images/places/eje_cafetero/hotel-mocawa/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-fachada.jpg` | Fachada o entrada del hotel Hotel Mocawa en Pereira. Exterior reconocible. |
| `02-ambiente.jpg` | Lobby, patio, piscina o habitación típica de Hotel Mocawa. Ambiente del hospedaje. |
| `03-detalle.jpg` | Detalle que refuerce: negocios, piscina, centrico, confort. Contexto: Hotel de negocios y ocio en el eje cafetero con piscina, gimnasio y salones de eventos. Ubicación céntrica ideal para co |

#### 10. Trekking Los Nevados

- **Tipo:** Actividad · **Ciudad:** Manizales (Caldas)
- **Tags:** montana, aventura, nevado, trekking
- **Descripción (para buscar fotos):** Expedición al Parque Nacional Natural Los Nevados con nevado Santa Isabel o Tolima. Guía de montaña certificado, equipo incluido. Nivel intermedio-alto.
- **Carpeta:** `frontend/public/images/places/eje_cafetero/trekking-los-nevados/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-accion.jpg` | Personas haciendo la actividad de Trekking Los Nevados en Manizales. |
| `02-escenario.jpg` | Paisaje o escenario principal donde ocurre: montana, aventura, nevado, trekking. |
| `03-experiencia.jpg` | Momento memorable de la experiencia. Expedición al Parque Nacional Natural Los Nevados con nevado Santa Isabel o Tolima. Guía de montaña certificado, equipo  |

#### 11. Salento Pueblo Patrimonio

- **Tipo:** Atractivo · **Ciudad:** Salento (Quindío)
- **Tags:** pueblo, patrimonio, artesanias, cafe
- **Descripción (para buscar fotos):** Calle Real con casas coloridas, artesanías en guadua y gastronomía local. Punto de partida al Cocora. Ambiente bohemio y cafetero auténtico.
- **Carpeta:** `frontend/public/images/places/eje_cafetero/salento-pueblo-patrimonio/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-vista.jpg` | Vista icónica / postcard de Salento Pueblo Patrimonio (Salento). |
| `02-detalle.jpg` | Detalle arquitectónico, natural o cultural de Salento Pueblo Patrimonio. |
| `03-contexto.jpg` | Visitantes o contexto del lugar. Calle Real con casas coloridas, artesanías en guadua y gastronomía local. Punto de partida al Cocora. Ambiente bohemio y |

#### 12. Agencia Viajes del Eje

- **Tipo:** Agencia · **Ciudad:** Armenia (Quindío)
- **Tags:** agencia, cafe, paquetes, eje cafetero
- **Descripción (para buscar fotos):** Paquetes por el Paisaje Cultural Cafetero: Salento, Filandia, fincas y termales. Transporte privado, guías locales y tarifas para parejas y grupos.
- **Carpeta:** `frontend/public/images/places/eje_cafetero/agencia-viajes-del-eje/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-marca.jpg` | Oficina, stand o identidad visual de Agencia Viajes del Eje en Armenia. |
| `02-experiencia.jpg` | Turistas en una experiencia típica que vende la agencia (agencia, cafe, paquetes, eje cafetero). |
| `03-destino.jpg` | Destino representativo vinculado a Agencia Viajes del Eje. Paquetes por el Paisaje Cultural Cafetero: Salento, Filandia, fincas y termales. Transporte privado, guías locales y tar |

### Pacífico (12 lugares)

#### 1. Hotel Punta Faro

- **Tipo:** Hotel · **Ciudad:** Nuquí (Chocó)
- **Tags:** ecologico, playa, ballenas, desconexion
- **Descripción (para buscar fotos):** Lodge ecológico frente al Pacífico con cabañas sobre el mar. Desconexión total, ballenas en temporada y gastronomía de mariscos frescos. Solo acceso por avioneta o bote.
- **Carpeta:** `frontend/public/images/places/pacifico/hotel-punta-faro/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-fachada.jpg` | Fachada o entrada del hotel Hotel Punta Faro en Nuquí. Exterior reconocible. |
| `02-ambiente.jpg` | Lobby, patio, piscina o habitación típica de Hotel Punta Faro. Ambiente del hospedaje. |
| `03-detalle.jpg` | Detalle que refuerce: ecologico, playa, ballenas, desconexion. Contexto: Lodge ecológico frente al Pacífico con cabañas sobre el mar. Desconexión total, ballenas en temporada y gastronomía de m |

#### 2. Avistamiento de Ballenas Nuquí

- **Tipo:** Actividad · **Ciudad:** Nuquí (Chocó)
- **Tags:** ballenas, bote, naturaleza, temporada
- **Descripción (para buscar fotos):** Tour en bote para ver ballenas jorobadas julio–octubre. Guías locales expertos, avistamiento de delfines y snorkel en aguas cálidas del Pacífico colombiano.
- **Carpeta:** `frontend/public/images/places/pacifico/avistamiento-de-ballenas-nuqui/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-accion.jpg` | Personas haciendo la actividad de Avistamiento de Ballenas Nuquí en Nuquí. |
| `02-escenario.jpg` | Paisaje o escenario principal donde ocurre: ballenas, bote, naturaleza, temporada. |
| `03-experiencia.jpg` | Momento memorable de la experiencia. Tour en bote para ver ballenas jorobadas julio–octubre. Guías locales expertos, avistamiento de delfines y snorkel en ag |

#### 3. Termales y Cascada San Cipriano

- **Tipo:** Atractivo · **Ciudad:** Buenaventura (Valle del Cauca)
- **Tags:** rio, selva, aventura, naturaleza
- **Descripción (para buscar fotos):** Río cristalino en la selva del Pacífico accesible en brujitas (motocarro sobre rieles). Pozos naturales, cascadas y biodiversidad del Chocó biogeográfico.
- **Carpeta:** `frontend/public/images/places/pacifico/termales-y-cascada-san-cipriano/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-vista.jpg` | Vista icónica / postcard de Termales y Cascada San Cipriano (Buenaventura). |
| `02-detalle.jpg` | Detalle arquitectónico, natural o cultural de Termales y Cascada San Cipriano. |
| `03-contexto.jpg` | Visitantes o contexto del lugar. Río cristalino en la selva del Pacífico accesible en brujitas (motocarro sobre rieles). Pozos naturales, cascadas y biod |

#### 4. Restaurante El Darién

- **Tipo:** Restaurante · **Ciudad:** Cali (Valle del Cauca)
- **Tags:** gastronomia, pacifico, musica, tradicional
- **Descripción (para buscar fotos):** Cocina del Pacífico en Cali: pescado encocado, arroz atollado y aborrajados. Ambiente familiar con música del Pacífico en vivo los fines de semana.
- **Carpeta:** `frontend/public/images/places/pacifico/restaurante-el-darien/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-plato.jpg` | Plato o mesa emblemática de Restaurante El Darién (Cali). Comida acorde a: gastronomia, pacifico, musica, tradicional. |
| `02-local.jpg` | Interior o terraza del restaurante Restaurante El Darién. |
| `03-ambiente.jpg` | Ambiente gastronómico / barrio. Cocina del Pacífico en Cali: pescado encocado, arroz atollado y aborrajados. Ambiente familiar con música del Pacífico e |

#### 5. Hotel Intercontinental Cali

- **Tipo:** Hotel · **Ciudad:** Cali (Valle del Cauca)
- **Tags:** lujo, ciudad, spa, gateway
- **Descripción (para buscar fotos):** Hotel de lujo en el sur de Cali, puerta de entrada al Pacífico. Piscina, spa y conexión con tours a Buenaventura, Juanchaco y San Cipriano.
- **Carpeta:** `frontend/public/images/places/pacifico/hotel-intercontinental-cali/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-fachada.jpg` | Fachada o entrada del hotel Hotel Intercontinental Cali en Cali. Exterior reconocible. |
| `02-ambiente.jpg` | Lobby, patio, piscina o habitación típica de Hotel Intercontinental Cali. Ambiente del hospedaje. |
| `03-detalle.jpg` | Detalle que refuerce: lujo, ciudad, spa, gateway. Contexto: Hotel de lujo en el sur de Cali, puerta de entrada al Pacífico. Piscina, spa y conexión con tours a Buenaventura, Juanch |

#### 6. Tour Parque Nacional Isla Gorgona

- **Tipo:** Actividad · **Ciudad:** Guapi (Cauca)
- **Tags:** buceo, parque nacional, aventura, ballenas
- **Descripción (para buscar fotos):** Excursión a la ex isla penal convertida en parque nacional. Buceo con tiburones, ballenas y selva tropical. Permiso de entrada y guía parque incluidos.
- **Carpeta:** `frontend/public/images/places/pacifico/tour-parque-nacional-isla-gorgona/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-accion.jpg` | Personas haciendo la actividad de Tour Parque Nacional Isla Gorgona en Guapi. |
| `02-escenario.jpg` | Paisaje o escenario principal donde ocurre: buceo, parque nacional, aventura, ballenas. |
| `03-experiencia.jpg` | Momento memorable de la experiencia. Excursión a la ex isla penal convertida en parque nacional. Buceo con tiburones, ballenas y selva tropical. Permiso de e |

#### 7. Cascada El Charco

- **Tipo:** Atractivo · **Ciudad:** Bahía Solano (Chocó)
- **Tags:** cascada, selva, senderismo, aves
- **Descripción (para buscar fotos):** Cascada de 80 metros en la selva del Chocó con pozo para nadar. Sendero de 2 horas con guía local. Biodiversidad extrema y aves endémicas.
- **Carpeta:** `frontend/public/images/places/pacifico/cascada-el-charco/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-vista.jpg` | Vista icónica / postcard de Cascada El Charco (Bahía Solano). |
| `02-detalle.jpg` | Detalle arquitectónico, natural o cultural de Cascada El Charco. |
| `03-contexto.jpg` | Visitantes o contexto del lugar. Cascada de 80 metros en la selva del Chocó con pozo para nadar. Sendero de 2 horas con guía local. Biodiversidad extrema |

#### 8. Lodge El Almejal

- **Tipo:** Hotel · **Ciudad:** Bahía Solano (Chocó)
- **Tags:** eco lodge, playa, tortugas, kayak
- **Descripción (para buscar fotos):** Eco lodge en playa virgen del Pacífico con cabañas de madera. Tortugas marinas en temporada, kayak y pesca artesanal. Cocina con productos del mar.
- **Carpeta:** `frontend/public/images/places/pacifico/lodge-el-almejal/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-fachada.jpg` | Fachada o entrada del hotel Lodge El Almejal en Bahía Solano. Exterior reconocible. |
| `02-ambiente.jpg` | Lobby, patio, piscina o habitación típica de Lodge El Almejal. Ambiente del hospedaje. |
| `03-detalle.jpg` | Detalle que refuerce: eco lodge, playa, tortugas, kayak. Contexto: Eco lodge en playa virgen del Pacífico con cabañas de madera. Tortugas marinas en temporada, kayak y pesca artesanal. Co |

#### 9. Kayak Manglares Tumaco

- **Tipo:** Actividad · **Ciudad:** Tumaco (Nariño)
- **Tags:** kayak, manglares, comunidad, aves
- **Descripción (para buscar fotos):** Recorrido en kayak por manglares del Pacífico nariñense. Avistamiento de aves, pesca artesanal y comunidad afrodescendiente. Guía local y equipo incluido.
- **Carpeta:** `frontend/public/images/places/pacifico/kayak-manglares-tumaco/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-accion.jpg` | Personas haciendo la actividad de Kayak Manglares Tumaco en Tumaco. |
| `02-escenario.jpg` | Paisaje o escenario principal donde ocurre: kayak, manglares, comunidad, aves. |
| `03-experiencia.jpg` | Momento memorable de la experiencia. Recorrido en kayak por manglares del Pacífico nariñense. Avistamiento de aves, pesca artesanal y comunidad afrodescendie |

#### 10. Playa Guachalito

- **Tipo:** Atractivo · **Ciudad:** El Charco (Nariño)
- **Tags:** playa, virgen, comunitario, autentico
- **Descripción (para buscar fotos):** Playa de arena negra volcánica rodeada de selva. Aguas cálidas, pocos turistas y hospedaje comunitario. Destino auténtico del Pacífico sur.
- **Carpeta:** `frontend/public/images/places/pacifico/playa-guachalito/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-vista.jpg` | Vista icónica / postcard de Playa Guachalito (El Charco). |
| `02-detalle.jpg` | Detalle arquitectónico, natural o cultural de Playa Guachalito. |
| `03-contexto.jpg` | Visitantes o contexto del lugar. Playa de arena negra volcánica rodeada de selva. Aguas cálidas, pocos turistas y hospedaje comunitario. Destino auténtic |

#### 11. Agencia Pacífico Adventures

- **Tipo:** Agencia · **Ciudad:** Cali (Valle del Cauca)
- **Tags:** agencia, pacifico, ballenas, paquetes
- **Descripción (para buscar fotos):** Especialistas en turismo del Pacífico colombiano: Nuquí, Bahía Solano, Gorgona y ballenas. Paquetes con vuelos, alojamiento y guías certificados.
- **Carpeta:** `frontend/public/images/places/pacifico/agencia-pacifico-adventures/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-marca.jpg` | Oficina, stand o identidad visual de Agencia Pacífico Adventures en Cali. |
| `02-experiencia.jpg` | Turistas en una experiencia típica que vende la agencia (agencia, pacifico, ballenas, paquetes). |
| `03-destino.jpg` | Destino representativo vinculado a Agencia Pacífico Adventures. Especialistas en turismo del Pacífico colombiano: Nuquí, Bahía Solano, Gorgona y ballenas. Paquetes con vuelos, alojamie |

#### 12. Restaurante Mar del Sur

- **Tipo:** Restaurante · **Ciudad:** Buenaventura (Valle del Cauca)
- **Tags:** mariscos, puerto, gastronomia, pacifico
- **Descripción (para buscar fotos):** Mariscos frescos del puerto más importante del Pacífico. Cazuela de mariscos, pescado frito y jugos tropicales con vista al malecón portuario.
- **Carpeta:** `frontend/public/images/places/pacifico/restaurante-mar-del-sur/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-plato.jpg` | Plato o mesa emblemática de Restaurante Mar del Sur (Buenaventura). Comida acorde a: mariscos, puerto, gastronomia, pacifico. |
| `02-local.jpg` | Interior o terraza del restaurante Restaurante Mar del Sur. |
| `03-ambiente.jpg` | Ambiente gastronómico / barrio. Mariscos frescos del puerto más importante del Pacífico. Cazuela de mariscos, pescado frito y jugos tropicales con vista |

### Amazonía (10 lugares)

#### 1. Hotel Decameron Amazonia

- **Tipo:** Hotel · **Ciudad:** Leticia (Amazonas)
- **Tags:** resort, selva, todo incluido, familia
- **Descripción (para buscar fotos):** Resort todo incluido en la triple frontera Colombia-Perú-Brasil. Piscina, actividades en la selva y gastronomía amazónica. Base ideal para explorar la región.
- **Carpeta:** `frontend/public/images/places/amazonia/hotel-decameron-amazonia/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-fachada.jpg` | Fachada o entrada del hotel Hotel Decameron Amazonia en Leticia. Exterior reconocible. |
| `02-ambiente.jpg` | Lobby, patio, piscina o habitación típica de Hotel Decameron Amazonia. Ambiente del hospedaje. |
| `03-detalle.jpg` | Detalle que refuerce: resort, selva, todo incluido, familia. Contexto: Resort todo incluido en la triple frontera Colombia-Perú-Brasil. Piscina, actividades en la selva y gastronomía amazónic |

#### 2. Tour Río Amazonas

- **Tipo:** Actividad · **Ciudad:** Leticia (Amazonas)
- **Tags:** rio, delfines, atardecer, indigena
- **Descripción (para buscar fotos):** Navegación por el río Amazonas al atardecer con avistamiento de delfines rosados y loros en la isla de los micos. Incluye guía indígena y refrigerio.
- **Carpeta:** `frontend/public/images/places/amazonia/tour-rio-amazonas/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-accion.jpg` | Personas haciendo la actividad de Tour Río Amazonas en Leticia. |
| `02-escenario.jpg` | Paisaje o escenario principal donde ocurre: rio, delfines, atardecer, indigena. |
| `03-experiencia.jpg` | Momento memorable de la experiencia. Navegación por el río Amazonas al atardecer con avistamiento de delfines rosados y loros en la isla de los micos. Incluy |

#### 3. Reserva Natural Tanimboca

- **Tipo:** Atractivo · **Ciudad:** Leticia (Amazonas)
- **Tags:** canopy, selva, nocturno, biodiversidad
- **Descripción (para buscar fotos):** Selva primaria con canopy en árboles gigantes, caminata nocturna y cabañas suspendidas. Experiencia inmersiva en la biodiversidad amazónica.
- **Carpeta:** `frontend/public/images/places/amazonia/reserva-natural-tanimboca/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-vista.jpg` | Vista icónica / postcard de Reserva Natural Tanimboca (Leticia). |
| `02-detalle.jpg` | Detalle arquitectónico, natural o cultural de Reserva Natural Tanimboca. |
| `03-contexto.jpg` | Visitantes o contexto del lugar. Selva primaria con canopy en árboles gigantes, caminata nocturna y cabañas suspendidas. Experiencia inmersiva en la biod |

#### 4. Lodge Puerto Nariño

- **Tipo:** Hotel · **Ciudad:** Puerto Nariño (Amazonas)
- **Tags:** ecologico, sostenible, indigena, lago
- **Descripción (para buscar fotos):** Hotel ecológico en el pueblo más sostenible de Colombia. Sin motos, convivencia con comunidades indígenas y acceso al Lago Tarapoto con delfines.
- **Carpeta:** `frontend/public/images/places/amazonia/lodge-puerto-narino/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-fachada.jpg` | Fachada o entrada del hotel Lodge Puerto Nariño en Puerto Nariño. Exterior reconocible. |
| `02-ambiente.jpg` | Lobby, patio, piscina o habitación típica de Lodge Puerto Nariño. Ambiente del hospedaje. |
| `03-detalle.jpg` | Detalle que refuerce: ecologico, sostenible, indigena, lago. Contexto: Hotel ecológico en el pueblo más sostenible de Colombia. Sin motos, convivencia con comunidades indígenas y acceso al La |

#### 5. Avistamiento Delfines Rosados

- **Tipo:** Actividad · **Ciudad:** Puerto Nariño (Amazonas)
- **Tags:** delfines, lago, fauna, tikuna
- **Descripción (para buscar fotos):** Salida matutina al Lago Tarapoto para ver delfines rosados del Amazonas en su hábitat. Guía tikuna, lancha pequeña y respeto por la fauna silvestre.
- **Carpeta:** `frontend/public/images/places/amazonia/avistamiento-delfines-rosados/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-accion.jpg` | Personas haciendo la actividad de Avistamiento Delfines Rosados en Puerto Nariño. |
| `02-escenario.jpg` | Paisaje o escenario principal donde ocurre: delfines, lago, fauna, tikuna. |
| `03-experiencia.jpg` | Momento memorable de la experiencia. Salida matutina al Lago Tarapoto para ver delfines rosados del Amazonas en su hábitat. Guía tikuna, lancha pequeña y res |

#### 6. Experiencia Comunidad Tikuna

- **Tipo:** Actividad · **Ciudad:** Leticia (Amazonas)
- **Tags:** indigena, cultura, artesanias, comunitario
- **Descripción (para buscar fotos):** Visita a comunidad indígena tikuna: artesanías en chontaduro, danzas tradicionales y conocimiento de plantas medicinales. Turismo comunitario responsable.
- **Carpeta:** `frontend/public/images/places/amazonia/experiencia-comunidad-tikuna/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-accion.jpg` | Personas haciendo la actividad de Experiencia Comunidad Tikuna en Leticia. |
| `02-escenario.jpg` | Paisaje o escenario principal donde ocurre: indigena, cultura, artesanias, comunitario. |
| `03-experiencia.jpg` | Momento memorable de la experiencia. Visita a comunidad indígena tikuna: artesanías en chontaduro, danzas tradicionales y conocimiento de plantas medicinales |

#### 7. Museo Etnográfico Amazonas

- **Tipo:** Atractivo · **Ciudad:** Leticia (Amazonas)
- **Tags:** museo, etnias, cultura, historia
- **Descripción (para buscar fotos):** Colección de artefactos de las 22 etnias del Amazonas colombiano. Máscaras, cerbatanas y exposición sobre la triple frontera. Visita esencial antes de la selva.
- **Carpeta:** `frontend/public/images/places/amazonia/museo-etnografico-amazonas/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-vista.jpg` | Vista icónica / postcard de Museo Etnográfico Amazonas (Leticia). |
| `02-detalle.jpg` | Detalle arquitectónico, natural o cultural de Museo Etnográfico Amazonas. |
| `03-contexto.jpg` | Visitantes o contexto del lugar. Colección de artefactos de las 22 etnias del Amazonas colombiano. Máscaras, cerbatanas y exposición sobre la triple fron |

#### 8. Expedición Selva Mata-Matá

- **Tipo:** Actividad · **Ciudad:** Leticia (Amazonas)
- **Tags:** expedicion, selva, aventura, fauna
- **Descripción (para buscar fotos):** Caminata de varios días en selva primaria con guía experto. Identificación de fauna, pesca de pirañas y pernocta en hamacas. Nivel de aventura alto.
- **Carpeta:** `frontend/public/images/places/amazonia/expedicion-selva-mata-mata/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-accion.jpg` | Personas haciendo la actividad de Expedición Selva Mata-Matá en Leticia. |
| `02-escenario.jpg` | Paisaje o escenario principal donde ocurre: expedicion, selva, aventura, fauna. |
| `03-experiencia.jpg` | Momento memorable de la experiencia. Caminata de varios días en selva primaria con guía experto. Identificación de fauna, pesca de pirañas y pernocta en hama |

#### 9. Restaurante Tierras Amazónicas

- **Tipo:** Restaurante · **Ciudad:** Leticia (Amazonas)
- **Tags:** gastronomia, amazonica, exotico, tradicional
- **Descripción (para buscar fotos):** Gastronomía amazónica: mojojoy, pescado patarashca, fariña y jugos de frutas exóticas. Ingredientes de la selva preparados con técnicas tradicionales.
- **Carpeta:** `frontend/public/images/places/amazonia/restaurante-tierras-amazonicas/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-plato.jpg` | Plato o mesa emblemática de Restaurante Tierras Amazónicas (Leticia). Comida acorde a: gastronomia, amazonica, exotico, tradicional. |
| `02-local.jpg` | Interior o terraza del restaurante Restaurante Tierras Amazónicas. |
| `03-ambiente.jpg` | Ambiente gastronómico / barrio. Gastronomía amazónica: mojojoy, pescado patarashca, fariña y jugos de frutas exóticas. Ingredientes de la selva preparad |

#### 10. Agencia Amazon Jungle Tours

- **Tipo:** Agencia · **Ciudad:** Leticia (Amazonas)
- **Tags:** agencia, amazonas, selva, paquetes
- **Descripción (para buscar fotos):** Tours integrales por el Amazonas: delfines, comunidades indígenas, selva y triple frontera. Vuelos, alojamiento y guías certificados en español e inglés.
- **Carpeta:** `frontend/public/images/places/amazonia/agencia-amazon-jungle-tours/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-marca.jpg` | Oficina, stand o identidad visual de Agencia Amazon Jungle Tours en Leticia. |
| `02-experiencia.jpg` | Turistas en una experiencia típica que vende la agencia (agencia, amazonas, selva, paquetes). |
| `03-destino.jpg` | Destino representativo vinculado a Agencia Amazon Jungle Tours. Tours integrales por el Amazonas: delfines, comunidades indígenas, selva y triple frontera. Vuelos, alojamiento y guías  |

### Llanos (10 lugares)

#### 1. Hato La Aurora

- **Tipo:** Actividad · **Ciudad:** Paz de Ariporo (Casanare)
- **Tags:** safari, fauna, aves, hato
- **Descripción (para buscar fotos):** Safari llanero en hato ganadero de 16.000 hectáreas. Caimanes, capibaras, anacondas y más de 400 especies de aves. Experiencia auténtica de los llanos colombianos.
- **Carpeta:** `frontend/public/images/places/llanos/hato-la-aurora/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-accion.jpg` | Personas haciendo la actividad de Hato La Aurora en Paz de Ariporo. |
| `02-escenario.jpg` | Paisaje o escenario principal donde ocurre: safari, fauna, aves, hato. |
| `03-experiencia.jpg` | Momento memorable de la experiencia. Safari llanero en hato ganadero de 16.000 hectáreas. Caimanes, capibaras, anacondas y más de 400 especies de aves. Exper |

#### 2. Safari Llanero Yopal

- **Tipo:** Actividad · **Ciudad:** Yopal (Casanare)
- **Tags:** safari, joropo, sabana, fauna
- **Descripción (para buscar fotos):** Recorrido en camión safari por sabanas inundables. Avistamiento de venados, garzas y cóndores de los llanos. Incluye almuerzo llanero y show de joropo.
- **Carpeta:** `frontend/public/images/places/llanos/safari-llanero-yopal/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-accion.jpg` | Personas haciendo la actividad de Safari Llanero Yopal en Yopal. |
| `02-escenario.jpg` | Paisaje o escenario principal donde ocurre: safari, joropo, sabana, fauna. |
| `03-experiencia.jpg` | Momento memorable de la experiencia. Recorrido en camión safari por sabanas inundables. Avistamiento de venados, garzas y cóndores de los llanos. Incluye alm |

#### 3. Restaurante La Casona Llanera

- **Tipo:** Restaurante · **Ciudad:** Villavicencio (Meta)
- **Tags:** gastronomia, llanera, mamona, musica
- **Descripción (para buscar fotos):** Mamona al palo, carne a la llanera y sopa de pescado del Meta. Ambiente rústico con música llanera en vivo. La auténtica parrilla de los llanos orientales.
- **Carpeta:** `frontend/public/images/places/llanos/restaurante-la-casona-llanera/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-plato.jpg` | Plato o mesa emblemática de Restaurante La Casona Llanera (Villavicencio). Comida acorde a: gastronomia, llanera, mamona, musica. |
| `02-local.jpg` | Interior o terraza del restaurante Restaurante La Casona Llanera. |
| `03-ambiente.jpg` | Ambiente gastronómico / barrio. Mamona al palo, carne a la llanera y sopa de pescado del Meta. Ambiente rústico con música llanera en vivo. La auténtica |

#### 4. Hotel GHL Comfort Villavicencio

- **Tipo:** Hotel · **Ciudad:** Villavicencio (Meta)
- **Tags:** ciudad, confort, gateway, piscina
- **Descripción (para buscar fotos):** Hotel en la puerta de los llanos con piscina, restaurante y salones. Punto de partida para hatos, Caño Cristales y safari. Confort urbano antes de la aventura.
- **Carpeta:** `frontend/public/images/places/llanos/hotel-ghl-comfort-villavicencio/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-fachada.jpg` | Fachada o entrada del hotel Hotel GHL Comfort Villavicencio en Villavicencio. Exterior reconocible. |
| `02-ambiente.jpg` | Lobby, patio, piscina o habitación típica de Hotel GHL Comfort Villavicencio. Ambiente del hospedaje. |
| `03-detalle.jpg` | Detalle que refuerce: ciudad, confort, gateway, piscina. Contexto: Hotel en la puerta de los llanos con piscina, restaurante y salones. Punto de partida para hatos, Caño Cristales y safar |

#### 5. Tour Caño Cristales

- **Tipo:** Actividad · **Ciudad:** La Macarena (Meta)
- **Tags:** rio, colores, unico, temporada
- **Descripción (para buscar fotos):** El río más hermoso del mundo con colores rojo, verde, amarillo y negro. Temporada junio–noviembre. Incluye vuelo, guía, alimentación y permisos del parque.
- **Carpeta:** `frontend/public/images/places/llanos/tour-cano-cristales/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-accion.jpg` | Personas haciendo la actividad de Tour Caño Cristales en La Macarena. |
| `02-escenario.jpg` | Paisaje o escenario principal donde ocurre: rio, colores, unico, temporada. |
| `03-experiencia.jpg` | Momento memorable de la experiencia. El río más hermoso del mundo con colores rojo, verde, amarillo y negro. Temporada junio–noviembre. Incluye vuelo, guía,  |

#### 6. Estrella de Agua

- **Tipo:** Atractivo · **Ciudad:** Villavicencio (Meta)
- **Tags:** balneario, familia, agua, campestre
- **Descripción (para buscar fotos):** Balneario natural con pozos de agua cristalina al pie de la cordillera. Familias locales y ambiente campestre. Comida típica y sombrillas junto al agua.
- **Carpeta:** `frontend/public/images/places/llanos/estrella-de-agua/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-vista.jpg` | Vista icónica / postcard de Estrella de Agua (Villavicencio). |
| `02-detalle.jpg` | Detalle arquitectónico, natural o cultural de Estrella de Agua. |
| `03-contexto.jpg` | Visitantes o contexto del lugar. Balneario natural con pozos de agua cristalina al pie de la cordillera. Familias locales y ambiente campestre. Comida tí |

#### 7. Parque Las Malocas

- **Tipo:** Atractivo · **Ciudad:** Villavicencio (Meta)
- **Tags:** cultura, familia, joropo, indigena
- **Descripción (para buscar fotos):** Parque temático de la cultura llanera con réplicas de malocas indígenas, muestra de fauna y espectáculos de joropo. Ideal para familias antes del safari.
- **Carpeta:** `frontend/public/images/places/llanos/parque-las-malocas/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-vista.jpg` | Vista icónica / postcard de Parque Las Malocas (Villavicencio). |
| `02-detalle.jpg` | Detalle arquitectónico, natural o cultural de Parque Las Malocas. |
| `03-contexto.jpg` | Visitantes o contexto del lugar. Parque temático de la cultura llanera con réplicas de malocas indígenas, muestra de fauna y espectáculos de joropo. Idea |

#### 8. Aviturismo Llanos Orientales

- **Tipo:** Actividad · **Ciudad:** Tauramena (Casanare)
- **Tags:** aves, ornitologia, sabana, naturaleza
- **Descripción (para buscar fotos):** Observación de más de 300 especies de aves en sabanas y humedales. Guía ornitólogo certificado, telescopios y checklist incluido. Mejor temporada diciembre–marzo.
- **Carpeta:** `frontend/public/images/places/llanos/aviturismo-llanos-orientales/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-accion.jpg` | Personas haciendo la actividad de Aviturismo Llanos Orientales en Tauramena. |
| `02-escenario.jpg` | Paisaje o escenario principal donde ocurre: aves, ornitologia, sabana, naturaleza. |
| `03-experiencia.jpg` | Momento memorable de la experiencia. Observación de más de 300 especies de aves en sabanas y humedales. Guía ornitólogo certificado, telescopios y checklist  |

#### 9. Lodge Corocora Camp

- **Tipo:** Hotel · **Ciudad:** Hato Corocora (Casanare)
- **Tags:** glamping, lujo, safari, exclusivo
- **Descripción (para buscar fotos):** Campamento de lujo en plena sabana con tiendas safari premium. Chef privado, safari diario y jacuzzi con vista a los llanos. Máximo 12 huéspedes.
- **Carpeta:** `frontend/public/images/places/llanos/lodge-corocora-camp/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-fachada.jpg` | Fachada o entrada del hotel Lodge Corocora Camp en Hato Corocora. Exterior reconocible. |
| `02-ambiente.jpg` | Lobby, patio, piscina o habitación típica de Lodge Corocora Camp. Ambiente del hospedaje. |
| `03-detalle.jpg` | Detalle que refuerce: glamping, lujo, safari, exclusivo. Contexto: Campamento de lujo en plena sabana con tiendas safari premium. Chef privado, safari diario y jacuzzi con vista a los lla |

#### 10. Agencia Llanos Safari

- **Tipo:** Agencia · **Ciudad:** Villavicencio (Meta)
- **Tags:** agencia, safari, llanos, paquetes
- **Descripción (para buscar fotos):** Paquetes por los llanos: hatos, Caño Cristales, aviturismo y joropo. Transporte 4x4, guías locales y alojamiento en hatos tradicionales y lodges.
- **Carpeta:** `frontend/public/images/places/llanos/agencia-llanos-safari/`

| Archivo | Qué descargar |
|---------|---------------|
| `01-marca.jpg` | Oficina, stand o identidad visual de Agencia Llanos Safari en Villavicencio. |
| `02-experiencia.jpg` | Turistas en una experiencia típica que vende la agencia (agencia, safari, llanos, paquetes). |
| `03-destino.jpg` | Destino representativo vinculado a Agencia Llanos Safari. Paquetes por los llanos: hatos, Caño Cristales, aviturismo y joropo. Transporte 4x4, guías locales y alojamiento en hato |

---

## C) Resumen de cantidades

| Bloque | Archivos a descargar |
|--------|----------------------|
| A) Home + UI (sin los que ya existen) | ~29 |
| B) Lugares (3 × 84) | 252 |
| **TOTAL aprox.** | **~281** |

### Atajo si quieres ir por fases

1. **Fase 1 (rápida):** solo sección **A** (home se ve profesional ya).
2. **Fase 2:** 1 sola foto cover por lugar (`01-….jpg`) — suficiente para mapa y listados.
3. **Fase 3:** completar `02` y `03` para galerías de ficha.

---

## D) Índice rápido: slug por lugar (copiar/pegar carpetas)

| Región | Slug carpeta | Nombre |
|--------|--------------|--------|
| caribe | `hotel-boutique-casa-san-agustin` | Hotel Boutique Casa San Agustín |
| caribe | `restaurante-la-cevicheria` | Restaurante La Cevichería |
| caribe | `tour-islas-del-rosario` | Tour Islas del Rosario |
| caribe | `castillo-de-san-felipe-de-barajas` | Castillo de San Felipe de Barajas |
| caribe | `hotel-irotama-resort` | Hotel Irotama Resort |
| caribe | `parque-nacional-natural-tayrona` | Parque Nacional Natural Tayrona |
| caribe | `ciudad-perdida-trek` | Ciudad Perdida Trek |
| caribe | `restaurante-donde-wippy` | Restaurante Donde Wippy |
| caribe | `decameron-san-luis` | Decameron San Luis |
| caribe | `johnny-cay-tour` | Johnny Cay Tour |
| caribe | `hotel-las-americas-resort` | Hotel Las Américas Resort |
| caribe | `carnaval-de-barranquilla-experience` | Carnaval de Barranquilla Experience |
| caribe | `restaurante-el-cactus` | Restaurante El Cactus |
| caribe | `playa-blanca-baru` | Playa Blanca Barú |
| caribe | `agencia-caribe-tours` | Agencia Caribe Tours |
| caribe | `hotel-zuana` | Hotel Zuana |
| caribe | `minca-eco-lodge` | Minca Eco Lodge |
| caribe | `tour-manglar-la-boquilla` | Tour Manglar La Boquilla |
| caribe | `restaurante-mistura` | Restaurante Mistura |
| caribe | `providencia-island-dive-center` | Providencia Island Dive Center |
| caribe | `hostal-casa-en-el-aire` | Hostal Casa en el Aire |
| caribe | `kitesurf-cartagena` | Kitesurf Cartagena |
| caribe | `restaurante-carmen` | Restaurante Carmen |
| caribe | `aviatur-caribe` | Aviatur Caribe |
| caribe | `volcan-de-lodo-el-totumo` | Volcán de Lodo El Totumo |
| andina | `hotel-casa-medina` | Hotel Casa Medina |
| andina | `cerro-de-monserrate` | Cerro de Monserrate |
| andina | `museo-del-oro` | Museo del Oro |
| andina | `andres-carne-de-res` | Andrés Carne de Res |
| andina | `hotel-the-charlee` | Hotel The Charlee |
| andina | `tour-comuna-13` | Tour Comuna 13 |
| andina | `parque-arvi` | Parque Arví |
| andina | `restaurante-oci-mde` | Restaurante Oci.Mde |
| andina | `plaza-mayor-de-villa-de-leyva` | Plaza Mayor de Villa de Leyva |
| andina | `hotel-plazuela-de-san-agustin` | Hotel Plazuela de San Agustín |
| andina | `caminata-real-barichara-guane` | Caminata Real Barichara–Guane |
| andina | `hotel-serrania-de-barichara` | Hotel Serranía de Barichara |
| andina | `parque-nacional-del-chicamocha` | Parque Nacional del Chicamocha |
| andina | `laguna-de-guatavita` | Laguna de Guatavita |
| andina | `agencia-colombia-raiz` | Agencia Colombia Raíz |
| eje_cafetero | `valle-del-cocora` | Valle del Cocora |
| eje_cafetero | `hacienda-san-alberto` | Hacienda San Alberto |
| eje_cafetero | `mirador-de-filandia` | Mirador de Filandia |
| eje_cafetero | `tour-finca-cafetera-el-ocaso` | Tour Finca Cafetera El Ocaso |
| eje_cafetero | `hotel-bioxury` | Hotel Bioxury |
| eje_cafetero | `termales-de-santa-rosa` | Termales de Santa Rosa |
| eje_cafetero | `restaurante-brasa-parrilla-bar` | Restaurante Brasa Parrilla Bar |
| eje_cafetero | `parque-nacional-del-cafe` | Parque Nacional del Café |
| eje_cafetero | `hotel-mocawa` | Hotel Mocawa |
| eje_cafetero | `trekking-los-nevados` | Trekking Los Nevados |
| eje_cafetero | `salento-pueblo-patrimonio` | Salento Pueblo Patrimonio |
| eje_cafetero | `agencia-viajes-del-eje` | Agencia Viajes del Eje |
| pacifico | `hotel-punta-faro` | Hotel Punta Faro |
| pacifico | `avistamiento-de-ballenas-nuqui` | Avistamiento de Ballenas Nuquí |
| pacifico | `termales-y-cascada-san-cipriano` | Termales y Cascada San Cipriano |
| pacifico | `restaurante-el-darien` | Restaurante El Darién |
| pacifico | `hotel-intercontinental-cali` | Hotel Intercontinental Cali |
| pacifico | `tour-parque-nacional-isla-gorgona` | Tour Parque Nacional Isla Gorgona |
| pacifico | `cascada-el-charco` | Cascada El Charco |
| pacifico | `lodge-el-almejal` | Lodge El Almejal |
| pacifico | `kayak-manglares-tumaco` | Kayak Manglares Tumaco |
| pacifico | `playa-guachalito` | Playa Guachalito |
| pacifico | `agencia-pacifico-adventures` | Agencia Pacífico Adventures |
| pacifico | `restaurante-mar-del-sur` | Restaurante Mar del Sur |
| amazonia | `hotel-decameron-amazonia` | Hotel Decameron Amazonia |
| amazonia | `tour-rio-amazonas` | Tour Río Amazonas |
| amazonia | `reserva-natural-tanimboca` | Reserva Natural Tanimboca |
| amazonia | `lodge-puerto-narino` | Lodge Puerto Nariño |
| amazonia | `avistamiento-delfines-rosados` | Avistamiento Delfines Rosados |
| amazonia | `experiencia-comunidad-tikuna` | Experiencia Comunidad Tikuna |
| amazonia | `museo-etnografico-amazonas` | Museo Etnográfico Amazonas |
| amazonia | `expedicion-selva-mata-mata` | Expedición Selva Mata-Matá |
| amazonia | `restaurante-tierras-amazonicas` | Restaurante Tierras Amazónicas |
| amazonia | `agencia-amazon-jungle-tours` | Agencia Amazon Jungle Tours |
| llanos | `hato-la-aurora` | Hato La Aurora |
| llanos | `safari-llanero-yopal` | Safari Llanero Yopal |
| llanos | `restaurante-la-casona-llanera` | Restaurante La Casona Llanera |
| llanos | `hotel-ghl-comfort-villavicencio` | Hotel GHL Comfort Villavicencio |
| llanos | `tour-cano-cristales` | Tour Caño Cristales |
| llanos | `estrella-de-agua` | Estrella de Agua |
| llanos | `parque-las-malocas` | Parque Las Malocas |
| llanos | `aviturismo-llanos-orientales` | Aviturismo Llanos Orientales |
| llanos | `lodge-corocora-camp` | Lodge Corocora Camp |
| llanos | `agencia-llanos-safari` | Agencia Llanos Safari |
