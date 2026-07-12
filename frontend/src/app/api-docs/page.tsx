"use client";

import Script from "next/script";
import { useEffect } from "react";

/**
 * Documentación interactiva de la API (Swagger UI), cargada desde CDN
 * para evitar conflictos de versión de React con swagger-ui-react.
 * El spec se sirve dinámicamente desde /api/docs.
 */
export default function ApiDocsPage() {
  useEffect(() => {
    document.title = "CoLugares — API Docs";
  }, []);

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui.min.css"
      />
      <div id="swagger-ui" style={{ background: "#fff" }} />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/5.17.14/swagger-ui-bundle.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          // @ts-expect-error - SwaggerUIBundle se inyecta globalmente por el script de CDN
          window.SwaggerUIBundle({
            url: "/api/docs",
            dom_id: "#swagger-ui",
            presets: [
              // @ts-expect-error - SwaggerUIBundle.presets viene del bundle de CDN
              window.SwaggerUIBundle.presets.apis,
            ],
            layout: "BaseLayout",
          });
        }}
      />
    </>
  );
}
