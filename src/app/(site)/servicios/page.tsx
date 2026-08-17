import type { Metadata } from "next";
import Link from "next/link";

import { Reveal, RevealLines } from "@/presentation/components/ui/reveal";

export const metadata: Metadata = {
  title: "Servicios",
  description:
    "Arquitectura, interiorismo, construcción y remodelación. Un solo equipo del anteproyecto a la entrega.",
};

const SERVICES = [
  {
    number: "01",
    title: "Arquitectura",
    summary:
      "Del levantamiento del terreno al proyecto ejecutivo aprobado, con el presupuesto presente en cada decisión.",
    items: [
      "Levantamiento y análisis del sitio",
      "Anteproyecto y volumetría",
      "Proyecto ejecutivo y planos constructivos",
      "Trámites y permisos municipales",
      "Renders y recorridos virtuales",
    ],
  },
  {
    number: "02",
    title: "Interiorismo",
    summary:
      "Diseño interior con especificación real de materiales: lo que se dibuja es lo que se puede comprar y montar.",
    items: [
      "Distribución y zonificación",
      "Mobiliario a medida",
      "Diseño de iluminación",
      "Selección de acabados y paleta",
      "Ambientación y styling final",
    ],
  },
  {
    number: "03",
    title: "Construcción",
    summary:
      "Ejecución de obra con cronograma, control de costos semanal y un responsable único frente al cliente.",
    items: [
      "Presupuesto y cronograma detallado",
      "Dirección técnica de obra",
      "Gestión de gremios y proveedores",
      "Control de calidad y avances",
      "Entrega con garantía escrita",
    ],
  },
  {
    number: "04",
    title: "Remodelación",
    summary:
      "Intervención de espacios existentes, con la vivienda o el local habitado siempre que el alcance lo permita.",
    items: [
      "Diagnóstico estructural",
      "Ampliaciones y reforzamiento",
      "Actualización de instalaciones",
      "Rediseño de fachadas",
      "Adecuación de locales comerciales",
    ],
  },
];

const PROCESS = [
  {
    step: "01",
    title: "Conversación inicial",
    body: "Entendemos el uso, el terreno y el presupuesto real. Sin costo y sin compromiso.",
  },
  {
    step: "02",
    title: "Propuesta y alcance",
    body: "Entregamos alcance, plazos y honorarios por escrito antes de dibujar la primera línea.",
  },
  {
    step: "03",
    title: "Diseño",
    body: "Anteproyecto, revisiones acordadas y proyecto ejecutivo listo para construir.",
  },
  {
    step: "04",
    title: "Obra",
    body: "Construcción con informes de avance y control de costos semanal.",
  },
  {
    step: "05",
    title: "Entrega",
    body: "Recepción del espacio, manual de mantenimiento y garantía por escrito.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <header className="gutter-x pt-32 pb-16 md:pt-40 md:pb-24">
        <Reveal>
          <p className="ui-label text-grey-400">Servicios</p>
        </Reveal>
        <RevealLines
          className="display mt-4 block"
          lines={["Diseñamos y", "construimos."]}
        />
        <Reveal delay={0.3}>
          <p className="mt-8 max-w-xl text-[18px] text-grey-600">
            Trabajamos las cuatro etapas con el mismo equipo. Eso significa un solo
            responsable, un solo presupuesto y ninguna transferencia de culpas entre
            quien diseña y quien construye.
          </p>
        </Reveal>
      </header>

      <section className="rule-t">
        {SERVICES.map((service) => (
          <div key={service.number} className="gutter-x rule-b py-12 md:py-16">
            <Reveal>
              <div className="grid gap-8 md:grid-cols-12">
                <div className="md:col-span-1">
                  <span className="ui-label text-grey-400">{service.number}</span>
                </div>
                <div className="md:col-span-5">
                  <h2 className="display-sm">{service.title}</h2>
                  <p className="text-meta mt-4 max-w-sm text-grey-600">
                    {service.summary}
                  </p>
                </div>
                <div className="md:col-span-5 md:col-start-8">
                  <ul>
                    {service.items.map((item) => (
                      <li
                        key={item}
                        className="flex justify-between gap-4 border-b border-grey-200 py-3 text-[15px]"
                      >
                        {item}
                        <span aria-hidden className="text-grey-300">
                          &#8594;
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          </div>
        ))}
      </section>

      <section className="gutter-x py-20 md:py-28">
        <Reveal>
          <p className="ui-label text-grey-400">Cómo trabajamos</p>
        </Reveal>
        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {PROCESS.map((phase, index) => (
            <Reveal key={phase.step} delay={index * 0.07}>
              <div className="rule-t pt-4">
                <span className="ui-label text-grey-400">{phase.step}</span>
                <h3 className="mt-5 text-[18px] tracking-[-0.02em]">{phase.title}</h3>
                <p className="text-meta mt-2 text-grey-600">{phase.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="rule-t bg-ink py-24 text-paper">
        <div className="gutter-x">
          <RevealLines className="display block" lines={["Empecemos por", "una conversación."]} />
          <Reveal delay={0.3}>
            <Link href="/contacto" className="ui-label link-underline mt-10 inline-block">
              Agendar una llamada &#8594;
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
