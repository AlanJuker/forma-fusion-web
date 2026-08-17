"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

import type { Category } from "@/domain/entities/content";

const NAV_LINKS = [
  { label: "Proyectos", href: "/proyectos", hasMenu: true },
  { label: "Servicios", href: "/servicios", hasMenu: false },
  { label: "Estudio", href: "/estudio", hasMenu: false },
  { label: "Noticias", href: "/noticias", hasMenu: false },
  { label: "Contacto", href: "/contacto", hasMenu: false },
];

interface SiteHeaderProps {
  categories: Category[];
}

export function SiteHeader({ categories }: SiteHeaderProps) {
  const pathname = usePathname();
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // La cabecera gana una línea inferior en cuanto el contenido pasa por debajo.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Cualquier navegación cierra los paneles abiertos.
  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  // Con un panel a pantalla completa abierto, el fondo no debe desplazarse.
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMegaOpen(false);
        setMobileOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 bg-paper transition-[border-color] duration-300 ${
          scrolled || megaOpen ? "border-b border-grey-200" : "border-b border-transparent"
        }`}
        onMouseLeave={() => setMegaOpen(false)}
      >
        <div
          className="gutter-x flex items-center justify-between"
          style={{ height: "var(--header-height)" }}
        >
          <Link href="/" className="group flex items-baseline gap-2.5">
            <span className="text-[15px] font-medium tracking-[-0.02em] uppercase leading-none">
              Forma&nbsp;&amp;&nbsp;Fusión
            </span>
            <span className="ui-label hidden text-grey-500 sm:block">
              Diseño y Construcción
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {NAV_LINKS.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <div
                  key={link.href}
                  onMouseEnter={() => setMegaOpen(Boolean(link.hasMenu))}
                >
                  <Link
                    href={link.href}
                    className={`ui-label link-underline transition-colors duration-300 ${
                      active ? "text-ink" : "text-grey-600 hover:text-ink"
                    }`}
                  >
                    {link.label}
                  </Link>
                </div>
              );
            })}
          </nav>

          <button
            type="button"
            aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="ui-label flex items-center gap-2 md:hidden"
          >
            {mobileOpen ? "Cerrar" : "Menú"}
            <span className="relative block h-3 w-4">
              <span
                className={`absolute left-0 block h-px w-4 bg-ink transition-all duration-300 ${
                  mobileOpen ? "top-1.5 rotate-45" : "top-0.5"
                }`}
              />
              <span
                className={`absolute left-0 block h-px w-4 bg-ink transition-all duration-300 ${
                  mobileOpen ? "top-1.5 -rotate-45" : "top-2.5"
                }`}
              />
            </span>
          </button>
        </div>

        {/* Mega-menú de escritorio: categorías reales de la base de datos. */}
        <AnimatePresence>
          {megaOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              className="hidden overflow-hidden border-t border-grey-200 bg-paper md:block"
            >
              <div className="gutter-x grid grid-cols-4 gap-8 py-10">
                <div>
                  <p className="ui-label text-grey-400">Categorías</p>
                  <Link
                    href="/proyectos"
                    className="display-sm link-underline mt-4 inline-block"
                  >
                    Ver todo
                  </Link>
                </div>
                <div className="col-span-3 grid grid-cols-3 gap-x-8 gap-y-3">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + index * 0.03, duration: 0.4 }}
                    >
                      <Link
                        href={`/proyectos?categoria=${category.slug}`}
                        className="group flex items-baseline justify-between border-b border-grey-200 py-2 transition-colors hover:border-ink"
                      >
                        <span className="text-[18px] tracking-[-0.02em]">
                          {category.name}
                        </span>
                        <span className="ui-label text-grey-400">
                          {String(category.projectCount ?? 0).padStart(2, "0")}
                        </span>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Menú móvil a pantalla completa */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 bg-paper md:hidden"
            style={{ paddingTop: "var(--header-height)" }}
          >
            <nav className="gutter-x flex flex-col pt-8">
              {NAV_LINKS.map((link, index) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.06 * index, duration: 0.5 }}
                >
                  <Link
                    href={link.href}
                    className="display-sm block border-b border-grey-200 py-4"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
            <div className="gutter-x mt-10">
              <p className="ui-label text-grey-400">Categorías</p>
              <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
                {categories.map((category) => (
                  <Link
                    key={category.id}
                    href={`/proyectos?categoria=${category.slug}`}
                    className="ui-label border border-grey-300 px-3 py-2"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
