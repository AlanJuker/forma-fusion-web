import { listPublishedProjects } from "@/application/use-cases/projects";
import { repositories } from "@/infrastructure/config/container";
import { ProjectList } from "@/presentation/components/project/project-list";

export const dynamic = "force-dynamic";

/**
 * Portada.
 *
 * Deliberadamente sobria, como la del sitio de referencia: sin gran imagen de
 * apertura ni reclamos: tras la intro, el índice de obra ocupa la página. El
 * resto del discurso vive en Estudio y Servicios.
 */
export default async function HomePage() {
  const projects = await listPublishedProjects(repositories.projects);

  return (
    <div className="pt-[calc(var(--header-height)+28px)] pb-24 md:pb-32">
      <h1 className="sr-only">
        Forma &amp; Fusión — Estudio de diseño y construcción en Ecuador
      </h1>
      <ProjectList projects={projects} />
    </div>
  );
}
