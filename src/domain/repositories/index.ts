/**
 * Puertos (interfaces) de persistencia.
 *
 * El dominio y los casos de uso dependen únicamente de estas firmas; la
 * implementación concreta con Prisma vive en `src/infrastructure/persistence`.
 * Esto es lo que permite sustituir el ORM sin tocar la lógica de negocio.
 */

import type { Project, PublishState } from "../entities/project";
import type {
  Category,
  ContactMessage,
  NewsPost,
  Office,
  TeamMember,
  User,
} from "../entities/content";

export interface ProjectFilter {
  state?: PublishState;
  categorySlug?: string;
  featured?: boolean;
  search?: string;
  take?: number;
  skip?: number;
}

export interface ProjectInput {
  title: string;
  slug: string;
  location: string;
  year: number;
  size?: string | null;
  client?: string | null;
  collaborators?: string | null;
  status: Project["status"];
  state: PublishState;
  featured: boolean;
  order: number;
  excerpt?: string | null;
  description?: string | null;
  coverImage: string;
  categoryId?: string | null;
  images?: { url: string; caption?: string | null; alt?: string | null; order: number }[];
}

export interface ProjectRepository {
  findMany(filter?: ProjectFilter): Promise<Project[]>;
  count(filter?: ProjectFilter): Promise<number>;
  findBySlug(slug: string): Promise<Project | null>;
  findById(id: string): Promise<Project | null>;
  create(input: ProjectInput): Promise<Project>;
  update(id: string, input: Partial<ProjectInput>): Promise<Project>;
  delete(id: string): Promise<void>;
  slugExists(slug: string, exceptId?: string): Promise<boolean>;
}

export interface CategoryRepository {
  findTree(): Promise<Category[]>;
  findAll(): Promise<Category[]>;
  findBySlug(slug: string): Promise<Category | null>;
  create(input: Omit<Category, "id" | "children" | "projectCount">): Promise<Category>;
  update(id: string, input: Partial<Omit<Category, "id" | "children">>): Promise<Category>;
  delete(id: string): Promise<void>;
}

export interface NewsInput {
  title: string;
  slug: string;
  excerpt?: string | null;
  body?: string | null;
  coverImage?: string | null;
  state: PublishState;
  publishedAt?: Date | null;
}

export interface NewsRepository {
  findMany(filter?: { state?: PublishState; take?: number }): Promise<NewsPost[]>;
  findBySlug(slug: string): Promise<NewsPost | null>;
  findById(id: string): Promise<NewsPost | null>;
  create(input: NewsInput): Promise<NewsPost>;
  update(id: string, input: Partial<NewsInput>): Promise<NewsPost>;
  delete(id: string): Promise<void>;
}

export interface TeamRepository {
  findMany(onlyVisible?: boolean): Promise<TeamMember[]>;
  findById(id: string): Promise<TeamMember | null>;
  create(input: Omit<TeamMember, "id">): Promise<TeamMember>;
  update(id: string, input: Partial<Omit<TeamMember, "id">>): Promise<TeamMember>;
  delete(id: string): Promise<void>;
}

export interface OfficeRepository {
  findMany(): Promise<Office[]>;
  findById(id: string): Promise<Office | null>;
  create(input: Omit<Office, "id">): Promise<Office>;
  update(id: string, input: Partial<Omit<Office, "id">>): Promise<Office>;
  delete(id: string): Promise<void>;
}

export interface ContactRepository {
  findMany(filter?: { read?: boolean }): Promise<ContactMessage[]>;
  countUnread(): Promise<number>;
  create(
    input: Omit<ContactMessage, "id" | "read" | "createdAt">,
  ): Promise<ContactMessage>;
  markAsRead(id: string, read: boolean): Promise<ContactMessage>;
  delete(id: string): Promise<void>;
}

export interface UserRepository {
  findByEmail(email: string): Promise<(User & { passwordHash: string }) | null>;
  findById(id: string): Promise<User | null>;
  findMany(): Promise<User[]>;
  create(input: {
    email: string;
    name: string;
    passwordHash: string;
    role: User["role"];
  }): Promise<User>;
  delete(id: string): Promise<void>;
}

export interface SettingsRepository {
  getAll(): Promise<Record<string, string>>;
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<void>;
  setMany(values: Record<string, string>): Promise<void>;
}
