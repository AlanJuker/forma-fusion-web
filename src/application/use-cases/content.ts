/** Casos de uso del resto del contenido: noticias, equipo, oficinas, contacto. */

import type {
  ContactMessage,
  NewsPost,
  Office,
  TeamMember,
} from "@/domain/entities/content";
import type {
  ContactRepository,
  NewsInput,
  NewsRepository,
  OfficeRepository,
  TeamRepository,
} from "@/domain/repositories";
import { uniqueSlug } from "@/domain/value-objects/slug";

export async function listPublishedNews(
  repo: NewsRepository,
  take?: number,
): Promise<NewsPost[]> {
  return repo.findMany({ state: "PUBLISHED", take });
}

export async function createNews(
  repo: NewsRepository,
  input: Omit<NewsInput, "slug"> & { slug?: string },
): Promise<NewsPost> {
  const slug = await uniqueSlug(
    input.slug || input.title,
    async (candidate) => (await repo.findBySlug(candidate)) !== null,
  );
  // Publicar por primera vez fija la fecha de publicación.
  const publishedAt =
    input.state === "PUBLISHED" ? (input.publishedAt ?? new Date()) : null;
  return repo.create({ ...input, slug, publishedAt });
}

export async function updateNews(
  repo: NewsRepository,
  id: string,
  input: Partial<NewsInput>,
): Promise<NewsPost> {
  const patch = { ...input };
  if (patch.state === "PUBLISHED" && patch.publishedAt === undefined) {
    const current = await repo.findById(id);
    if (!current?.publishedAt) patch.publishedAt = new Date();
  }
  if (patch.state === "DRAFT") patch.publishedAt = null;
  return repo.update(id, patch);
}

export async function listVisibleTeam(repo: TeamRepository): Promise<TeamMember[]> {
  return repo.findMany(true);
}

export async function listOffices(repo: OfficeRepository): Promise<Office[]> {
  return repo.findMany();
}

export async function submitContactMessage(
  repo: ContactRepository,
  input: {
    name: string;
    email: string;
    phone?: string | null;
    subject?: string | null;
    message: string;
  },
): Promise<ContactMessage> {
  return repo.create({
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    subject: input.subject ?? null,
    message: input.message,
  });
}
