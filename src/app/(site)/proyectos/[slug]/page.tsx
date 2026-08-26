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

  // La descripción del documento arranca con la misma frase que el resumen.
  // Se recorta para no leer dos veces lo mismo.
  const resumen = project.excerpt?.trim() ?? "";
  const descripcionCompleta = project.description?.trim() ?? "";
  const cuerpo =
    resumen && descripcionCompleta.startsWith(resumen)
      ? descripcionCompleta.slice(resumen.length).trim()
      : descripcionCompleta;

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
    <article className="pt-[calc(var(--header-height)+28px)] pb-24 md:pb-32">
      {/* Todo vive dentro de la misma banda de contenido que el índice. La
          fotografía no va a sangre: el material original ronda los 720 px de
          ancho y estirarlo a pantalla completa lo deja blando. */}
      <header className="gutter-x">
        <div className="grid grid-cols-12 gap-x-4">
          <div className="col-span-12 md:col-span-6 md:col-start-3">
            <Reveal>
              <p className="ui-label text-grey-400">
                {project.category?.name ?? "Proyecto"}
              </p>
            </Reveal>
            <Reveal delay={0.06}>
              <h1 className="display-sm mt-3 text-balance">{project.title}</h1>
            </Reveal>
          </div>
        </div>
      </header>

      <div className="gutter-x mt-8 md:mt-10">
        <div className="grid grid-cols-12 gap-x-4">
          <Reveal delay={0.1} className="col-span-12 md:col-span-6 md:col-start-3">
            <div className="media-zoom relative aspect-[3/2] w-full">
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 50vw"
                quality={90}
                className="object-cover"
                style={{ objectPosition: project.coverPosition }}
              />
            </div>
          </Reveal>
        </div>
      </div>

      {/* Resumen y ficha técnica */}
      <div className="gutter-x mt-10 md:mt-14">
        <div className="grid grid-cols-12 gap-x-4 gap-y-10">
          <div className="col-span-12 md:col-span-3 md:col-start-3">
            {resumen && (
              <Reveal>
                <p className="text-[18px] text-grey-700">{resumen}</p>
              </Reveal>
            )}
            {cuerpo && (
              <Reveal delay={0.06}>
                <div className="mt-6">
                  {cuerpo.split("\n\n").map((paragraph) => (
                    <p
                      key={paragraph.slice(0, 40)}
                      className="mb-4 text-[15px] text-grey-600"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Reveal>
            )}
          </div>

          <div className="col-span-12 md:col-span-2 md:col-start-7">
            <Reveal delay={0.12}>
              <dl>
                {facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="flex justify-between gap-4 border-b border-grey-200 py-2.5"
                  >
                    <dt className="ui-label text-grey-400">{fact.label}</dt>
                    <dd className="text-meta text-right">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>

      {/* Galería: dos columnas dentro de la banda, para no estirar el material */}
      {project.images.length > 0 && (
        <section className="gutter-x mt-14 md:mt-20">
          <div className="grid grid-cols-12 gap-x-4">
            <div className="col-span-12 grid grid-cols-2 gap-4 md:col-span-6 md:col-start-3">
              {project.images.map((image) => (
                <Reveal key={image.id} delay={0.04}>
                  <figure className="group">
                    <div className="media-zoom relative aspect-[3/2] w-full">
                      <Image
                        src={image.url}
                        alt={image.alt ?? project.title}
                        fill
                        sizes="(max-width: 768px) 50vw, 25vw"
                        quality={90}
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
              ))}
            </div>
          </div>
        </section>
      )}

      {related.length > 0 && (
        <section className="rule-t mt-20 pt-14 md:mt-28">
          <div className="gutter-x mb-6">
            <div className="grid grid-cols-12 gap-x-4">
              <div className="col-span-12 flex items-baseline justify-between md:col-span-6 md:col-start-3">
                <p className="ui-label text-grey-400">Otros proyectos</p>
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
