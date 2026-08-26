import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Reveal, RevealLines } from "@/presentation/components/ui/reveal";

export const metadata: Metadata = {
  title: "Qué hacemos",
  description:
    "Desarrollo inmobiliario, diseño y construcción. Integramos las tres disciplinas bajo un mismo equipo.",
};

/**
 * Las tres áreas del documento del estudio, cada una apoyada en una fotografía
 * de obra propia. La página vive de ese material, no de recursos decorativos.
 *
 * Las tres son apaisadas y de la misma resolución, así el marco las trata por
 * igual: mezclar una vertical obligaba a recortarla y se perdía el edificio.
 */
const AREAS = [
  {
    numero: "01",
    titulo: "Desarrollo inmobiliario",
    pie: "Estructuramos el proyecto antes de que exista: qué construir, para quién y con qué retorno.",
    foto: "/proyectos/ff-02-02.jpg",
    alt: "Vista de conjunto de una residencia unifamiliar con jardín",
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
    pie: "Del anteproyecto a los planos aprobados, con los acabados decididos sobre material real.",
    foto: "/proyectos/ff-02-10.jpg",
    alt: "Cocina con isla y carpintería a medida en una residencia entregada",
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
    pie: "Ejecutamos con cronograma y control de costos, y respondemos por lo que se entrega.",
    foto: "/proyectos/ff-02-04.jpg",
    alt: "Acceso y garaje de una vivienda entregada",
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
      <header className="gutter-x pt-32 pb-14 md:pt-40 md:pb-16">
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

      {/* Propuesta de valor, sobre negro: corta la página en blanco y da peso
          a la única frase que el estudio eligió para resumirse. */}
      <section className="bg-ink py-16 text-paper md:py-24">
        <div className="gutter-x grid grid-cols-12">
          <div className="col-span-12 md:col-span-2 md:col-start-3">
            <Reveal>
              <p className="ui-label text-paper/45">Propuesta de valor</p>
            </Reveal>
          </div>
          <div className="col-span-12 mt-4 md:col-span-6 md:col-start-6 md:mt-0">
            <RevealLines
              className="block text-[22px] leading-[1.3] tracking-[-0.02em] md:text-[30px]"
              lines={[
                "Hacemos que desarrollar un proyecto",
                "sea más claro, más ordenado",
                "y más llevadero.",
              ]}
            />
          </div>
        </div>
      </section>

      {/* Las tres áreas. La fotografía cambia de lado en cada una para que la
          lectura no se vuelva una columna monótona. */}
      {AREAS.map((area, indice) => {
        const fotoALaIzquierda = indice % 2 === 1;
        return (
          <section key={area.numero} className="rule-t py-14 md:py-20">
            <div className="gutter-x grid grid-cols-12 items-start gap-x-4 gap-y-8">
              <div
                className={`col-span-12 md:col-span-5 ${
                  fotoALaIzquierda ? "md:col-start-8 md:row-start-1" : "md:col-start-2"
                }`}
              >
                <Reveal>
                  <div className="flex items-baseline gap-4">
                    <span className="display-sm leading-none text-grey-300">
                      {area.numero}
                    </span>
                    <h2 className="text-[26px] leading-tight tracking-[-0.025em] md:text-[34px]">
                      {area.titulo}
                    </h2>
                  </div>
                </Reveal>

                <Reveal delay={0.06}>
                  <p className="text-meta mt-4 max-w-sm text-grey-600">{area.pie}</p>
                </Reveal>

                <ul className="mt-8">
                  {area.items.map((item, i) => (
                    <Reveal key={item} delay={0.04 * i}>
                      <li className="group flex items-center justify-between gap-4 border-b border-grey-200 py-3 transition-colors duration-300 hover:border-ink">
                        <span className="text-[15px]">{item}</span>
                        {/* La flecha asoma al pasar el cursor: señala que la
                            fila es un elemento vivo, sin añadir ruido fijo. */}
                        <span
                          aria-hidden
                          className="ui-label translate-x-[-6px] text-grey-300 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-ink group-hover:opacity-100"
                        >
                          &#8594;
                        </span>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>

              <div
                className={`col-span-12 md:col-span-4 ${
                  fotoALaIzquierda ? "md:col-start-3 md:row-start-1" : "md:col-start-8"
                }`}
              >
                <Reveal delay={0.1}>
                  <figure className="group">
                    <div className="media-zoom relative aspect-[4/3] w-full">
                      <Image
                        src={area.foto}
                        alt={area.alt}
                        fill
                        sizes="(max-width: 768px) 100vw, 33vw"
                        quality={90}
                        className="object-cover"
                      />
                    </div>
                  </figure>
                </Reveal>
              </div>
            </div>
          </section>
        );
      })}

      {/* Cierre corto: la propuesta de valor ya se leyó arriba, aquí solo
          hacen falta las dos salidas. */}
      <section className="rule-t py-14 md:py-16">
        <div className="gutter-x grid grid-cols-12">
          <div className="col-span-12 flex flex-wrap items-baseline gap-x-8 gap-y-3 md:col-span-8 md:col-start-4">
            <Reveal>
              <Link href="/proyectos" className="display-sm link-underline">
                Ver los proyectos
              </Link>
            </Reveal>
            <Reveal delay={0.06}>
              <Link href="/contacto" className="ui-label link-underline text-grey-500">
                o conversemos &#8594;
              </Link>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
