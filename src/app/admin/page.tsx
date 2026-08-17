import Link from "next/link";

import { requireSession } from "@/infrastructure/auth/guard";
import { repositories } from "@/infrastructure/config/container";
import { Card, PageHeader, StatePill } from "@/presentation/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const session = await requireSession();

  const [projects, drafts, news, team, messages, unread, categories] =
    await Promise.all([
      repositories.projects.count(),
      repositories.projects.count({ state: "DRAFT" }),
      repositories.news.findMany(),
      repositories.team.findMany(),
      repositories.contact.findMany(),
      repositories.contact.countUnread(),
      repositories.categories.findAll(),
    ]);

  const stats = [
    { label: "Proyectos", value: projects, href: "/admin/proyectos" },
    { label: "Borradores", value: drafts, href: "/admin/proyectos" },
    { label: "Noticias", value: news.length, href: "/admin/noticias" },
    { label: "Categorías", value: categories.length, href: "/admin/categorias" },
    { label: "Equipo", value: team.length, href: "/admin/equipo" },
    { label: "Sin leer", value: unread, href: "/admin/mensajes" },
  ];

  const recentProjects = await repositories.projects.findMany({ take: 5 });

  return (
    <>
      <PageHeader
        title={`Hola, ${session.name.split(" ")[0]}`}
        description="Resumen del contenido publicado en el sitio."
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-6">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="p-4 transition-colors hover:border-ink">
              <p className="text-[32px] leading-none tracking-[-0.03em]">
                {String(stat.value).padStart(2, "0")}
              </p>
              <p className="ui-label mt-2 text-grey-400">{stat.label}</p>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="ui-label text-grey-500">Proyectos recientes</h2>
            <Link href="/admin/proyectos" className="ui-label link-underline">
              Ver todos
            </Link>
          </div>
          <Card>
            {recentProjects.length === 0 ? (
              <p className="p-6 text-grey-500">Todavía no hay proyectos.</p>
            ) : (
              <ul>
                {recentProjects.map((project) => (
                  <li
                    key={project.id}
                    className="flex items-center justify-between gap-3 border-b border-grey-200 px-4 py-3 last:border-b-0"
                  >
                    <div className="min-w-0">
                      <Link
                        href={`/admin/proyectos/${project.id}`}
                        className="link-underline block truncate text-[14px]"
                      >
                        {project.title}
                      </Link>
                      <p className="text-meta text-grey-500">
                        {project.location} — {project.year}
                      </p>
                    </div>
                    <StatePill state={project.state} />
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="ui-label text-grey-500">Mensajes recientes</h2>
            <Link href="/admin/mensajes" className="ui-label link-underline">
              Ver todos
            </Link>
          </div>
          <Card>
            {messages.length === 0 ? (
              <p className="p-6 text-grey-500">No hay mensajes todavía.</p>
            ) : (
              <ul>
                {messages.slice(0, 5).map((message) => (
                  <li
                    key={message.id}
                    className="border-b border-grey-200 px-4 py-3 last:border-b-0"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="truncate text-[14px]">
                        {message.name}
                        {!message.read && (
                          <span className="ui-label ml-2 bg-ink px-1.5 py-0.5 text-paper">
                            Nuevo
                          </span>
                        )}
                      </p>
                      <span className="ui-label shrink-0 text-grey-400">
                        {new Intl.DateTimeFormat("es-EC", {
                          day: "2-digit",
                          month: "2-digit",
                        }).format(message.createdAt)}
                      </span>
                    </div>
                    <p className="text-meta mt-1 line-clamp-1 text-grey-500">
                      {message.message}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </section>
      </div>
    </>
  );
}
