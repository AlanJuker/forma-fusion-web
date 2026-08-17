import type { Metadata } from "next";
import Image from "next/image";

import { listVisibleTeam } from "@/application/use-cases/content";
import { listPublishedProjects } from "@/application/use-cases/projects";
import { repositories } from "@/infrastructure/config/container";
import { Reveal, RevealLines } from "@/presentation/components/ui/reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Estudio",
  description:
    "Forma & Fusión es un estudio ecuatoriano de diseño y construcción. Conoce al equipo y cómo trabajamos.",
};

export default async function StudioPage() {
  const [team, projects] = await Promise.all([
    listVisibleTeam(repositories.team),
    listPublishedProjects(repositories.projects),
  ]);

  const completed = projects.filter((p) => p.status === "COMPLETED").length;
  const inProgress = projects.filter((p) => p.status === "IN_PROGRESS").length;

  const stats = [
    { value: String(projects.length).padStart(2, "0"), label: "Proyectos" },
    { value: String(completed).padStart(2, "0"), label: "Entregados" },
    { value: String(inProgress).padStart(2, "0"), label: "En obra" },
    { value: String(team.length).padStart(2, "0"), label: "Equipo" },
  ];

  return (
    <>
      <header className="gutter-x pt-32 pb-16 md:pt-40 md:pb-24">
        <Reveal>
          <p className="ui-label text-grey-400">El estudio</p>
        </Reveal>
        <RevealLines
          className="display mt-4 block"
          lines={["Diseño y obra", "bajo un mismo", "equipo."]}
        />
      </header>

      <section className="gutter-x rule-t py-16">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <p className="ui-label text-grey-400">Quiénes somos</p>
            </Reveal>
          </div>
          <div className="md:col-span-7 md:col-start-6">
            <Reveal>
              <p className="text-[18px] text-grey-700">
                Forma &amp; Fusión nace en Ecuador con una idea simple: la mayoría
                de los problemas de una obra no son técnicos, son de comunicación.
                Un estudio dibuja, otro construye y el cliente queda en medio
                traduciendo entre ambos.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <p className="mt-5 text-[15px] text-grey-600">
                Integramos las dos disciplinas. El mismo equipo que define la
                distribución especifica los materiales, negocia con los proveedores
                y responde cuando algo no calza en sitio. Esa continuidad reduce
                sobrecostos y elimina la discusión de a quién le toca resolver.
              </p>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-5 text-[15px] text-grey-600">
                Trabajamos vivienda unifamiliar, locales comerciales, oficinas y
                remodelación. Cada proyecto arranca con una conversación honesta
                sobre presupuesto: preferimos ajustar el alcance al inicio antes que
                detener una obra a mitad de camino.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="gutter-x rule-t py-16">
        <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal key={stat.label} delay={index * 0.07}>
              <div>
                <p className="display-sm">{stat.value}</p>
                <p className="ui-label mt-2 text-grey-400">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {team.length > 0 && (
        <section className="gutter-x rule-t py-16 md:py-24">
          <Reveal>
            <p className="ui-label text-grey-400">Equipo</p>
          </Reveal>
          <div className="mt-10 grid gap-x-4 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((member, index) => (
              <Reveal key={member.id} delay={(index % 4) * 0.07}>
                <article className="group">
                  <div className="media-zoom relative aspect-[3/4] bg-grey-100">
                    {member.photo && (
                      <Image
                        src={member.photo}
                        alt={member.name}
                        fill
                        sizes="(max-width: 640px) 100vw, 25vw"
                        className="object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0"
                      />
                    )}
                  </div>
                  <h3 className="mt-3 text-[15px]">{member.name}</h3>
                  <p className="text-meta text-grey-500">{member.role}</p>
                  {member.bio && (
                    <p className="text-meta mt-2 text-grey-600">{member.bio}</p>
                  )}
                </article>
              </Reveal>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
