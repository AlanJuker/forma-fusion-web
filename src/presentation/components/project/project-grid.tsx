import type { Project } from "@/domain/entities/project";

import { ProjectCard } from "./project-card";

/**
 * Rejilla de cuatro columnas con tarjetas de altura uniforme: las filas quedan
 * alineadas y el recorrido vertical es continuo, como en el sitio de
 * referencia. Alternar proporciones dejaba huecos y rompía la retícula.
 */
export function ProjectGrid({
  projects,
  columns = 4,
}: {
  projects: Project[];
  columns?: 3 | 4;
}) {
  if (projects.length === 0) {
    return (
      <div className="gutter-x py-24 text-center">
        <p className="display-sm text-grey-400">Sin proyectos todavía</p>
        <p className="text-meta mt-3 text-grey-500">
          Vuelve pronto: estamos preparando nuevos trabajos.
        </p>
      </div>
    );
  }

  const gridCols =
    columns === 3
      ? "sm:grid-cols-2 lg:grid-cols-3"
      : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={`gutter-x grid grid-cols-1 gap-x-4 gap-y-10 ${gridCols}`}>
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          index={index}
          priority={index < 4}
          aspect="landscape"
        />
      ))}
    </div>
  );
}
