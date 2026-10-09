/**
 * Contenido del sitio.
 *
 * Los textos y los proyectos provienen del documento del estudio; las
 * fotografías, del mismo documento, y viven en `public/proyectos`.
 *
 * El seed corre en cada arranque. Para no pisar lo que se edite desde /admin,
 * solo actúa cuando el contenido publicado no corresponde a esta revisión: se
 * compara `contentVersion` en los ajustes del sitio. Al subirla, el siguiente
 * despliegue reemplaza el catálogo; después, deja de tocarlo.
 */

import { PrismaClient, type ProjectStatus } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

/** Súbela cuando cambien los textos o los proyectos de este archivo. */
const CONTENT_VERSION = "2026-08-doc-3";

const CATEGORIES = [
  { slug: "residencia-unifamiliar", name: "Residencia unifamiliar", order: 1 },
  {
    slug: "remodelacion-y-adecuacion-comercial",
    name: "Remodelación y adecuación comercial",
    order: 2,
  },
];

interface SeedProject {
  slug: string;
  title: string;
  category: string;
  location: string;
  year: number;
  size: string;
  status: ProjectStatus;
  /** Menor primero. El listado arranca por el trabajo más reciente. */
  order: number;
  featured: boolean;
  /** Zona de la portada que se conserva al recortarla; ver `coverPosition`. */
  coverPosition: "center" | "top" | "bottom";
  excerpt: string;
  description: string;
  /** Número de fotografías disponibles en `public/proyectos` con este prefijo. */
  images: number;
}

const PROJECTS: SeedProject[] = [
  {
    slug: "ff-01",
    title: "F&F-01",
    category: "remodelacion-y-adecuacion-comercial",
    location: "Riobamba, Ecuador",
    year: 2025,
    size: "70 m²",
    status: "IN_OPERATION",
    order: 5,
    featured: false,
    coverPosition: "top",
    excerpt:
      "Una intervención que transforma un inmueble existente en un activo capaz de generar nuevos ingresos.",
    description:
      "Una intervención que transforma un inmueble existente en un activo capaz de generar nuevos ingresos.",
    images: 2,
  },
  {
    slug: "ff-02",
    title: "F&F-02",
    category: "residencia-unifamiliar",
    location: "Guano, Ecuador",
    year: 2024,
    size: "190 m²",
    status: "DELIVERED",
    order: 4,
    featured: false,
    coverPosition: "center",
    excerpt:
      "Vivienda de dos plantas, diseñada para combinar amplitud, funcionalidad y confort.",
    description:
      "Vivienda de dos plantas, diseñada para combinar amplitud, funcionalidad y confort. La planta baja integra una amplia sala, comedor, cocina con alacena, baño social, lavandería y área de BBQ, además de un garaje para cuatro vehículos y un amplio jardín.\n\nLa planta alta cuenta con dos dormitorios con baño compartido, sala de televisión y un dormitorio máster con balcón, vestidor y baño privado con jacuzzi. La propuesta se complementa con una cubierta inclinada, que aporta identidad y equilibrio a la expresión contemporánea de la vivienda.",
    images: 17,
  },
  {
    slug: "ff-03",
    title: "F&F-03",
    category: "remodelacion-y-adecuacion-comercial",
    location: "Riobamba, Ecuador",
    year: 2024,
    size: "500 m²",
    status: "IN_OPERATION",
    order: 3,
    featured: false,
    coverPosition: "center",
    excerpt:
      "Intervención de una vivienda antigua para convertirla en dos oficinas comerciales, conservando la fachada patrimonial.",
    description:
      "Intervención de una vivienda antigua para convertirla en dos oficinas comerciales de 120 m² cada una, desarrolladas en dos niveles mediante mezzanines. Se conservó y restauró la fachada patrimonial, integrando el carácter original del inmueble con una nueva funcionalidad comercial. El proyecto cuenta además con 200 m² de parqueadero.",
    images: 1,
  },
  {
    slug: "ff-04",
    title: "F&F-04",
    category: "residencia-unifamiliar",
    location: "Guano, Ecuador",
    year: 2024,
    size: "130 m²",
    status: "DELIVERED",
    order: 2,
    featured: false,
    coverPosition: "center",
    excerpt:
      "Vivienda de dos plantas y terraza, diseñada para integrar funcionalidad y confort.",
    description:
      "Vivienda de dos plantas y terraza, diseñada para integrar funcionalidad y confort. La planta baja cuenta con sala, comedor, cocina, baño social y estudio. La planta alta incorpora tres dormitorios: un dormitorio máster y dos dormitorios con baño compartido. El proyecto contempla garaje para dos vehículos, patio posterior y área de lavandería en terraza.",
    images: 1,
  },
  {
    slug: "lumen",
    title: "LUMEN",
    category: "residencia-unifamiliar",
    location: "Guano, Ecuador",
    year: 2026,
    size: "170 m²",
    status: "FOR_SALE",
    order: 1,
    featured: false,
    coverPosition: "center",
    excerpt:
      "Vivienda de dos plantas y terraza, diseñada para integrar funcionalidad, amplitud y confort.",
    description:
      "Vivienda de dos plantas y terraza, diseñada para integrar funcionalidad, amplitud y confort. La planta baja cuenta con hall de ingreso, sala, comedor, cocina, alacena, baño social, bodega y dos garajes.\n\nLa planta alta incorpora tres dormitorios máster, cada uno con clóset y baño privado, ofreciendo independencia y privacidad. La terraza complementa la vivienda con un área de BBQ y lavandería.",
    images: 9,
  },
];

