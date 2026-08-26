import type { Metadata } from "next";

import { Reveal, RevealLines } from "@/presentation/components/ui/reveal";

export const metadata: Metadata = {
  title: "Estudio",
  description:
    "Forma & Fusión es una empresa riobambeña que integra diseño, desarrollo inmobiliario y construcción.",
};

const QUIENES_SOMOS = [
  "Forma & Fusión es una empresa riobambeña fundada por dos hermanos que decidieron apostar por una manera diferente de desarrollar proyectos inmobiliarios.",
  "Nacimos de una convicción: un proyecto no debería limitarse a convertirse en una obra más, una vivienda más o una remodelación más. Detrás de cada proyecto existe una inversión, una oportunidad, un patrimonio y, sobre todo, una historia que merece ser entendida en toda su dimensión.",
  "Por eso, nuestra forma de trabajar parte de una premisa fundamental: los buenos resultados no son producto del azar, sino de una planificación adecuada, procesos claros y decisiones oportunas. Integramos diseño, desarrollo inmobiliario y construcción para estructurar y gestionar cada etapa de manera ordenada, buscando que la planificación se traduzca en calidad, eficiencia y mejores resultados.",
  "Creemos que profesionalizar la manera de desarrollar proyectos permite hacer algo más que construir: permite crear valor. Valor para quienes invierten, para quienes habitan y para los entornos que transformamos.",
  "En Forma & Fusión no buscamos que nuestra relación con un cliente termine cuando se entrega una obra. Buscamos construir vínculos, generar confianza y crear relaciones que trasciendan un proyecto. Concebimos cada proyecto como el inicio de algo que puede crecer, evolucionar y multiplicarse.",
  "Apostamos por una nueva perspectiva del desarrollo inmobiliario, donde las ideas, la planificación, la tecnología y el profesionalismo se convierten en proyectos capaces de generar valor y transformar su entorno.",
  "Empezamos en Riobamba con una visión que queremos llevar mucho más lejos.",
];

const MISION =
  "Nuestra misión es transformar ideas, inversiones y espacios en proyectos que generen valor y mejoren la forma de habitar, trabajar y construir patrimonio. Integramos diseño, ingeniería, construcción y desarrollo inmobiliario para acompañar a nuestros clientes de manera cercana, transparente y responsable en cada etapa de sus proyectos, protegiendo su patrimonio y convirtiendo un proceso complejo en una experiencia clara, eficiente y humana. Actuamos con ética, empatía e innovación, cuidando cada inversión, cada relación y cada entorno en el que intervenimos, con la convicción de generar valor más allá de cada proyecto.";

const VISION =
  "Consolidarnos como una empresa referente en el desarrollo inmobiliario del Ecuador, reconocida por crear proyectos innovadores, funcionales y sostenibles que generen valor para nuestros clientes, inversionistas y comunidades. Aspiramos a crecer de manera sólida y rentable, evolucionando constantemente junto con la tecnología y las nuevas formas de habitar, con una gestión basada en la ética, la excelencia y la responsabilidad, y con el compromiso de generar valor sostenible en cada proyecto y en cada entorno en el que intervenimos.";

const VALORES = [
  "Integridad",
  "Excelencia",
  "Cercanía",
  "Innovación",
  "Responsabilidad",
  "Humanidad",
];

/** Bloque de texto alineado con la retícula del resto del sitio. */
function Bloque({
  etiqueta,
  children,
}: {
  etiqueta: string;
  children: React.ReactNode;
}) {
  return (
    <section className="gutter-x rule-t py-14 md:py-20">
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-2 md:col-start-3">
          <Reveal>
            <p className="ui-label text-grey-400">{etiqueta}</p>
          </Reveal>
        </div>
        <div className="md:col-span-6 md:col-start-6">{children}</div>
      </div>
    </section>
  );
}

export default function StudioPage() {
  return (
    <>
      <header className="gutter-x pt-32 pb-14 md:pt-40 md:pb-20">
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <Reveal>
              <p className="ui-label text-grey-400">El estudio</p>
            </Reveal>
            <RevealLines
              className="display-sm mt-4 block text-balance"
              lines={["Una nueva perspectiva", "del desarrollo", "inmobiliario."]}
            />
          </div>
        </div>
      </header>

      <Bloque etiqueta="Quiénes somos">
        {QUIENES_SOMOS.map((parrafo, index) => (
          <Reveal key={parrafo.slice(0, 32)} delay={index * 0.04}>
            <p
              className={
                index === 0
                  ? "mb-5 text-[18px] text-grey-700"
                  : "mb-5 text-[15px] text-grey-600"
              }
            >
              {parrafo}
            </p>
          </Reveal>
        ))}
      </Bloque>

      <Bloque etiqueta="Misión">
        <Reveal>
          <p className="text-[15px] text-grey-700">{MISION}</p>
        </Reveal>
      </Bloque>

      <Bloque etiqueta="Visión">
        <Reveal>
          <p className="text-[15px] text-grey-700">{VISION}</p>
        </Reveal>
      </Bloque>

      <section className="gutter-x rule-t py-14 md:py-20">
        <div className="grid gap-6 md:grid-cols-12">
          <div className="md:col-span-2 md:col-start-3">
            <Reveal>
              <p className="ui-label text-grey-400">Valores</p>
            </Reveal>
          </div>
          <div className="md:col-span-6 md:col-start-6">
            <ul>
              {VALORES.map((valor, index) => (
                <Reveal key={valor} delay={index * 0.05}>
                  <li className="flex items-baseline justify-between gap-4 border-b border-grey-200 py-3">
                    <span className="text-[18px] tracking-[-0.02em]">{valor}</span>
                    <span className="ui-label text-grey-400">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </li>
                </Reveal>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
