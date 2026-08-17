"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

import type { Project } from "@/domain/entities/project";
import { projectStatusLabel } from "@/domain/entities/project";

interface ProjectCardProps {
  project: Project;
  index?: number;
  priority?: boolean;
  /** Relación de aspecto del recorte; se alterna en el grid para dar ritmo. */
  aspect?: "portrait" | "landscape" | "square";
}

const ASPECT_CLASS: Record<NonNullable<ProjectCardProps["aspect"]>, string> = {
  portrait: "aspect-[3/4]",
  landscape: "aspect-[4/3]",
  square: "aspect-square",
};

export function ProjectCard({
  project,
  index = 0,
  priority = false,
  aspect = "landscape",
}: ProjectCardProps) {
  const reduced = useReducedMotion();

  return (
    <motion.article
      initial={reduced ? undefined : { opacity: 0, y: 28 }}
      whileInView={reduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.8,
        // Escalonado por columna dentro de cada fila, no por índice global:
        // así una fila entera entra casi a la vez.
        delay: (index % 4) * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link href={`/proyectos/${project.slug}`} className="group block">
        <div className={`media-zoom relative ${ASPECT_CLASS[aspect]}`}>
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover"
            priority={priority}
          />
          {/* Velo que aparece en hover para sostener la etiqueta de estado. */}
          <div className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/10" />
          <div className="pointer-events-none absolute bottom-0 left-0 p-3 opacity-0 transition-all duration-500 group-hover:opacity-100">
            <span className="ui-label bg-paper px-2 py-1.5">
              {projectStatusLabel(project.status)}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="text-[15px] leading-snug tracking-[-0.015em]">
              {project.title}
            </h3>
            <p className="text-meta mt-0.5 text-grey-500">{project.location}</p>
          </div>
          <span className="ui-label shrink-0 pt-1 text-grey-400">
            {project.year}
          </span>
        </div>
      </Link>
    </motion.article>
  );
}
