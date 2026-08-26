/** Implementaciones Prisma de los puertos declarados en `src/domain/repositories`. */

import type { Prisma } from "@prisma/client";

import type { Project } from "@/domain/entities/project";
import type { Category, ContactMessage, User } from "@/domain/entities/content";
import type {
  CategoryRepository,
  ContactRepository,
  ProjectFilter,
  ProjectInput,
  ProjectRepository,
  SettingsRepository,
  UserRepository,
} from "@/domain/repositories";

import { prisma } from "./client";
import { toCategory, toContactMessage, toProject, toUser } from "./mappers";

const projectInclude = {
  category: true,
  images: { orderBy: { order: "asc" } },
} satisfies Prisma.ProjectInclude;

function projectWhere(filter: ProjectFilter = {}): Prisma.ProjectWhereInput {
  const where: Prisma.ProjectWhereInput = {};
  if (filter.state) where.state = filter.state;
  if (filter.featured !== undefined) where.featured = filter.featured;
  if (filter.categorySlug) where.category = { slug: filter.categorySlug };
  if (filter.search) {
    where.OR = [
      { title: { contains: filter.search, mode: "insensitive" } },
      { location: { contains: filter.search, mode: "insensitive" } },
      { excerpt: { contains: filter.search, mode: "insensitive" } },
    ];
  }
  return where;
}

export class PrismaProjectRepository implements ProjectRepository {
  async findMany(filter: ProjectFilter = {}): Promise<Project[]> {
    const rows = await prisma.project.findMany({
      where: projectWhere(filter),
      include: projectInclude,
      orderBy: [{ featured: "desc" }, { order: "asc" }, { year: "desc" }],
      take: filter.take,
      skip: filter.skip,
    });
    return rows.map(toProject);
  }

  async count(filter: ProjectFilter = {}): Promise<number> {
    return prisma.project.count({ where: projectWhere(filter) });
  }

  async findBySlug(slug: string): Promise<Project | null> {
    const row = await prisma.project.findUnique({
      where: { slug },
      include: projectInclude,
    });
    return row ? toProject(row) : null;
  }

  async findById(id: string): Promise<Project | null> {
    const row = await prisma.project.findUnique({
      where: { id },
      include: projectInclude,
    });
    return row ? toProject(row) : null;
  }

  async create(input: ProjectInput): Promise<Project> {
    const { images, categoryId, ...rest } = input;
    const row = await prisma.project.create({
      data: {
        ...rest,
        categoryId: categoryId || null,
        images: images?.length
          ? {
              create: images.map((image, index) => ({
                url: image.url,
                caption: image.caption ?? null,
                alt: image.alt ?? null,
                order: image.order ?? index,
              })),
            }
          : undefined,
      },
      include: projectInclude,
    });
    return toProject(row);
  }

  async update(id: string, input: Partial<ProjectInput>): Promise<Project> {
    const { images, categoryId, ...rest } = input;
    // La galería se reemplaza por completo: es más simple y predecible que
    // intentar un diff parcial desde el formulario del admin.
    const row = await prisma.$transaction(async (tx) => {
      if (images) {
        await tx.projectImage.deleteMany({ where: { projectId: id } });
      }
      return tx.project.update({
        where: { id },
        data: {
          ...rest,
          ...(categoryId !== undefined ? { categoryId: categoryId || null } : {}),
          ...(images?.length
            ? {
                images: {
                  create: images.map((image, index) => ({
                    url: image.url,
                    caption: image.caption ?? null,
                    alt: image.alt ?? null,
                    order: image.order ?? index,
                  })),
                },
              }
            : {}),
        },
        include: projectInclude,
      });
    });
    return toProject(row);
  }

  async delete(id: string): Promise<void> {
    await prisma.project.delete({ where: { id } });
  }

  async slugExists(slug: string, exceptId?: string): Promise<boolean> {
    const row = await prisma.project.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!row) return false;
    return exceptId ? row.id !== exceptId : true;
  }
}

export class PrismaCategoryRepository implements CategoryRepository {
  async findTree(): Promise<Category[]> {
    const rows = await prisma.category.findMany({
      where: { parentId: null },
      orderBy: { order: "asc" },
      include: {
        _count: { select: { projects: true } },
        children: {
          orderBy: { order: "asc" },
          include: { _count: { select: { projects: true } } },
        },
      },
    });
    return rows.map(toCategory);
  }

