import type { Metadata } from "next";
import Link from "next/link";

import { listPublishedProjects } from "@/application/use-cases/projects";
import { repositories } from "@/infrastructure/config/container";
import { ProjectGrid } from "@/presentation/components/project/project-grid";
import { Reveal } from "@/presentation/components/ui/reveal";

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

  const [projects, categories] = await Promise.all([
    listPublishedProjects(repositories.projects, { categorySlug: categoria }),
    repositories.categories.findAll(),
  ]);

  const activeCategory = categoria
    ? categories.find((category) => category.slug === categoria)
    : undefined;

  return (
    <>
      <header className="gutter-x pt-32 pb-10 md:pt-40 md:pb-14">
        <Reveal>
          <p className="ui-label text-grey-400">
            {projects.length} {projects.length === 1 ? "proyecto" : "proyectos"}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="display mt-4">
            {activeCategory ? activeCategory.name : "Proyectos"}
          </h1>
        </Reveal>
      </header>

      {/* Filtros por categoría */}
      <div className="gutter-x rule-b sticky top-[var(--header-height)] z-30 flex gap-x-5 gap-y-2 overflow-x-auto bg-paper py-4">
        <Link
          href="/proyectos"
          className={`ui-label whitespace-nowrap transition-colors ${
            !categoria ? "text-ink" : "text-grey-400 hover:text-ink"
          }`}
        >
          Todos
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/proyectos?categoria=${category.slug}`}
            className={`ui-label whitespace-nowrap transition-colors ${
              categoria === category.slug
                ? "text-ink"
                : "text-grey-400 hover:text-ink"
            }`}
          >
            {category.name}
          </Link>
        ))}
      </div>

      <section className="py-12 md:py-16">
        <ProjectGrid projects={projects} />
      </section>
    </>
  );
}
