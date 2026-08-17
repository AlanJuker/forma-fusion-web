/**
 * Casos de uso de proyectos.
 *
 * Reciben los repositorios por parámetro (inyección de dependencias explícita),
 * así que se pueden probar con dobles sin levantar una base de datos.
 */

import type { Project } from "@/domain/entities/project";
import { compareForShowcase } from "@/domain/entities/project";
import type {
  ProjectFilter,
  ProjectInput,
  ProjectRepository,
} from "@/domain/repositories";
import { slugify, uniqueSlug } from "@/domain/value-objects/slug";

export async function listPublishedProjects(
  repo: ProjectRepository,
  options: Omit<ProjectFilter, "state"> = {},
): Promise<Project[]> {
  const projects = await repo.findMany({ ...options, state: "PUBLISHED" });
  return [...projects].sort(compareForShowcase);
}

export async function listAllProjects(
  repo: ProjectRepository,
  options: ProjectFilter = {},
): Promise<Project[]> {
  return repo.findMany(options);
}

export async function getPublishedProject(
  repo: ProjectRepository,
  slug: string,
): Promise<Project | null> {
  const project = await repo.findBySlug(slug);
  if (!project || project.state !== "PUBLISHED") return null;
  return project;
}

/**
 * Devuelve proyectos relacionados: misma categoría primero, completando con
 * los más recientes si no hay suficientes.
 */
export async function getRelatedProjects(
  repo: ProjectRepository,
  project: Project,
  limit = 3,
): Promise<Project[]> {
  const pool = await listPublishedProjects(repo, {
    categorySlug: project.category?.slug,
  });
  const related = pool.filter((candidate) => candidate.id !== project.id);
  if (related.length >= limit) return related.slice(0, limit);

  const fallback = (await listPublishedProjects(repo)).filter(
    (candidate) =>
      candidate.id !== project.id && !related.some((r) => r.id === candidate.id),
  );
  return [...related, ...fallback].slice(0, limit);
}

export async function createProject(
  repo: ProjectRepository,
  input: Omit<ProjectInput, "slug"> & { slug?: string },
): Promise<Project> {
  const slug = await uniqueSlug(input.slug || input.title, (candidate) =>
    repo.slugExists(candidate),
  );
  return repo.create({ ...input, slug });
}

export async function updateProject(
  repo: ProjectRepository,
  id: string,
  input: Partial<ProjectInput>,
): Promise<Project> {
  const patch = { ...input };
  if (patch.slug !== undefined || patch.title !== undefined) {
    const base = patch.slug || patch.title || "";
    if (base) {
      const candidate = slugify(base);
      const taken = await repo.slugExists(candidate, id);
      patch.slug = taken
        ? await uniqueSlug(base, (next) => repo.slugExists(next, id))
        : candidate;
    }
  }
  return repo.update(id, patch);
}

export async function deleteProject(
  repo: ProjectRepository,
  id: string,
): Promise<void> {
  await repo.delete(id);
}
