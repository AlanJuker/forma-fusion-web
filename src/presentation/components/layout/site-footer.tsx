"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import type { Office } from "@/domain/entities/content";

interface SiteFooterProps {
  offices: Office[];
  settings: Record<string, string>;
}

/** Bloque plegable con el signo "+" que rota, como en el sitio de referencia. */
function Collapsible({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-t border-grey-200 py-4">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-left"
      >
        <span className="ui-label">{title}</span>
        <span
          className={`text-lg leading-none transition-transform duration-500 ${
            open ? "rotate-45" : ""
          }`}
          aria-hidden
        >
          +
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function SiteFooter({ offices, settings }: SiteFooterProps) {
  const instagram = settings.instagram ?? "https://www.instagram.com/formafusion.ec/";
  const whatsapp = settings.whatsapp ?? "https://wa.me/message/3I4U25IBEAMUO1";
  const email = settings.contactEmail ?? "hola@formafusion.ec";

  const scrollToTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="rule-t bg-paper">
      <div className="gutter-x py-16 md:py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="ui-label text-grey-400">Forma &amp; Fusión</p>
            <p className="display-sm mt-5 max-w-md text-balance">
              Diseñamos y construimos espacios que perduran.
            </p>
            <Link
              href="/contacto"
              className="ui-label link-underline mt-8 inline-block"
            >
              Iniciar un proyecto &#8594;
            </Link>
          </div>

          <div className="md:col-span-4 md:col-start-7">
            <p className="ui-label text-grey-400">Oficinas</p>
            <div className="mt-5 grid gap-6 sm:grid-cols-2 md:grid-cols-1">
              {offices.map((office) => (
                <address key={office.id} className="not-italic">
                  <p className="text-[15px]">{office.city}</p>
                  <p className="text-meta mt-1 text-grey-600">{office.address}</p>
                  <p className="text-meta text-grey-600">{office.country}</p>
                  {office.phone && (
                    <a
                      href={`tel:${office.phone.replace(/\s/g, "")}`}
                      className="text-meta link-underline mt-1 block text-grey-600"
                    >
                      {office.phone}
                    </a>
                  )}
                  {office.email && (
                    <a
                      href={`mailto:${office.email}`}
                      className="text-meta link-underline block text-grey-600"
                    >
                      {office.email}
                    </a>
                  )}
                </address>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 md:col-start-11">
            <Collapsible title="Social">
              <ul className="space-y-2">
                <li>
                  <a
                    href={instagram}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-meta link-underline"
                  >
                    Instagram
                  </a>
                </li>
                <li>
                  <a
                    href={whatsapp}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-meta link-underline"
                  >
                    WhatsApp
                  </a>
                </li>
                <li>
                  <a href={`mailto:${email}`} className="text-meta link-underline">
                    Correo
                  </a>
                </li>
              </ul>
            </Collapsible>
            <Collapsible title="Legal">
              <ul className="space-y-2">
                <li>
                  <Link href="/legal/privacidad" className="text-meta link-underline">
                    Política de privacidad
                  </Link>
                </li>
                <li>
                  <Link href="/legal/terminos" className="text-meta link-underline">
                    Términos de servicio
                  </Link>
                </li>
              </ul>
            </Collapsible>
          </div>
        </div>

        <div className="rule-t mt-16 flex flex-col gap-4 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="ui-label text-grey-400">
            &copy; {new Date().getFullYear()} Forma &amp; Fusión — Ecuador
          </p>
          <button type="button" onClick={scrollToTop} className="ui-label link-underline self-start">
            Volver arriba &#8593;
          </button>
        </div>
      </div>
    </footer>
  );
}
