/**
 * Datos de demostración.
 *
 * Es idempotente: se puede ejecutar en cada despliegue sin duplicar registros.
 * Los proyectos son ficticios y las fotografías provienen de Unsplash; están
 * pensados para sustituirse por el material real del estudio desde /admin.
 */

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const img = (id: string, w = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

const CATEGORIES = [
  { slug: "arquitectura", name: "Arquitectura", order: 1, description: "Obra nueva, vivienda y equipamiento." },
  { slug: "interiorismo", name: "Interiorismo", order: 2, description: "Diseño interior y mobiliario a medida." },
  { slug: "comercial", name: "Comercial", order: 3, description: "Locales, oficinas y hostelería." },
  { slug: "remodelacion", name: "Remodelación", order: 4, description: "Intervención de espacios existentes." },
];

const PROJECTS = [
  {
    slug: "casa-cumbaya",
    title: "Casa Cumbayá",
    location: "Quito, Ecuador",
    year: 2025,
    size: "340 m²",
    client: "Privado",
    status: "COMPLETED" as const,
    category: "arquitectura",
    featured: true,
    order: 1,
    cover: img("photo-1600585154340-be6161a56a0c"),
    excerpt:
      "Una vivienda unifamiliar organizada alrededor de un patio central que resuelve la ventilación cruzada sin renunciar a la privacidad.",
    description:
      "El terreno, alargado y con una pendiente del 12%, obligaba a escoger entre vista y privacidad. La casa resuelve el conflicto plegándose sobre sí misma: los dormitorios miran a un patio interior y las áreas sociales se abren al valle.\n\nLa estructura combina hormigón visto en el zócalo con una envolvente ligera de madera de eucalipto tratada, elegida por disponibilidad local y por cómo envejece bajo el sol de altura.\n\nLa obra se ejecutó en once meses con el cliente residiendo en el país durante todo el proceso, lo que permitió ajustar acabados en sitio sin renegociar el presupuesto.",
    gallery: [
      { id: "photo-1600607687939-ce8a6c25118c", caption: "Patio central al atardecer" },
      { id: "photo-1600566753086-00f18fb6b3ea", caption: "Estar principal" },
      { id: "photo-1600210492486-724fe5c67fb0", caption: "Detalle de la escalera" },
    ],
  },
  {
    slug: "edificio-la-floresta",
    title: "Edificio La Floresta",
    location: "Quito, Ecuador",
    year: 2025,
    size: "1 850 m²",
    client: "Inmobiliaria Andes",
    status: "IN_PROGRESS" as const,
    category: "arquitectura",
    featured: true,
    order: 2,
    cover: img("photo-1486406146926-c627a92ad1ab"),
    excerpt:
      "Doce unidades de vivienda sobre planta comercial, con una fachada de celosía que regula el asoleamiento en la cara oeste.",
    description:
      "El encargo pedía maximizar unidades sin convertir la fachada oeste en un muro ciego. La solución fue una celosía de hormigón prefabricado cuyo paso varía según la altura: más cerrada en los pisos bajos, expuestos al ruido de la avenida, y más abierta arriba.\n\nLa planta baja se cedió al comercio de barrio, con locales de fondo reducido que mantienen actividad en la vereda durante todo el día.",
    gallery: [
      { id: "photo-1487958449943-2429e8be8625", caption: "Fachada oeste" },
      { id: "photo-1511818966892-d7d671e672a2", caption: "Vista desde la avenida" },
    ],
  },
  {
    slug: "oficinas-kuna",
    title: "Oficinas Kuna",
    location: "Guayaquil, Ecuador",
    year: 2024,
    size: "610 m²",
    client: "Kuna Group",
    status: "COMPLETED" as const,
    category: "comercial",
    featured: false,
    order: 3,
    cover: img("photo-1497366216548-37526070297c"),
    excerpt:
      "Reconversión de una bodega portuaria en oficinas abiertas, conservando la cercha metálica original.",
    description:
      "La nave tenía una cercha metálica de 1962 en buen estado que definía todo el carácter del espacio. En lugar de ocultarla tras un cielo raso, la dejamos vista y colgamos de ella las instalaciones y la iluminación.\n\nLos volúmenes cerrados —salas de reunión y servicios— se resolvieron como cajas independientes que no tocan la estructura, de modo que la intervención es reversible.",
    gallery: [
      { id: "photo-1497366811353-6870744d04b2", caption: "Área de trabajo" },
      { id: "photo-1524758631624-e2822e304c36", caption: "Sala de reuniones" },
    ],
  },
  {
    slug: "apartamento-gonzalez-suarez",
    title: "Apartamento González Suárez",
    location: "Quito, Ecuador",
    year: 2024,
    size: "180 m²",
    client: "Privado",
    status: "COMPLETED" as const,
    category: "interiorismo",
    featured: false,
    order: 4,
    cover: img("photo-1522708323590-d24dbb6b0267"),
    excerpt:
      "Remodelación integral de un apartamento de los años ochenta: se retiraron muros no estructurales para liberar la vista al valle.",
    description:
      "El apartamento estaba compartimentado en siete ambientes que bloqueaban por completo la vista hacia el valle de Cumbayá. Tras verificar con el cálculo estructural qué muros eran portantes, se eliminaron cuatro tabiques.\n\nEl mobiliario fijo se diseñó a medida en nogal y se fabricó en taller local. La cocina se integró al estar mediante una isla que también hace de comedor diario.",
    gallery: [
      { id: "photo-1502005229762-cf1b2da7c5d6", caption: "Estar y comedor" },
      { id: "photo-1493809842364-78817add7ffb", caption: "Cocina integrada" },
    ],
  },
  {
    slug: "cafe-nogal",
    title: "Café Nogal",
    location: "Cuenca, Ecuador",
    year: 2024,
    size: "95 m²",
    client: "Nogal Café",
    status: "COMPLETED" as const,
    category: "comercial",
    featured: false,
    order: 5,
    cover: img("photo-1586023492125-27b2c045efd7"),
    excerpt:
      "Local de cafetería en el centro histórico, resuelto con mobiliario desmontable por tratarse de un inmueble patrimonial.",
    description:
      "Al tratarse de un inmueble inventariado, ninguna intervención podía anclarse a los muros originales de adobe. Todo el programa —barra, estanterías, asientos— se resolvió como piezas exentas apoyadas en el piso.\n\nLa iluminación se colgó de una estructura autoportante de tubo negro que recorre el local sin tocar el artesonado.",
    gallery: [
      { id: "photo-1616486338812-3dadae4b4ace", caption: "Barra principal" },
    ],
  },
  {
    slug: "casa-patio-samborondon",
    title: "Casa Patio Samborondón",
    location: "Samborondón, Ecuador",
    year: 2026,
    size: "410 m²",
    client: "Privado",
    status: "CONCEPT" as const,
    category: "arquitectura",
    featured: false,
    order: 6,
    cover: img("photo-1580587771525-78b9dba3b914"),
    excerpt:
      "Anteproyecto de vivienda en clima cálido húmedo: cubierta ventilada y galerías perimetrales como estrategia pasiva.",
    description:
      "En Samborondón el problema no es el frío sino la humedad y la radiación. El anteproyecto plantea una cubierta a dos aguas con cámara ventilada y galerías perimetrales de 2,4 m que mantienen los muros en sombra durante todo el día.\n\nEl proyecto se encuentra en fase de aprobación municipal.",
    gallery: [
      { id: "photo-1600047509807-ba8f99d2cdde", caption: "Vista preliminar" },
    ],
  },
  {
    slug: "loft-industrial-norte",
    title: "Loft Industrial Norte",
    location: "Quito, Ecuador",
    year: 2023,
    size: "150 m²",
    client: "Privado",
    status: "COMPLETED" as const,
    category: "remodelacion",
    featured: false,
    order: 7,
    cover: img("photo-1600573472550-8090b5e0745e"),
    excerpt:
      "Un antiguo taller mecánico convertido en vivienda-estudio, manteniendo el portón original como fachada.",
    description:
      "El encargo era convertir un taller de 150 m² en vivienda para una pareja que trabaja desde casa. Se conservó el portón metálico original, que ahora funciona como segunda piel sobre un cerramiento acristalado.\n\nEl entrepiso de estructura metálica alberga el dormitorio y libera la planta baja para el estudio.",
    gallery: [
      { id: "photo-1600607687939-ce8a6c25118c", caption: "Doble altura" },
    ],
  },
  {
    slug: "showroom-materia",
    title: "Showroom Materia",
    location: "Guayaquil, Ecuador",
    year: 2023,
    size: "230 m²",
    client: "Materia Acabados",
    status: "COMPLETED" as const,
    category: "interiorismo",
    featured: false,
    order: 8,
    cover: img("photo-1600489000022-c2086d79f9d4"),
    excerpt:
      "Sala de exhibición de acabados donde el propio local funciona como muestrario a escala real.",
    description:
      "El cliente vendía acabados en catálogo y perdía ventas porque los compradores no lograban imaginar el material aplicado. El showroom se diseñó como una secuencia de ambientes completos donde cada superficie es producto en venta.\n\nUn sistema de paneles rotatorios permite recambiar la exhibición sin obra.",
    gallery: [
      { id: "photo-1615874959474-d609969a20ed", caption: "Recorrido de exhibición" },
    ],
  },
];

const TEAM = [
  {
    name: "Ana Belén Cárdenas",
    role: "Arquitecta fundadora",
    bio: "Dirige el área de diseño. Diez años entre obra y proyecto en Quito.",
    photo: img("photo-1494790108377-be9c29b29330", 800),
    order: 1,
  },
  {
    name: "Mateo Villacís",
    role: "Director de construcción",
    bio: "Responsable de presupuestos, cronogramas y coordinación de gremios.",
    photo: img("photo-1500648767791-00dcc994a43e", 800),
    order: 2,
  },
  {
    name: "Daniela Ruiz",
    role: "Interiorismo",
    bio: "Especificación de materiales, mobiliario a medida e iluminación.",
    photo: img("photo-1438761681033-6461ffad8d80", 800),
    order: 3,
  },
  {
    name: "Sebastián Ortega",
    role: "Residente de obra",
    bio: "Control de calidad y avances en sitio.",
    photo: img("photo-1507003211169-0a1dd7228f2d", 800),
    order: 4,
  },
];

const NEWS = [
  {
    slug: "avance-edificio-la-floresta",
    title: "Edificio La Floresta alcanza el 60% de avance",
    excerpt:
      "La estructura está completa hasta el quinto nivel y comienza el montaje de la celosía de fachada.",
    body: "El proyecto residencial en La Floresta completó la estructura hasta el quinto nivel dentro del plazo previsto.\n\nEsta semana inicia el montaje de los paneles prefabricados de celosía en la fachada oeste, la pieza que define el carácter del edificio y su comportamiento térmico.\n\nLa entrega está prevista para el segundo trimestre de 2026.",
    cover: img("photo-1486406146926-c627a92ad1ab"),
    daysAgo: 12,
  },
  {
    slug: "casa-cumbaya-entregada",
    title: "Entregamos Casa Cumbayá",
    excerpt:
      "Once meses de obra para una vivienda de 340 m² organizada alrededor de un patio central.",
    body: "Casa Cumbayá fue entregada a sus propietarios tras once meses de construcción, dentro del cronograma y con una variación de presupuesto inferior al 4%.\n\nEl proyecto integró diseño arquitectónico, interiorismo y ejecución bajo el mismo equipo, lo que permitió resolver en sitio los ajustes de acabados sin órdenes de cambio.",
    cover: img("photo-1600585154340-be6161a56a0c"),
    daysAgo: 45,
  },
  {
    slug: "abrimos-agenda-2026",
    title: "Abrimos agenda de proyectos 2026",
    excerpt:
      "Recibimos consultas para anteproyectos con inicio de obra a partir de marzo.",
    body: "Estamos recibiendo consultas para proyectos con inicio de obra a partir de marzo de 2026.\n\nEl proceso arranca con una conversación sin costo donde revisamos uso, terreno y presupuesto disponible antes de emitir una propuesta de alcance y honorarios.",
    cover: img("photo-1503387762-592deb58ef4e"),
    daysAgo: 70,
  },
];

async function main() {
  console.log("Sembrando datos de demostración…");

  // --- Usuario administrador -------------------------------------------------
  const email = (process.env.ADMIN_EMAIL ?? "admin@formafusion.ec").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "FormaFusion2026!";
  const passwordHash = await bcrypt.hash(password, 12);

  await prisma.user.upsert({
    where: { email },
    update: {},
    create: { email, name: "Administración", passwordHash, role: "ADMIN" },
  });
  console.log(`  Usuario administrador: ${email}`);

  // --- Categorías ------------------------------------------------------------
  const categoryIds = new Map<string, string>();
  for (const category of CATEGORIES) {
    const row = await prisma.category.upsert({
      where: { slug: category.slug },
      update: { name: category.name, order: category.order },
      create: category,
    });
    categoryIds.set(category.slug, row.id);
  }
  console.log(`  ${CATEGORIES.length} categorías`);

  // --- Proyectos -------------------------------------------------------------
  for (const project of PROJECTS) {
    const data = {
      title: project.title,
      location: project.location,
      year: project.year,
      size: project.size,
      client: project.client,
      status: project.status,
      state: "PUBLISHED" as const,
      featured: project.featured,
      order: project.order,
      excerpt: project.excerpt,
      description: project.description,
      coverImage: project.cover,
      categoryId: categoryIds.get(project.category) ?? null,
    };

    const row = await prisma.project.upsert({
      where: { slug: project.slug },
      update: data,
      create: { ...data, slug: project.slug },
    });

    // La galería se regenera para que el seed sea idempotente.
    await prisma.projectImage.deleteMany({ where: { projectId: row.id } });
    await prisma.projectImage.createMany({
      data: project.gallery.map((image, index) => ({
        projectId: row.id,
        url: img(image.id),
        caption: image.caption,
        alt: `${project.title} — ${image.caption}`,
        order: index,
      })),
    });
  }
  console.log(`  ${PROJECTS.length} proyectos`);

  // --- Equipo ----------------------------------------------------------------
  for (const member of TEAM) {
    const existing = await prisma.teamMember.findFirst({
      where: { name: member.name },
    });
    if (existing) {
      await prisma.teamMember.update({ where: { id: existing.id }, data: member });
    } else {
      await prisma.teamMember.create({ data: member });
    }
  }
  console.log(`  ${TEAM.length} miembros del equipo`);

  // --- Noticias --------------------------------------------------------------
  for (const post of NEWS) {
    const publishedAt = new Date(Date.now() - post.daysAgo * 86_400_000);
    const data = {
      title: post.title,
      excerpt: post.excerpt,
      body: post.body,
      coverImage: post.cover,
      state: "PUBLISHED" as const,
      publishedAt,
    };
    await prisma.newsPost.upsert({
      where: { slug: post.slug },
      update: data,
      create: { ...data, slug: post.slug },
    });
  }
  console.log(`  ${NEWS.length} noticias`);

  // --- Oficinas --------------------------------------------------------------
  const OFFICES = [
    {
      city: "Quito",
      address: "Av. Portugal y República de El Salvador",
      country: "Ecuador",
      phone: "+593 99 000 0000",
      email: "quito@formafusion.ec",
      order: 1,
    },
    {
      city: "Guayaquil",
      address: "Km 1.5 vía Samborondón, Edificio Xima",
      country: "Ecuador",
      phone: "+593 99 000 0001",
      email: "guayaquil@formafusion.ec",
      order: 2,
    },
  ];

  for (const office of OFFICES) {
    const existing = await prisma.office.findFirst({ where: { city: office.city } });
    if (existing) {
      await prisma.office.update({ where: { id: existing.id }, data: office });
    } else {
      await prisma.office.create({ data: office });
    }
  }
  console.log(`  ${OFFICES.length} oficinas`);

  // --- Ajustes del sitio -----------------------------------------------------
  const SETTINGS: Record<string, string> = {
    contactEmail: "hola@formafusion.ec",
    phone: "+593 99 000 0000",
    instagram: "https://www.instagram.com/formafusion.ec/",
    whatsapp: "https://wa.me/message/3I4U25IBEAMUO1",
    footerTagline: "Diseñamos y construimos espacios que perduran.",
  };

  for (const [key, value] of Object.entries(SETTINGS)) {
    await prisma.siteSetting.upsert({
      where: { key },
      create: { key, value },
      update: { value },
    });
  }

  // --- Un mensaje de ejemplo para que el panel no aparezca vacío -------------
  const messageCount = await prisma.contactMessage.count();
  if (messageCount === 0) {
    await prisma.contactMessage.create({
      data: {
        name: "Carolina Mendoza",
        email: "carolina.mendoza@example.com",
        phone: "+593 98 765 4321",
        subject: "Remodelación de departamento",
        message:
          "Buenos días. Tengo un departamento de 120 m² en el norte de Quito y quisiera remodelar cocina y baños. ¿Podrían darme una idea de plazos y presupuesto referencial? Gracias.",
      },
    });
  }

  console.log("Listo.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
