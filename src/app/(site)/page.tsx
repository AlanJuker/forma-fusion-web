import Link from "next/link";

import { listPublishedProjects } from "@/application/use-cases/projects";
import { repositories } from "@/infrastructure/config/container";
import { ProjectList } from "@/presentation/components/project/project-list";
import { Reveal, RevealLines } from "@/presentation/components/ui/reveal";

export const dynamic = "force-dynamic";

/**
 * Portada.
 *
 * La propuesta de valor del estudio y, debajo, el índice de obra. Sin gran
 * imagen de apertura: tras la intro, el trabajo ocupa la página.
 */
export default async function HomePage() {
  const projects = await listPublishedProjects(repositories.projects);

  return (
    <div className="pb-24 md:pb-32">
      <h1 className="sr-only">
        Forma &amp; Fusión — Desarrollo inmobiliario, diseño y construcción
      </h1>

      <section className="gutter-x pt-[calc(var(--header-height)+72px)] pb-16 md:pb-24">
        <div className="grid grid-cols-12">
          <div className="col-span-12 md:col-span-8 md:col-start-3">
            <RevealLines
              className="display-sm block text-balance"
              lines={[
                "Hacemos que desarrollar",
                "un proyecto sea más claro,",
                "más ordenado y más llevadero.",
              ]}
            />
            <Reveal delay={0.35}>
              <div className="mt-8 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                <Link href="/estudio" className="ui-label link-underline">
                  El estudio &#8594;
                </Link>
                <Link href="/servicios" className="ui-label link-underline">
                  Qué hacemos &#8594;
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="rule-t pt-10">
        <div className="gutter-x mb-6">
          <div className="grid grid-cols-12">
            <div className="col-span-12 flex items-baseline justify-between md:col-span-6 md:col-start-3">
              <Reveal>
                <p className="ui-label text-grey-400">Proyectos</p>
              </Reveal>
              <Reveal>
                <span className="ui-label text-grey-400">
                  {String(projects.length).padStart(2, "0")}
                </span>
              </Reveal>
            </div>
          </div>
        </div>
        <ProjectList projects={projects} />
      </section>
    </div>
  );
}