const SETTINGS: Record<string, string> = {
  contactEmail: "",
  phone: "",
  instagram: "https://www.instagram.com/formafusion.ec/",
  whatsapp: "https://wa.me/message/3I4U25IBEAMUO1",
  address: "Riobamba, Ecuador",
};

const imagePath = (slug: string, index: number) =>
  `/proyectos/${slug}-${String(index).padStart(2, "0")}.jpg`;

async function ensureAdminUser() {
  const email = (process.env.ADMIN_EMAIL ?? "admin@formafusion.ec").toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!password) throw new Error("Falta ADMIN_PASSWORD para crear el usuario administrador.");
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Administración", passwordHash, role: "ADMIN" },
  });
  console.log(`  Usuario administrador: ${email}`);
}

async function main() {
  // Se asegura siempre: sin él nadie podría entrar al panel en una base nueva.
  await ensureAdminUser();

  const current = await prisma.siteSetting.findUnique({
    where: { key: "contentVersion" },
  });
  if (current?.value === CONTENT_VERSION) {
    console.log("  Contenido ya al día; no se toca nada.");
    return;
  }

  console.log("Publicando el contenido del estudio…");

  // Categorías
  const categoryIds = new Map<string, string>();
  for (const category of CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, order: category.order },
      create: category,
    });
    categoryIds.set(category.slug, row.id);
  }

  // Los proyectos que no pertenecen a esta revisión (los de demostración de la
  // primera versión del sitio) se retiran.
  const keep = PROJECTS.map((p) => p.slug);
  const removed = await prisma.project.deleteMany({
    where: { slug: { notIn: keep } },
  });
  if (removed.count > 0) console.log(`  ${removed.count} proyectos antiguos retirados`);

  for (const project of PROJECTS) {
    const data = {
      title: project.title,
      location: project.location,
      year: project.year,
      size: project.size,
      status: project.status,
      state: "PUBLISHED" as const,
      featured: project.featured,
      order: project.order,
      excerpt: project.excerpt,
      description: project.description,
      coverImage: imagePath(project.slug, 1),
      coverPosition: project.coverPosition,
      categoryId: categoryIds.get(project.category) ?? null,
    };

    const row = await prisma.project.upsert({
      where: { slug: project.slug },
      update: data,
      create: { ...data, slug: project.slug },
    });

    // La galería se regenera entera para que el seed sea idempotente. La
    // portada es la primera fotografía, así que la galería empieza en la
    // segunda y no se repite la imagen de cabecera.
    await prisma.projectImage.deleteMany({ where: { projectId: row.id } });
    if (project.images > 1) {
      await prisma.projectImage.createMany({
        data: Array.from({ length: project.images - 1 }, (_, i) => ({
          projectId: row.id,
          url: imagePath(project.slug, i + 2),
          caption: null,
          alt: `${project.title} — ${project.location}`,
          order: i,
        })),
      });
    }
  }
  console.log(`  ${PROJECTS.length} proyectos publicados`);

  // Ajustes: solo se rellenan los que aún no tengan valor, para no pisar lo
  // que se haya escrito desde /admin.
  for (const [key, value] of Object.entries(SETTINGS)) {
    if (!value) continue;
    await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: {},
    });
  }

  await prisma.siteSetting.upsert({
    where: { key: "contentVersion" },
    create: { key: "contentVersion", value: CONTENT_VERSION },
    update: { value: CONTENT_VERSION },
  });

  console.log("Listo.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
