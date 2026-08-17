/** Entidades de dominio para el resto del contenido editorial del sitio. */

import type { PublishState } from "./project";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  order: number;
  parentId: string | null;
  children: Category[];
  projectCount?: number;
}

export interface NewsPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  body: string | null;
  coverImage: string | null;
  state: PublishState;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string | null;
  photo: string | null;
  email: string | null;
  order: number;
  visible: boolean;
}

export interface Office {
  id: string;
  city: string;
  address: string;
  country: string;
  phone: string | null;
  email: string | null;
  order: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  subject: string | null;
  message: string;
  read: boolean;
  createdAt: Date;
}

export type UserRole = "ADMIN" | "EDITOR";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
}

/** Aplana el árbol de categorías en una lista, preservando el orden jerárquico. */
export function flattenCategories(categories: Category[]): Category[] {
  return categories.flatMap((category) => [
    category,
    ...flattenCategories(category.children ?? []),
  ]);
}
