import type { StyleSpecification } from "maplibre-gl";

/** Tiles Carto Voyager — sin API key, permitidos para apps web */
export const CARTO_RASTER_STYLE: StyleSpecification = {
  version: 8,
  sources: {
    "carto-tiles": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
        "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      attribution: "© CARTO © OpenStreetMap contributors",
    },
  },
  layers: [
    {
      id: "carto-tiles-layer",
      type: "raster",
      source: "carto-tiles",
      minzoom: 0,
      maxzoom: 20,
    },
  ],
};

/** Centro por defecto: Cartagena (región del seed) */
export const DEFAULT_MAP_CENTER = {
  lng: -75.55,
  lat: 10.4,
  zoom: 8,
};

export function getMapStyle(): StyleSpecification | string {
  const custom = process.env.NEXT_PUBLIC_MAP_STYLE_URL?.trim();
  if (custom) {
    return custom;
  }
  return CARTO_RASTER_STYLE;
}
