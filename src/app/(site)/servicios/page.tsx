import type { Metadata } from "next";
import Link from "next/link";

import { Reveal, RevealLines } from "@/presentation/components/ui/reveal";

export const metadata: Metadata = {
  title: "Qué hacemos",
  description:
    "Desarrollo inmobiliario, diseño y construcción. Integramos las tres disciplinas bajo un mismo equipo.",
};

const AREAS = [
  {
    numero: "01",
    titulo: "Desarrollo inmobiliario",
    items: [
      "Desarrollo de proyectos residenciales",
      "Desarrollo de proyectos comerciales",
      "Evaluación y estructuración de oportunidades",
      "Proyectos de inversión",
      "Comercialización de proyectos propios",
    ],
  },
  {
    numero: "02",
    titulo: "Diseño",
    items: [
      "Diseño arquitectónico",
      "Diseño interior",
      "Ingeniería",
      "Remodelación",
      "Restauración",
      "Regularización y permisos",
    ],
  },
  {
    numero: "03",
    titulo: "Construcción",
    items: [
      "Construcción de obra nueva",
      "Remodelación",
      "Ejecución de proyectos",
      "Administración y supervisión de obra",
      "Control de costos y planificación",
    ],
  },
];

export default function ServicesPage() {
  return (
    <>
      <header className="gutter-x pt-32 pb-14 md:pt-40 md:pb-20">
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <Reveal>
              <p className="ui-label text-grey-400">Qué hacemos</p>
            </Reveal>
            <RevealLines
              className="display-sm mt-4 block text-balance"
              lines={["Desarrollo inmobiliario,", "diseño y construcción."]}
            />
          </div>
        </div>
      </header>

      <section className="rule-t">
        {AREAS.map((area) => (
          <div key={area.numero} className="gutter-x rule-b py-12 md:py-16">
            <div className="grid gap-6 md:grid-cols-12">
              <div className="md:col-span-2 md:col-start-3">
                <Reveal>
                  <span className="ui-label text-grey-400">{area.numero}</span>
                  <h2 className="mt-4 text-[22px] tracking-[-0.02em]">
                    {area.titulo}
                  </h2>
                </Reveal>
              </div>
              <div className="md:col-span-6 md:col-start-6">
                <ul>
                  {area.items.map((item, index) => (
                    <Reveal key={item} delay={index * 0.04}>
                      <li className="border-b border-grey-200 py-3 text-[15px]">
                        {item}
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Propuesta de valor, tal y como la formula el documento del estudio */}
      <section className="bg-ink py-24 text-paper md:py-32">
        <div className="gutter-x">
          <div className="grid grid-cols-12">
            <div className="col-span-12 md:col-span-8 md:col-start-3">
              <Reveal>
                <p className="ui-label text-paper/50">Propuesta de valor</p>
              </Reveal>
              <RevealLines
                className="display-sm mt-5 block text-balance"
                lines={[
                  "Hacemos que desarrollar",
                  "un proyecto sea más claro,",
                  "más ordenado y más llevadero.",
                ]}
              />
              <Reveal delay={0.3}>
                <Link
                  href="/contacto"
                  className="ui-label link-underline mt-10 inline-block"
                >
                  Conversemos &#8594;
                </Link>
              </Reveal>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