  async findAll(): Promise<Category[]> {
    const rows = await prisma.category.findMany({
      orderBy: { order: "asc" },
      include: { _count: { select: { projects: true } } },
    });
    return rows.map(toCategory);
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const row = await prisma.category.findUnique({
      where: { slug },
      include: { _count: { select: { projects: true } } },
    });
    return row ? toCategory(row) : null;
  }

  async create(
    input: Omit<Category, "id" | "children" | "projectCount">,
  ): Promise<Category> {
    const row = await prisma.category.create({
      data: {
        name: input.name,
        slug: input.slug,
        description: input.description ?? null,
        order: input.order,
        parentId: input.parentId || null,
      },
    });
    return toCategory(row);
  }

  async update(
    id: string,
    input: Partial<Omit<Category, "id" | "children">>,
  ): Promise<Category> {
    const row = await prisma.category.update({
      where: { id },
      data: {
        ...(input.name !== undefined ? { name: input.name } : {}),
        ...(input.slug !== undefined ? { slug: input.slug } : {}),
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
        ...(input.order !== undefined ? { order: input.order } : {}),
        ...(input.parentId !== undefined
          ? { parentId: input.parentId || null }
          : {}),
      },
    });
    return toCategory(row);
  }

  async delete(id: string): Promise<void> {
    await prisma.category.delete({ where: { id } });
  }
}




export class PrismaContactRepository implements ContactRepository {
  async findMany(filter: { read?: boolean } = {}): Promise<ContactMessage[]> {
    const rows = await prisma.contactMessage.findMany({
      where: filter.read !== undefined ? { read: filter.read } : {},
      orderBy: { createdAt: "desc" },
    });
    return rows.map(toContactMessage);
  }

  async countUnread(): Promise<number> {
    return prisma.contactMessage.count({ where: { read: false } });
  }

  async create(
    input: Omit<ContactMessage, "id" | "read" | "createdAt">,
  ): Promise<ContactMessage> {
    const row = await prisma.contactMessage.create({ data: input });
    return toContactMessage(row);
  }

  async markAsRead(id: string, read: boolean): Promise<ContactMessage> {
    const row = await prisma.contactMessage.update({
      where: { id },
      data: { read },
    });
    return toContactMessage(row);
  }

  async delete(id: string): Promise<void> {
    await prisma.contactMessage.delete({ where: { id } });
  }
}

export class PrismaUserRepository implements UserRepository {
  async findByEmail(
    email: string,
  ): Promise<(User & { passwordHash: string }) | null> {
    const row = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });
    return row ? { ...toUser(row), passwordHash: row.passwordHash } : null;
  }

  async findById(id: string): Promise<User | null> {
    const row = await prisma.user.findUnique({ where: { id } });
    return row ? toUser(row) : null;
  }

  async findMany(): Promise<User[]> {
    const rows = await prisma.user.findMany({ orderBy: { createdAt: "asc" } });
    return rows.map(toUser);
  }

  async create(input: {
    email: string;
    name: string;
    passwordHash: string;
    role: User["role"];
  }): Promise<User> {
    const row = await prisma.user.create({
      data: { ...input, email: input.email.toLowerCase() },
    });
    return toUser(row);
  }

  async delete(id: string): Promise<void> {
    await prisma.user.delete({ where: { id } });
  }
}

export class PrismaSettingsRepository implements SettingsRepository {
  async getAll(): Promise<Record<string, string>> {
    const rows = await prisma.siteSetting.findMany();
    return Object.fromEntries(rows.map((row) => [row.key, row.value]));
  }

  async get(key: string): Promise<string | null> {
    const row = await prisma.siteSetting.findUnique({ where: { key } });
    return row?.value ?? null;
  }

  async set(key: string, value: string): Promise<void> {
    await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }

  async setMany(values: Record<string, string>): Promise<void> {
    await prisma.$transaction(
      Object.entries(values).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          create: { key, value },
          update: { value },
        }),
      ),
    );
  }
}
