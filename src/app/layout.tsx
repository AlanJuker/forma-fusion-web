import type { Metadata } from "next";
import { Geist } from "next/font/google";

import "./globals.css";

// Geist es una grotesca neutra de terminaciones rectas, la alternativa libre
// más cercana a la tipografía del sitio de referencia.
const grotesk = Geist({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
  weight: ["300", "400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Forma & Fusión — Estudio de Diseño y Construcción",
    template: "%s — Forma & Fusión",
  },
  description:
    "Estudio de diseño y construcción en Ecuador. Arquitectura, interiorismo y ejecución de obra, del anteproyecto a la entrega.",
  openGraph: {
    type: "website",
    locale: "es_EC",
    siteName: "Forma & Fusión",
    title: "Forma & Fusión — Estudio de Diseño y Construcción",
    description:
      "Arquitectura, interiorismo y construcción en Ecuador.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={grotesk.variable}>
      <body>{children}</body>
    </html>
  );
}
