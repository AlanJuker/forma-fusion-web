"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useRef } from "react";

import type { Project } from "@/domain/entities/project";
import { ProjectMark } from "@/presentation/components/ui/logo";

/**
 * Índice de proyectos.
 *
 * Reproduce la retícula del sitio de referencia, medida sobre su propia página:
 * una banda de contenido que ocupa poco más de un tercio del ancho y deja el
 * resto en blanco, con la marca del proyecto y el texto alineados a la derecha
 * contra la fotografía. El vacío es parte del diseño, no un descuido.
 *
 *   columnas 3-4 → marca + título + lugar, alineados a la derecha
 *   columnas 5-7 → fotografía
 *   resto        → papel en blanco
 */
/** Desplazamiento máximo de la fotografía, en píxeles. */
const DESVIO = 9;

/**
 * Al recorrer una ficha con el ratón, su fotografía se desplaza unos píxeles
 * hacia el lado del cursor. Es un gesto muy corto —nueve píxeles— que da
 * profundidad sin llamar la atención. Se escribe directamente sobre el estilo
 * del nodo, sin pasar por el estado de React, para no re-renderizar en cada
 * movimiento del puntero.
 */
function useParallaxFoto() {
  const ref = useRef<HTMLDivElement>(null);

  const alMover = (event: React.MouseEvent<HTMLElement>) => {
    const nodo = ref.current;
    if (!nodo) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const caja = event.currentTarget.getBoundingClientRect();
    const dx = (event.clientX - (caja.left + caja.width / 2)) / (caja.width / 2);
    const dy = (event.clientY - (caja.top + caja.height / 2)) / (caja.height / 2);
    nodo.style.transform = `translate3d(${(dx * DESVIO).toFixed(2)}px, ${(dy * DESVIO).toFixed(2)}px, 0)`;
  };

  const alSalir = () => {
    const nodo = ref.current;
    if (nodo) nodo.style.transform = "translate3d(0, 0, 0)";
  };

  return { ref, alMover, alSalir };
}

function FichaProyecto({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const parallax = useParallaxFoto();

  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{
        duration: 0.9,
        delay: index < 3 ? index * 0.09 : 0,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <Link
        href={`/proyectos/${project.slug}`}
        className="group grid grid-cols-12 gap-x-4 py-7 md:py-9"
        onMouseMove={parallax.alMover}
        onMouseLeave={parallax.alSalir}
      >
        <div className="col-span-5 col-start-1 flex flex-col items-end text-right md:col-span-2 md:col-start-3">
          <ProjectMark
            seed={index}
            className="w-9 text-ink transition-opacity duration-500 group-hover:opacity-55 md:w-11"
          />
          <h3 className="mt-4 text-[15px] leading-[1.25] tracking-[-0.015em] transition-opacity duration-500 group-hover:opacity-55 md:mt-5 md:text-[17px]">
            {project.title}
          </h3>
          <p className="ui-label mt-1.5 text-grey-500">{project.location}</p>
        </div>

        <div className="col-span-7 col-start-6 md:col-span-4 md:col-start-5">
          <div className="media-zoom relative aspect-[16/9] w-full">
            <div
              ref={parallax.ref}
              className="absolute inset-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
            >
              <Image
                src={project.coverImage}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 58vw, 33vw"
                className="object-cover"
                quality={90}
                style={{ objectPosition: project.coverPosition }}
                priority={index < 3}
              />
            </div>
          </div>
        </div>
      </Link>
    </motion.article>
  );
}

export function ProjectList({ projects }: { projects: Project[] }) {
  if (projects.length === 0) {
    return (
      <div className="gutter-x py-32">
        <div className="grid grid-cols-12">
          <p className="col-span-8 col-start-3 text-grey-400">
            Todavía no hay proyectos publicados.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="gutter-x">
      {projects.map((project, index) => (
        <FichaProyecto key={project.id} project={project} index={index} />
      ))}
    </div>
  );
}
