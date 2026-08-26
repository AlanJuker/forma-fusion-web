import Link from "next/link";

import { LogoFF } from "@/presentation/components/ui/logo";

interface SiteFooterProps {
  settings: Record<string, string>;
}

/**
 * Pie de página. Sobrio y de una sola altura: la marca, las vías de contacto y
 * la nota de derechos. Sin bloques plegables ni listados de oficinas, que el
 * estudio no tiene.
 */
export function SiteFooter({ settings }: SiteFooterProps) {
  const instagram = settings.instagram ?? "https://www.instagram.com/formafusion.ec/";
  const whatsapp = settings.whatsapp ?? "https://wa.me/message/3I4U25IBEAMUO1";
  const email = settings.contactEmail;
  const address = settings.address ?? "Riobamba, Ecuador";

  return (
    <footer className="rule-t bg-paper">
      <div className="gutter-x py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4 md:col-start-3">
            <span className="block text-ink" style={{ fontSize: "26px" }}>
              <LogoFF />
            </span>
            <p className="text-meta mt-5 max-w-xs text-grey-600">
              Desarrollo inmobiliario, diseño y construcción.
            </p>
            <p className="text-meta mt-1 text-grey-500">{address}</p>
          </div>

          <div className="md:col-span-3 md:col-start-8">
            <p className="ui-label text-grey-400">Contacto</p>
            <ul className="mt-4 space-y-2">
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
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-meta link-underline"
                >
                  Instagram
                </a>
              </li>
              {email && (
                <li>
                  <a href={`mailto:${email}`} className="text-meta link-underline">
                    {email}
                  </a>
                </li>
              )}
              <li>
                <Link href="/contacto" className="text-meta link-underline">
                  Formulario
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="rule-t mt-14 pt-6">
          <div className="grid grid-cols-12">
            <p className="ui-label col-span-12 text-grey-400 md:col-span-8 md:col-start-3">
              &copy; {new Date().getFullYear()} Forma &amp; Fusión — Riobamba, Ecuador
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
