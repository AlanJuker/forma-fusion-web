import Image from "next/image";
import Link from "next/link";

import { requireSession } from "@/infrastructure/auth/guard";
import { repositories } from "@/infrastructure/config/container";
import {
  Card,
  EmptyState,
  PageHeader,
  StatePill,
} from "@/presentation/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  await requireSession();
  const projects = await repositories.projects.findMany();

  return (
    <>
      <PageHeader
        title="Proyectos"
        description={`${projects.length} proyectos en total.`}
        action={{ href: "/admin/proyectos/nuevo", label: "Nuevo proyecto" }}
      />

      {projects.length === 0 ? (
        <EmptyState
          message="Aún no has creado ningún proyecto."
          action={
            <Link href="/admin/proyectos/nuevo" className="ui-label link-underline">
              Crear el primero &#8594;
            </Link>
          }
        />
      ) : (
        <Card>
          <ul>
            {projects.map((project) => (
              <li
                key={project.id}
                className="flex items-center gap-4 border-b border-grey-200 px-4 py-3 last:border-b-0"
              >
                <div className="relative h-14 w-20 shrink-0 bg-grey-100">
                  <Image
                    src={project.coverImage}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <Link
                    href={`/admin/proyectos/${project.id}`}
                    className="link-underline block truncate text-[15px]"
                  >
                    {project.title}
                  </Link>
                  <p className="text-meta text-grey-500">
                    {project.location} — {project.year}
                    {project.category ? ` — ${project.category.name}` : ""}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  {project.featured && (
                    <span className="ui-label text-grey-400">Destacado</span>
                  )}
                  <StatePill state={project.state} />
                  <Link
                    href={`/admin/proyectos/${project.id}`}
                    className="ui-label link-underline text-grey-500"
                  >
                    Editar
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </>
  );
}
