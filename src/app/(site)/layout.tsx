import { SiteFooter } from "@/presentation/components/layout/site-footer";
import { SiteHeader } from "@/presentation/components/layout/site-header";
import { IntroOverlay } from "@/presentation/components/ui/intro-overlay";
import { MotionProvider } from "@/presentation/components/ui/motion-provider";
import { PageTransition } from "@/presentation/components/ui/page-transition";
import { SmoothScroll } from "@/presentation/components/ui/smooth-scroll";
import { repositories } from "@/infrastructure/config/container";

export const dynamic = "force-dynamic";

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // El menú y el pie son iguales en todo el sitio, así que se resuelven una
  // sola vez aquí en lugar de en cada página.
  const [categories, offices, settings] = await Promise.all([
    repositories.categories.findTree(),
    repositories.offices.findMany(),
    repositories.settings.getAll(),
  ]);

  return (
    <>
      {/* Telón presente ya en el HTML servido: cubre desde el primer pintado
          hasta que la intro monta y toma el relevo. Vive aquí, y no en el
          layout raíz, para no alcanzar nunca a /admin. */}
      <div className="intro-shield" aria-hidden />
      <MotionProvider>
        <SmoothScroll />
        <IntroOverlay />
        <SiteHeader categories={categories} />
        <main className="min-h-screen">
          <PageTransition>{children}</PageTransition>
        </main>
        <SiteFooter offices={offices} settings={settings} />
      </MotionProvider>
    </>
  );
}
