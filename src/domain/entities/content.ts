/** Entidades de dominio del resto del contenido del sitio. */

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
