"use client";

import Link from "next/link";
import { useActionState } from "react";

import { saveProject, type ActionState } from "@/app/admin/actions";
import type { Category } from "@/domain/entities/content";
import type { Project } from "@/domain/entities/project";

import {
  Card,
  CheckboxField,
  Field,
  SelectField,
  SubmitButton,
} from "./ui";

export function ProjectForm({
  project,
  categories,
}: {
  project: Project | null;
  categories: Category[];
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    saveProject,
    {},
  );

  // El editor de galería es un textarea "una imagen por línea" — suficiente
  // para un catálogo de este tamaño y sin dependencias de subida de archivos.
  const galleryValue = project?.images
    .map((image) => (image.caption ? `${image.url} | ${image.caption}` : image.url))
    .join("\n");

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {project && <input type="hidden" name="id" value={project.id} />}

      <div className="grid gap-6">
        <Card className="grid gap-5 p-5">
          <h2 className="ui-label text-grey-500">Contenido</h2>
          <Field
            label="Título"
            name="title"
            required
            defaultValue={project?.title}
            placeholder="Casa Cumbayá"
          />
          <Field
            label="Slug"
            name="slug"
            defaultValue={project?.slug}
            hint="Déjalo vacío para generarlo automáticamente desde el título."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Ubicación"
              name="location"
              required
              defaultValue={project?.location}
              placeholder="Quito, Ecuador"
            />
            <Field
              label="Año"
              name="year"
              type="number"
              required
              defaultValue={project?.year ?? new Date().getFullYear()}
            />
          </div>
          <Field
            label="Resumen"
            name="excerpt"
            textarea
            rows={3}
            defaultValue={project?.excerpt}
            hint="Una o dos frases; aparece en la ficha del proyecto."
          />
          <Field
            label="Descripción"
            name="description"
            textarea
            rows={10}
            defaultValue={project?.description}
            hint="Separa los párrafos con una línea en blanco."
          />
        </Card>

        <Card className="grid gap-5 p-5">
          <h2 className="ui-label text-grey-500">Imágenes</h2>
          <Field
            label="Imagen de portada (URL)"
            name="coverImage"
            required
            defaultValue={project?.coverImage}
            placeholder="https://images.unsplash.com/..."
          />
          <Field
            label="Galería"
            name="gallery"
            textarea
            rows={7}
            defaultValue={galleryValue}
            hint="Una URL por línea. Opcional: escribe «URL | pie de foto» para añadir un pie."
          />
        </Card>

        <Card className="grid gap-5 p-5">
          <h2 className="ui-label text-grey-500">Ficha técnica</h2>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field
              label="Superficie"
              name="size"
              defaultValue={project?.size}
              placeholder="320 m²"
            />
            <Field label="Cliente" name="client" defaultValue={project?.client} />
          </div>
          <Field
            label="Colaboradores"
            name="collaborators"
            defaultValue={project?.collaborators}
          />
        </Card>
      </div>

      {/* Columna de publicación */}
      <aside className="grid content-start gap-6">
        <Card className="grid gap-5 p-5">
          <h2 className="ui-label text-grey-500">Publicación</h2>
          <SelectField
            label="Estado"
            name="state"
            defaultValue={project?.state ?? "DRAFT"}
            options={[
              { value: "DRAFT", label: "Borrador" },
              { value: "PUBLISHED", label: "Publicado" },
            ]}
          />
          <SelectField
            label="Estado de obra"
            name="status"
            defaultValue={project?.status ?? "COMPLETED"}
            options={[
              { value: "CONCEPT", label: "Concepto" },
              { value: "IN_PROGRESS", label: "En construcción" },
              { value: "COMPLETED", label: "Finalizado" },
            ]}
          />
          <SelectField
            label="Categoría"
            name="categoryId"
            defaultValue={project?.category?.id ?? ""}
            options={[
              { value: "", label: "Sin categoría" },
              ...categories.map((category) => ({
                value: category.id,
                label: category.name,
              })),
            ]}
          />
          <Field
            label="Orden"
            name="order"
            type="number"
            defaultValue={project?.order ?? 0}
            hint="Un número menor aparece antes en la rejilla."
          />
          <CheckboxField
            label="Destacado"
            name="featured"
            defaultChecked={project?.featured}
            hint="Los destacados encabezan la portada."
          />

          {state.error && <p className="text-meta text-grey-700">{state.error}</p>}

          <div className="flex items-center gap-3">
            <SubmitButton label={project ? "Guardar cambios" : "Crear proyecto"} />
            <Link href="/admin/proyectos" className="ui-label link-underline text-grey-500">
              Cancelar
            </Link>
          </div>
        </Card>
      </aside>
    </form>
  );
}
