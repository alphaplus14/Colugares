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

export const metadata: Metadata = {
  title: "Colugares — Portal Turístico de Colombia",
  description:
    "Planifica tu aventura por Colombia con inteligencia artificial",
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
