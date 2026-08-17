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
  PrismaNewsRepository,
  PrismaOfficeRepository,
  PrismaProjectRepository,
  PrismaSettingsRepository,
  PrismaTeamRepository,
  PrismaUserRepository,
} from "@/infrastructure/persistence/prisma/repositories";
import type {
  CategoryRepository,
  ContactRepository,
  NewsRepository,
  OfficeRepository,
  ProjectRepository,
  SettingsRepository,
  TeamRepository,
  UserRepository,
} from "@/domain/repositories";

export interface Repositories {
  projects: ProjectRepository;
  categories: CategoryRepository;
  news: NewsRepository;
  team: TeamRepository;
  offices: OfficeRepository;
  contact: ContactRepository;
  users: UserRepository;
  settings: SettingsRepository;
}

export const repositories: Repositories = {
  projects: new PrismaProjectRepository(),
  categories: new PrismaCategoryRepository(),
  news: new PrismaNewsRepository(),
  team: new PrismaTeamRepository(),
  offices: new PrismaOfficeRepository(),
  contact: new PrismaContactRepository(),
  users: new PrismaUserRepository(),
  settings: new PrismaSettingsRepository(),
};
