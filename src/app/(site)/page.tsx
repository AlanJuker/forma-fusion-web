import { listPublishedProjects } from "@/application/use-cases/projects";
import { repositories } from "@/infrastructure/config/container";
import { ProjectList } from "@/presentation/components/project/project-list";

export const dynamic = "force-dynamic";

/**
 * Portada: el índice de obra y nada más, como en el sitio de referencia.
 * Tras la intro, lo primero y único que se ve son los proyectos.
 */
export default async function HomePage() {
  const projects = await listPublishedProjects(repositories.projects);

  return (
    <div className="pt-[calc(var(--header-height)+28px)] pb-24 md:pb-32">
      <h1 className="sr-only">
        Forma &amp; Fusión — Desarrollo inmobiliario, diseño y construcción
      </h1>
      <ProjectList projects={projects} />
    </div>
  );
}
