import { SiteFooter } from "@/presentation/components/layout/site-footer";
import { SiteHeader } from "@/presentation/components/layout/site-header";
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
      <SmoothScroll />
      <SiteHeader categories={categories} />
      <main className="min-h-screen">{children}</main>
      <SiteFooter offices={offices} settings={settings} />
    </>
  );
}
