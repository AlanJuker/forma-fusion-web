/**
 * Composición de dependencias.
 *
 * Único punto donde la aplicación conoce las implementaciones concretas. Las
 * rutas y Server Actions importan `repositories` y hablan solo con interfaces,
 * de modo que cambiar de Prisma a otra cosa se resuelve aquí.
 */

import {
  PrismaCategoryRepository,
  PrismaContactRepository,
  PrismaProjectRepository,
  PrismaSettingsRepository,
  PrismaUserRepository,
} from "@/infrastructure/persistence/prisma/repositories";
import type {
  CategoryRepository,
  ContactRepository,
  ProjectRepository,
  SettingsRepository,
  UserRepository,
} from "@/domain/repositories";

export interface Repositories {
  projects: ProjectRepository;
  categories: CategoryRepository;
  contact: ContactRepository;
  users: UserRepository;
  settings: SettingsRepository;
}

export const repositories: Repositories = {
  projects: new PrismaProjectRepository(),
  categories: new PrismaCategoryRepository(),
  contact: new PrismaContactRepository(),
  users: new PrismaUserRepository(),
  settings: new PrismaSettingsRepository(),
};
