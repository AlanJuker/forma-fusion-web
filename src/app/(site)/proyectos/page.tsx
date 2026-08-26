import type { Metadata } from "next";
import Link from "next/link";

import { listPublishedProjects } from "@/application/use-cases/projects";
import { repositories } from "@/infrastructure/config/container";
import { ProjectList } from "@/presentation/components/project/project-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Proyectos",
  description:
    "Arquitectura, interiorismo y obra construida por Forma & Fusión en Ecuador.",
};

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string }>;
}) {
  const { categoria } = await searchParams;

  const [projects, categories, publicados] = await Promise.all([
    listPublishedProjects(repositories.projects, { categorySlug: categoria }),
    repositories.categories.findAll(),
    // Sin filtrar, para saber qué categorías tienen obra publicada
    listPublishedProjects(repositories.projects),
  ]);

  // Solo se ofrecen filtros que llevan a algún sitio. El contador del
  // repositorio incluye borradores, así que se calcula sobre lo publicado.
  const conObra = new Set(
    publicados.map((p) => p.category?.slug).filter(Boolean),
  );
  const filtros = categories.filter((c) => conObra.has(c.slug));

  return (
    <div className="pt-[calc(var(--header-height)+28px)] pb-24 md:pb-32">
      {/* Filtros alineados con la columna de texto de la lista, para que la
          retícula se lea como una sola desde arriba. */}
      {filtros.length > 1 && (
      <div className="gutter-x mb-6">
        <div className="grid grid-cols-12 gap-x-4">
          <div className="col-span-12 col-start-1 flex flex-wrap gap-x-4 gap-y-2 md:col-span-8 md:col-start-3">
            <Link
              href="/proyectos"
              className={`ui-label transition-colors duration-300 ${
                !categoria ? "text-ink" : "text-grey-400 hover:text-ink"
              }`}
            >
              Todos
            </Link>
            {filtros.map((category) => (
              <Link
                key={category.id}
                href={`/proyectos?categoria=${category.slug}`}
                className={`ui-label transition-colors duration-300 ${
                  categoria === category.slug
                    ? "text-ink"
                    : "text-grey-400 hover:text-ink"
                }`}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      )}

      <h1 className="sr-only">Proyectos</h1>
      <ProjectList projects={projects} />
    </div>
  );
}
