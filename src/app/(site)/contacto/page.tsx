import type { Metadata } from "next";

import { repositories } from "@/infrastructure/config/container";
import { ContactForm } from "@/presentation/components/ui/contact-form";
import { Reveal, RevealLines } from "@/presentation/components/ui/reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contacto",
  description: "Conversemos sobre tu proyecto.",
};

export default async function ContactPage() {
  const settings = await repositories.settings.getAll();

  const whatsapp = settings.whatsapp ?? "https://wa.me/message/3I4U25IBEAMUO1";
  const instagram = settings.instagram ?? "https://www.instagram.com/formafusion.ec/";
  const email = settings.contactEmail;
  const address = settings.address ?? "Riobamba, Ecuador";

  return (
    <>
      <header className="gutter-x pt-32 pb-14 md:pt-40 md:pb-20">
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <Reveal>
              <p className="ui-label text-grey-400">Contacto</p>
            </Reveal>
            <RevealLines className="display-sm mt-4 block" lines={["Conversemos."]} />
          </div>
        </div>
      </header>

      <section className="gutter-x rule-t py-14 md:py-20">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6 md:col-start-3">
            <ContactForm />
          </div>

          <aside className="md:col-span-3 md:col-start-10">
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
                  Instagram
                </a>
              </li>
              {email && (
                <li className="border-b border-grey-200 py-3">
                  <a href={`mailto:${email}`} className="link-underline text-[15px]">
                    {email}
                  </a>
                </li>
              )}
            </ul>

            <p className="ui-label mt-10 text-grey-400">Dónde estamos</p>
            <p className="text-meta mt-3 text-grey-600">{address}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
