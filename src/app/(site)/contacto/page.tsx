import type { Metadata } from "next";

import { repositories } from "@/infrastructure/config/container";
import { ContactForm } from "@/presentation/components/ui/contact-form";
import { Reveal, RevealLines } from "@/presentation/components/ui/reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Conversemos sobre tu proyecto de diseño o construcción. Respondemos en 48 horas hábiles.",
};

export default async function ContactPage() {
  const [offices, settings] = await Promise.all([
    repositories.offices.findMany(),
    repositories.settings.getAll(),
  ]);

  const whatsapp = settings.whatsapp ?? "https://wa.me/message/3I4U25IBEAMUO1";
  const instagram = settings.instagram ?? "https://www.instagram.com/formafusion.ec/";

  return (
    <>
      <header className="gutter-x pt-32 pb-16 md:pt-40 md:pb-20">
        <Reveal>
          <p className="ui-label text-grey-400">Contacto</p>
        </Reveal>
        <RevealLines className="display mt-4 block" lines={["Conversemos."]} />
        <Reveal delay={0.25}>
          <p className="mt-8 max-w-lg text-[18px] text-grey-600">
            Cuéntanos qué quieres construir. Respondemos dentro de 48 horas
            hábiles con los siguientes pasos y una estimación de alcance.
          </p>
        </Reveal>
      </header>

      <section className="gutter-x rule-t py-16">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <ContactForm />
          </div>

          <aside className="md:col-span-4 md:col-start-9">
            <p className="ui-label text-grey-400">Directo</p>
            <ul className="mt-4">
              <li className="border-b border-grey-200 py-3">
                <a
                  href={whatsapp}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-underline text-[15px]"
                >
                  WhatsApp
                </a>
              </li>
              <li className="border-b border-grey-200 py-3">
                <a
                  href={instagram}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="link-underline text-[15px]"
                >
                  Instagram @formafusion.ec
                </a>
              </li>
            </ul>

            {offices.length > 0 && (
              <>
                <p className="ui-label mt-10 text-grey-400">Oficinas</p>
                <div className="mt-4 space-y-6">
                  {offices.map((office) => (
                    <address key={office.id} className="not-italic">
                      <p className="text-[15px]">{office.city}</p>
                      <p className="text-meta text-grey-600">{office.address}</p>
                      <p className="text-meta text-grey-600">{office.country}</p>
                      {office.phone && (
                        <p className="text-meta text-grey-600">{office.phone}</p>
                      )}
                      {office.email && (
                        <a
                          href={`mailto:${office.email}`}
                          className="text-meta link-underline text-grey-600"
                        >
                          {office.email}
                        </a>
                      )}
                    </address>
                  ))}
                </div>
              </>
            )}
          </aside>
        </div>
      </section>
    </>
  );
}
