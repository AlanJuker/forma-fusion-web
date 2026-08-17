import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";

import "./globals.css";

// Space Grotesk: grotesca de terminaciones rectas y detalles marcados, en la
// línea de la tipografía del sitio de referencia y muy afín al logotipo
// modular. Se usa en todo el sitio, sin segunda familia.
const grotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-grotesk",
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
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
    description: "Arquitectura, interiorismo y construcción en Ecuador.",
  },
  robots: { index: true, follow: true },
};

/**
 * Se ejecuta antes del primer pintado: si la intro ya se vio en esta sesión,
 * marca el documento para que el telón negro no llegue a aparecer. Sin esto se
 * vería un parpadeo negro en cada navegación.
 */
const INTRO_BOOTSTRAP = `
try {
  if (sessionStorage.getItem('ff:intro-played') === '1') {
    document.documentElement.dataset.intro = 'done';
  }
} catch (e) {
  document.documentElement.dataset.intro = 'done';
}`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={grotesk.variable}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_BOOTSTRAP }} />
        {/* Sin JavaScript no hay intro que reproducir: se retira el telón. */}
        <noscript>
          <style>{`.intro-shield{display:none!important}`}</style>
        </noscript>
      </head>
      {/* El telón de la intro NO va aquí: este layout también envuelve /admin,
          y allí no hay intro que lo retire, así que dejaría el panel tapado en
          negro. Lo monta el layout del sitio público. */}
      <body>{children}</body>
    </html>
  );
}
