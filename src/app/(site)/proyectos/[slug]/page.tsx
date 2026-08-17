import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { projectStatusLabel } from "@/domain/entities/project";
import {
  getPublishedProject,
  getRelatedProjects,
} from "@/application/use-cases/projects";
import { repositories } from "@/infrastructure/config/container";
import { ProjectList } from "@/presentation/components/project/project-list";
import { Reveal } from "@/presentation/components/ui/reveal";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublishedProject(repositories.projects, slug);
  if (!project) return { title: "Proyecto no encontrado" };

  return {
    title: project.title,
    description: project.excerpt ?? `${project.title}, ${project.location}.`,
    openGraph: {
      title: project.title,
      description: project.excerpt ?? undefined,
      images: [{ url: project.coverImage }],
    },
  };
}

export default async function ProjectDetailPage({ params }: Params) {
  const { slug } = await params;
  const project = await getPublishedProject(repositories.projects, slug);
  if (!project) notFound();

  const related = await getRelatedProjects(repositories.projects, project);

  const facts = [
    { label: "Ubicación", value: project.location },
    { label: "Año", value: String(project.year) },
    { label: "Estado", value: projectStatusLabel(project.status) },
    { label: "Categoría", value: project.category?.name },
    { label: "Superficie", value: project.size },
    { label: "Cliente", value: project.client },
    { label: "Colaboradores", value: project.collaborators },
  ].filter((fact): fact is { label: string; value: string } => Boolean(fact.value));

  return (
    <article>
      {/* Portada a sangre */}
      <div className="relative h-[70vh] min-h-[420px] w-full">
        <Image
          src={project.coverImage}
          alt={project.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      <header className="gutter-x py-12 md:py-20">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <p className="ui-label text-grey-400">
                {project.category?.name ?? "Proyecto"}
              </p>
            </Reveal>
            <Reveal delay={0.08}>
              <h1 className="display-sm mt-4 text-balance">{project.title}</h1>
            </Reveal>
            {project.excerpt && (
              <Reveal delay={0.16}>
                <p className="mt-6 max-w-lg text-[18px] text-grey-700">
                  {project.excerpt}
                </p>
              </Reveal>
            )}
          </div>

          {/* Ficha técnica */}
          <div className="md:col-span-4 md:col-start-9">
            <Reveal delay={0.2}>
              <dl className="rule-t pt-4">
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex justify-between gap-4 border-b border-grey-200 py-3"
                  >
                    <dt className="ui-label text-grey-400">{fact.label}</dt>
                    <dd className="text-meta text-right">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>

        {project.description && (
          <Reveal delay={0.1}>
            <div className="mt-16 grid md:grid-cols-12">
              <div className="md:col-span-7 md:col-start-6">
                {project.description.split("\n\n").map((paragraph) => (
                  <p key={paragraph.slice(0, 40)} className="mb-5 text-[15px] text-grey-700">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </header>

      {/* Galería: alterna ancho completo y media columna para dar ritmo */}
      {project.images.length > 0 && (
        <section className="gutter-x grid gap-4 pb-16 md:grid-cols-2">
          {project.images.map((image, index) => {
            const fullWidth = index % 3 === 0;
            return (
              <Reveal
                key={image.id}
                delay={0.05}
                className={fullWidth ? "md:col-span-2" : ""}
              >
                <figure className="group">
                  <div
                    className={`media-zoom relative ${
                      fullWidth ? "aspect-[16/9]" : "aspect-[4/3]"
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt ?? project.title}
                      fill
                      sizes={fullWidth ? "100vw" : "50vw"}
                      className="object-cover"
                    />
                  </div>
                  {image.caption && (
                    <figcaption className="ui-label mt-2 text-grey-400">
                      {image.caption}
                    </figcaption>
                  )}
                </figure>
              </Reveal>
            );
          })}
        </section>
      )}

      {related.length > 0 && (
        <section className="rule-t py-16 md:py-24">
          <div className="gutter-x mb-6">
            <div className="grid grid-cols-12 gap-x-4">
              <div className="col-span-12 flex items-baseline justify-between md:col-span-6 md:col-start-3">
                <p className="ui-label text-grey-400">Proyectos relacionados</p>
                <Link href="/proyectos" className="ui-label link-underline">
                  Ver todos
                </Link>
              </div>
            </div>
          </div>
          <ProjectList projects={related} />
        </section>
      )}
    </article>
  );
}
