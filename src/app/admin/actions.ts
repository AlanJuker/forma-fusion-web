"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { categorySchema, projectSchema } from "@/application/dto/schemas";
import {
  createProject,
  deleteProject,
  updateProject,
} from "@/application/use-cases/projects";
import { slugify, uniqueSlug } from "@/domain/value-objects/slug";
import { requireSession } from "@/infrastructure/auth/guard";
import { repositories } from "@/infrastructure/config/container";

export interface ActionState {
  error?: string;
  /** Solo lo usan las acciones que no redirigen, como los ajustes. */
  saved?: boolean;
}

/** Revalida el sitio público tras cualquier cambio de contenido. */
function revalidateSite(...extra: string[]) {
  revalidatePath("/", "layout");
  for (const path of extra) revalidatePath(path);
}

function fieldErrorMessage(issues: { message: string }[]): string {
  return issues[0]?.message ?? "Revisa los datos introducidos.";
}

/** Convierte el textarea "una imagen por línea" en la galería del proyecto. */
function parseGallery(raw: FormDataEntryValue | null) {
  if (typeof raw !== "string") return [];
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line, index) => {
      // Formato admitido: "url | pie de foto"
      const [url, caption] = line.split("|").map((part) => part.trim());
      return { url, caption: caption || null, alt: null, order: index };
    })
    .filter((image) => image.url.length > 0);
}

// ---------------------------------------------------------------- proyectos

export async function saveProject(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();

  const id = formData.get("id");
  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    location: formData.get("location"),
    year: formData.get("year"),
    size: formData.get("size"),
    client: formData.get("client"),
    collaborators: formData.get("collaborators"),
    status: formData.get("status"),
    state: formData.get("state"),
    featured: formData.get("featured") === "true",
    order: formData.get("order"),
    excerpt: formData.get("excerpt"),
    description: formData.get("description"),
    coverImage: formData.get("coverImage"),
    coverPosition: formData.get("coverPosition"),
    categoryId: formData.get("categoryId"),
  });

  if (!parsed.success) {
    return { error: fieldErrorMessage(parsed.error.issues) };
  }

  const images = parseGallery(formData.get("gallery"));
  const payload = { ...parsed.data, images };

  try {
    if (typeof id === "string" && id) {
      await updateProject(repositories.projects, id, payload);
    } else {
      await createProject(repositories.projects, payload);
    }
  } catch {
    return { error: "No se pudo guardar el proyecto. Revisa los datos." };
  }

  revalidateSite("/proyectos");
  redirect("/admin/proyectos");
}

export async function removeProject(formData: FormData) {
  await requireSession();
  const id = formData.get("id");
  if (typeof id !== "string") return;

  await deleteProject(repositories.projects, id);
  revalidateSite("/proyectos");
  redirect("/admin/proyectos");
}

// --------------------------------------------------------------- categorías

export async function saveCategory(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();

  const id = formData.get("id");
  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    order: formData.get("order"),
    parentId: formData.get("parentId"),
  });

  if (!parsed.success) return { error: fieldErrorMessage(parsed.error.issues) };

  const data = parsed.data;

  try {
    if (typeof id === "string" && id) {
      await repositories.categories.update(id, {
        name: data.name,
        ...(data.slug ? { slug: slugify(data.slug) } : {}),
        description: data.description ?? null,
        order: data.order,
        parentId: data.parentId ?? null,
      });
    } else {
      const existing = await repositories.categories.findAll();
      const taken = new Set(existing.map((category) => category.slug));
      const slug = await uniqueSlug(data.slug || data.name, async (candidate) =>
        taken.has(candidate),
      );
      await repositories.categories.create({
        name: data.name,
        slug,
        description: data.description ?? null,
        order: data.order,
        parentId: data.parentId ?? null,
      });
    }
  } catch {
    return { error: "No se pudo guardar la categoría." };
  }

  revalidateSite("/proyectos");
  redirect("/admin/categorias");
}

export async function removeCategory(formData: FormData) {
  await requireSession();
  const id = formData.get("id");
  if (typeof id !== "string") return;

  // Los proyectos no se borran: el esquema deja su categoría en NULL.
  await repositories.categories.delete(id);
  revalidateSite("/proyectos");
  redirect("/admin/categorias");
}

// ----------------------------------------------------------------- mensajes

export async function toggleMessageRead(formData: FormData) {
  await requireSession();
  const id = formData.get("id");
  const read = formData.get("read") === "true";
  if (typeof id !== "string") return;

  await repositories.contact.markAsRead(id, read);
  revalidatePath("/admin/mensajes");
  revalidatePath("/admin");
}

export async function removeMessage(formData: FormData) {
  await requireSession();
  const id = formData.get("id");
  if (typeof id !== "string") return;

  await repositories.contact.delete(id);
  revalidatePath("/admin/mensajes");
  revalidatePath("/admin");
}

// ------------------------------------------------------------------ ajustes

const SETTING_KEYS = [
  "contactEmail",
  "phone",
  "instagram",
  "whatsapp",
  "address",
] as const;

export async function saveSettings(
  _prev: ActionState,
  formData: FormData,
): Promise<ActionState> {
  await requireSession();

  const values: Record<string, string> = {};
  for (const key of SETTING_KEYS) {
    const value = formData.get(key);
    if (typeof value === "string") values[key] = value.trim();
  }

  try {
    await repositories.settings.setMany(values);
  } catch {
    return { error: "No se pudieron guardar los ajustes." };
  }

  revalidateSite();
  return { saved: true };
}
