/**
 * Entidad de dominio: Proyecto.
 * Sin dependencias de framework ni de ORM — es el modelo que usa el negocio.
 */

export type ProjectStatus =
  | "DELIVERED"
  | "IN_OPERATION"
  | "FOR_SALE"
  | "IN_PROGRESS";

export type PublishState = "DRAFT" | "PUBLISHED";

export interface ProjectImage {
  id: string;
  url: string;
  caption: string | null;
  alt: string | null;
  order: number;
}

export interface ProjectCategoryRef {
  id: string;
  name: string;
  slug: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  location: string;
  year: number;
  size: string | null;
  client: string | null;
  collaborators: string | null;
  status: ProjectStatus;
  state: PublishState;
  featured: boolean;
  order: number;
  excerpt: string | null;
  description: string | null;
  coverImage: string;
  coverPosition: string;
  category: ProjectCategoryRef | null;
  images: ProjectImage[];
  createdAt: Date;
  updatedAt: Date;
}

/** Etiqueta del estado, con la misma redacción que emplea el estudio. */
export function projectStatusLabel(status: ProjectStatus): string {
  switch (status) {
    case "DELIVERED":
      return "Entregado";
    case "IN_OPERATION":
      return "Entregado — En funcionamiento";
    case "FOR_SALE":
      return "En venta";
    case "IN_PROGRESS":
      return "En ejecución";
  }
}

/** Encuadres admitidos al recortar la portada. */
export const COVER_POSITION_OPTIONS = [
  { value: "center", label: "Centrado" },
  { value: "top", label: "Parte superior" },
  { value: "bottom", label: "Parte inferior" },
] as const;

export const PROJECT_STATUS_OPTIONS: { value: ProjectStatus; label: string }[] = [
  { value: "DELIVERED", label: "Entregado" },
  { value: "IN_OPERATION", label: "Entregado — En funcionamiento" },
  { value: "FOR_SALE", label: "En venta" },
  { value: "IN_PROGRESS", label: "En ejecución" },
];

/** Un proyecto es visible al público solo si está publicado. */
export function isPubliclyVisible(project: Pick<Project, "state">): boolean {
  return project.state === "PUBLISHED";
}

/**
 * Orden de portada: primero los destacados, luego por `order` ascendente y,
 * a igualdad, por año descendente.
 */
export function compareForShowcase(
  a: Pick<Project, "featured" | "order" | "year">,
  b: Pick<Project, "featured" | "order" | "year">,
): number {
  if (a.featured !== b.featured) return a.featured ? -1 : 1;
  if (a.order !== b.order) return a.order - b.order;
  return b.year - a.year;
}
