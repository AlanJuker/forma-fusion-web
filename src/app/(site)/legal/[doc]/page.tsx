import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Reveal } from "@/presentation/components/ui/reveal";

const DOCS = {
  privacidad: {
    title: "Política de privacidad",
    updated: "Actualizado en agosto de 2026",
    sections: [
      {
        heading: "Datos que recogemos",
        body: "A través del formulario de contacto recogemos el nombre, correo electrónico, teléfono y el mensaje que decidas enviarnos. No usamos cookies de seguimiento publicitario ni perfilamos a los visitantes del sitio.",
      },
      {
        heading: "Para qué los usamos",
        body: "Únicamente para responder tu consulta y dar seguimiento comercial al proyecto que nos plantees. No vendemos ni cedemos estos datos a terceros.",
      },
      {
        heading: "Cuánto tiempo los conservamos",
        body: "Conservamos los mensajes mientras exista una relación comercial activa o potencial. Puedes solicitar su eliminación en cualquier momento escribiendo a nuestro correo de contacto.",
      },
      {
        heading: "Tus derechos",
        body: "Puedes solicitar acceso, rectificación o eliminación de tus datos personales, conforme a la Ley Orgánica de Protección de Datos Personales del Ecuador.",
      },
    ],
  },
  terminos: {
    title: "Términos de servicio",
    updated: "Actualizado en agosto de 2026",
    sections: [
      {
        heading: "Alcance del sitio",
        body: "Este sitio tiene carácter informativo. Las imágenes, superficies y descripciones de los proyectos son referenciales y no constituyen una oferta contractual.",
      },
      {
        heading: "Propiedad intelectual",
        body: "Los proyectos, fotografías, planos y textos publicados son propiedad de Forma & Fusión o de sus respectivos autores. Su reproducción requiere autorización previa por escrito.",
      },
      {
        heading: "Contratación",
        body: "Todo encargo de diseño u obra se rige por un contrato específico firmado entre las partes, que prevalece sobre cualquier contenido de este sitio.",
      },
    ],
  },
} as const;

type DocKey = keyof typeof DOCS;

export function generateStaticParams() {
  return Object.keys(DOCS).map((doc) => ({ doc }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ doc: string }>;
}): Promise<Metadata> {
  const { doc } = await params;
  const entry = DOCS[doc as DocKey];
  return { title: entry?.title ?? "Documento legal" };
}

export default async function LegalPage({
  params,
}: {
  params: Promise<{ doc: string }>;
}) {
  const { doc } = await params;
  const entry = DOCS[doc as DocKey];
  if (!entry) notFound();

  return (
    <article className="gutter-x pt-32 pb-24 md:pt-40">
      <div className="mx-auto max-w-2xl">
        <Reveal>
          <p className="ui-label text-grey-400">{entry.updated}</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="display-sm mt-4">{entry.title}</h1>
        </Reveal>
        <div className="mt-12">
          {entry.sections.map((section, index) => (
            <Reveal key={section.heading} delay={index * 0.06}>
              <section className="rule-t py-6">
                <h2 className="text-[18px] tracking-[-0.02em]">{section.heading}</h2>
                <p className="mt-3 text-[15px] text-grey-600">{section.body}</p>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </article>
  );
}
