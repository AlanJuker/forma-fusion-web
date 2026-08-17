import Link from "next/link";

import { listPublishedNews } from "@/application/use-cases/content";
import { listPublishedProjects } from "@/application/use-cases/projects";
import { repositories } from "@/infrastructure/config/container";
import { Hero } from "@/presentation/components/home/hero";
import { ProjectGrid } from "@/presentation/components/project/project-grid";
import { Marquee } from "@/presentation/components/ui/marquee";
import { Reveal, RevealLines } from "@/presentation/components/ui/reveal";

export const dynamic = "force-dynamic";

const CAPABILITIES = [
  {
    number: "01",
    title: "Arquitectura",
    body: "Anteproyecto, proyecto ejecutivo y permisos municipales. Diseñamos con el presupuesto y el terreno como punto de partida, no como restricción de última hora.",
  },
  {
    number: "02",
    title: "Interiorismo",
    body: "Distribución, mobiliario a medida, iluminación y selección de acabados. Un solo interlocutor entre el render y lo que finalmente se instala.",
  },
  {
    number: "03",
    title: "Construcción",
    body: "Ejecución de obra con cronograma y control de costos semanal. Dirigimos a los gremios y respondemos por el resultado final.",
  },
  {
    number: "04",
    title: "Remodelación",
    body: "Intervención de espacios existentes, refuerzo estructural y ampliaciones, con la vivienda habitada cuando el proyecto lo permite.",
  },
];

export default async function HomePage() {
  const [projects, news] = await Promise.all([
    listPublishedProjects(repositories.projects),
    listPublishedNews(repositories.news, 3),
  ]);

  const [hero, ...rest] = projects;

  return (
    <>
      <Hero project={hero ?? null} />

      {/* Manifiesto */}
      <section className="gutter-x py-20 md:py-32">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-3">
            <Reveal>
              <p className="ui-label text-grey-400">Estudio</p>
            </Reveal>
          </div>
          <div className="md:col-span-9">
            <RevealLines
              className="display-sm block text-balance"
              lines={[
                "No entregamos planos y desaparecemos.",
                "Diseñamos, construimos y respondemos",
                "por el resultado.",
              ]}
            />
            <Reveal delay={0.25}>
              <p className="mt-8 max-w-xl text-[15px] text-grey-600">
                Forma &amp; Fusión es un estudio ecuatoriano que integra diseño y
                obra bajo un mismo equipo. Esa continuidad elimina la distancia
                habitual entre lo que se dibuja y lo que se construye: menos
                sorpresas en presupuesto, menos improvisación en sitio.
              </p>
            </Reveal>
            <Reveal delay={0.35}>
              <Link href="/estudio" className="ui-label link-underline mt-8 inline-block">
                Conocer el estudio &#8594;
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="rule-t rule-b py-6">
        <Marquee
          items={["Arquitectura", "Interiorismo", "Construcción", "Remodelación"]}
        />
      </div>

      {/* Proyectos */}
      <section className="py-20 md:py-28">
        <div className="gutter-x mb-10 flex items-end justify-between">
          <Reveal>
            <p className="ui-label text-grey-400">Proyectos seleccionados</p>
          </Reveal>
          <Reveal>
            <Link href="/proyectos" className="ui-label link-underline">
              Ver todos ({projects.length})
            </Link>
          </Reveal>
        </div>
        <ProjectGrid projects={rest.slice(0, 8)} />
      </section>

      {/* Capacidades */}
      <section className="rule-t py-20 md:py-28">
        <div className="gutter-x">
          <Reveal>
            <p className="ui-label text-grey-400">Qué hacemos</p>
          </Reveal>
          <div className="mt-10 grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {CAPABILITIES.map((item, index) => (
              <Reveal key={item.number} delay={index * 0.08}>
                <article className="rule-t pt-4">
                  <span className="ui-label text-grey-400">{item.number}</span>
                  <h3 className="mt-6 text-[22px] tracking-[-0.02em]">
                    {item.title}
                  </h3>
                  <p className="text-meta mt-3 text-grey-600">{item.body}</p>
                </article>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.2}>
            <Link href="/servicios" className="ui-label link-underline mt-12 inline-block">
              Ver servicios en detalle &#8594;
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Noticias */}
      {news.length > 0 && (
        <section className="rule-t py-20 md:py-28">
          <div className="gutter-x">
            <div className="mb-10 flex items-end justify-between">
              <Reveal>
                <p className="ui-label text-grey-400">Novedades</p>
              </Reveal>
              <Reveal>
                <Link href="/noticias" className="ui-label link-underline">
                  Todas las noticias
                </Link>
              </Reveal>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {news.map((post, index) => (
                <Reveal key={post.id} delay={index * 0.08}>
                  <Link href={`/noticias/${post.slug}`} className="group block">
                    <p className="ui-label text-grey-400">
                      {post.publishedAt
                        ? new Intl.DateTimeFormat("es-EC", {
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          }).format(post.publishedAt)
                        : ""}
                    </p>
                    <h3 className="mt-3 text-[22px] leading-tight tracking-[-0.02em] transition-opacity group-hover:opacity-60">
                      {post.title}
                    </h3>
                    {post.excerpt && (
                      <p className="text-meta mt-3 text-grey-600">{post.excerpt}</p>
                    )}
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cierre */}
      <section className="rule-t bg-ink py-24 text-paper md:py-32">
        <div className="gutter-x">
          <RevealLines
            className="display block"
            lines={["¿Tienes un", "proyecto en mente?"]}
          />
          <Reveal delay={0.3}>
            <Link
              href="/contacto"
              className="ui-label link-underline mt-10 inline-block"
            >
              Hablemos &#8594;
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
