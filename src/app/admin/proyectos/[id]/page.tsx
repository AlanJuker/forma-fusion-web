import Link from "next/link";
import { notFound } from "next/navigation";

import { removeProject } from "@/app/admin/actions";
import { requireSession } from "@/infrastructure/auth/guard";
import { repositories } from "@/infrastructure/config/container";
import { ProjectForm } from "@/presentation/components/admin/project-form";
import { DeleteButton, PageHeader } from "@/presentation/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminProjectEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSession();
  const { id } = await params;

  // La ruta /admin/proyectos/nuevo comparte formulario con la de edición.
  const isNew = id === "nuevo";
  const project = isNew ? null : await repositories.projects.findById(id);
  if (!isNew && !project) notFound();

  const categories = await repositories.categories.findAll();

  return (
    <>
      <PageHeader
        title={isNew ? "Nuevo proyecto" : "Editar proyecto"}
        description={
          project ? `Última modificación: ${project.updatedAt.toLocaleDateString("es-EC")}` : undefined
        }
      />

      <div className="mb-6 flex items-center gap-4">
        <Link href="/admin/proyectos" className="ui-label link-underline text-grey-500">
          &#8592; Volver
        </Link>
        {project?.state === "PUBLISHED" && (
          <Link
            href={`/proyectos/${project.slug}`}
            target="_blank"
            className="ui-label link-underline text-grey-500"
          >
            Ver en el sitio &#8599;
          </Link>
        )}
      </div>

      <ProjectForm project={project} categories={categories} />

      {project && (
        <div className="mt-10 border-t border-grey-200 pt-6">
          <p className="ui-label text-grey-500">Zona peligrosa</p>
          <p className="text-meta mt-1 text-grey-600">
            Eliminar el proyecto borra también su galería de imágenes.
          </p>
          <form action={removeProject} className="mt-3">
            <input type="hidden" name="id" value={project.id} />
            <DeleteButton label="Eliminar proyecto" />
          </form>
        </div>
      )}
    </>
  );
}
