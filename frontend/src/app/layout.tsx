import type { Metadata } from "next";
import { Dela_Gothic_One, DM_Sans } from "next/font/google";
import { SessionProvider } from "@/components/providers/SessionProvider";
import "./globals.css";

const display = Dela_Gothic_One({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

const siteUrl =
  process.env.NEXTAUTH_URL ?? process.env.AUTH_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Colugares — Portal Turístico de Colombia",
    template: "%s | Colugares",
  },
  description:
    "Planifica tu aventura por Colombia con inteligencia artificial. Destinos curados, itinerarios personalizados y cero alucinaciones.",
  icons: {
    icon: [{ url: "/brand/icon.png", type: "image/png" }],
    apple: [{ url: "/brand/icon.png", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "es_CO",
    siteName: "Colugares",
    title: "Colugares — Portal Turístico de Colombia",
    description:
      "AI Trip Planner con destinos verificados. Explora regiones, festividades e itinerarios a tu medida.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Colugares — Portal Turístico de Colombia",
    description:
      "Planifica tu viaje por Colombia con Colu, tu guía inteligente.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${display.variable} ${body.variable} font-body antialiased`}>
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
