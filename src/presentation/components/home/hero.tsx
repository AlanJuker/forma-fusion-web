"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import type { Project } from "@/domain/entities/project";

/**
 * Portada a pantalla completa: la imagen se desplaza más lento que la página
 * (parallax) y el titular sube tras una máscara. Es el primer gesto del sitio,
 * así que carga con prioridad.
 */
export function Hero({ project }: { project: Project | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const overlayOpacity = useTransform(scrollYProgress, [0, 1], [0.25, 0.6]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);

  const headline = ["Forma", "&", "Fusión"];

  return (
    <section
      ref={ref}
      className="relative flex h-screen min-h-[560px] items-end overflow-hidden"
    >
      {project && (
        <motion.div
          className="absolute inset-0 -z-10"
          style={reduced ? undefined : { y: imageY }}
        >
          <Image
            src={project.coverImage}
            alt={project.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <motion.div
            className="absolute inset-0 bg-ink"
            style={{ opacity: reduced ? 0.35 : overlayOpacity }}
          />
        </motion.div>
      )}

      <motion.div
        className="gutter-x relative w-full pb-10 text-paper md:pb-14"
        style={reduced ? undefined : { y: contentY }}
      >
        <h1 className="display font-medium">
          {headline.map((line, index) => (
            <span key={line} className="block overflow-hidden">
              <motion.span
                className="block"
                initial={reduced ? undefined : { y: "110%" }}
                animate={reduced ? undefined : { y: 0 }}
                transition={{
                  duration: 1.1,
                  delay: 0.15 + index * 0.09,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                {line}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={reduced ? undefined : { opacity: 0, y: 20 }}
          animate={reduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mt-8 flex flex-col gap-6 border-t border-paper/25 pt-5 sm:flex-row sm:items-end sm:justify-between"
        >
          <p className="max-w-sm text-[15px] text-paper/80">
            Estudio de diseño y construcción en Ecuador. Del anteproyecto a la
            entrega de obra.
          </p>

          {project && (
            <Link
              href={`/proyectos/${project.slug}`}
              className="group flex items-baseline gap-3"
            >
              <span className="ui-label text-paper/60">Proyecto destacado</span>
              <span className="text-[15px] text-paper link-underline">
                {project.title}, {project.location}
              </span>
            </Link>
          )}
        </motion.div>
      </motion.div>

      {/* Indicador de scroll con rebote sutil */}
      <motion.div
        className="pointer-events-none absolute bottom-6 right-6 hidden md:block"
        animate={reduced ? undefined : { y: [0, 8, 0] }}
        transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
      >
        <span className="ui-label text-paper/70">Desliza &#8595;</span>
      </motion.div>
    </section>
  );
}
