/**
 * Traducción entre los modelos de Prisma y las entidades de dominio.
 * Aísla al dominio de los tipos generados por el ORM.
 */

import type {
  Category as PrismaCategory,
  ContactMessage as PrismaContact,
  NewsPost as PrismaNews,
  Office as PrismaOffice,
  Project as PrismaProject,
  ProjectImage as PrismaProjectImage,
  TeamMember as PrismaTeam,
  User as PrismaUser,
} from "@prisma/client";

import type { Project } from "@/domain/entities/project";
import type {
  Category,
  ContactMessage,
  NewsPost,
  Office,
  TeamMember,
  User,
} from "@/domain/entities/content";

type PrismaProjectFull = PrismaProject & {
  category?: PrismaCategory | null;
  images?: PrismaProjectImage[];
};

export function toProject(row: PrismaProjectFull): Project {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    location: row.location,
    year: row.year,
    size: row.size,
    client: row.client,
    collaborators: row.collaborators,
    status: row.status,
    state: row.state,
    featured: row.featured,
    order: row.order,
    excerpt: row.excerpt,
    description: row.description,
    coverImage: row.coverImage,
    category: row.category
      ? { id: row.category.id, name: row.category.name, slug: row.category.slug }
      : null,
    images: (row.images ?? [])
      .slice()
      .sort((a, b) => a.order - b.order)
      .map((image) => ({
        id: image.id,
        url: image.url,
        caption: image.caption,
        alt: image.alt,
        order: image.order,
      })),
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

type PrismaCategoryTree = PrismaCategory & {
  children?: PrismaCategoryTree[];
  _count?: { projects: number };
};

export function toCategory(row: PrismaCategoryTree): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    order: row.order,
    parentId: row.parentId,
    children: (row.children ?? []).map(toCategory),
    projectCount: row._count?.projects,
  };
}

export function toNews(row: PrismaNews): NewsPost {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    body: row.body,
    coverImage: row.coverImage,
    state: row.state,
    publishedAt: row.publishedAt,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function toTeamMember(row: PrismaTeam): TeamMember {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    bio: row.bio,
    photo: row.photo,
    email: row.email,
    order: row.order,
    visible: row.visible,
  };
}

export function toOffice(row: PrismaOffice): Office {
  return {
    id: row.id,
    city: row.city,
    address: row.address,
    country: row.country,
    phone: row.phone,
    email: row.email,
    order: row.order,
  };
}

export function toContactMessage(row: PrismaContact): ContactMessage {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    phone: row.phone,
    subject: row.subject,
    message: row.message,
    read: row.read,
    createdAt: row.createdAt,
  };
}

export function toUser(row: PrismaUser): User {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    role: row.role,
    createdAt: row.createdAt,
  };
}
