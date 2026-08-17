"use client";

import Link from "next/link";
import { useActionState } from "react";

import { saveNews, type ActionState } from "@/app/admin/actions";
import type { NewsPost } from "@/domain/entities/content";

import { Card, Field, SelectField, SubmitButton } from "./ui";

export function NewsForm({ post }: { post: NewsPost | null }) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveNews, {});

  return (
    <form action={formAction} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      {post && <input type="hidden" name="id" value={post.id} />}

      <Card className="grid gap-5 p-5">
        <h2 className="ui-label text-grey-500">Contenido</h2>
        <Field label="Título" name="title" required defaultValue={post?.title} />
        <Field
          label="Slug"
          name="slug"
          defaultValue={post?.slug}
          hint="Se genera desde el título si lo dejas vacío."
        />
        <Field
          label="Resumen"
          name="excerpt"
          textarea
          rows={2}
          defaultValue={post?.excerpt}
        />
        <Field
          label="Cuerpo"
          name="body"
          textarea
          rows={14}
          defaultValue={post?.body}
          hint="Separa los párrafos con una línea en blanco."
        />
      </Card>

      <aside className="grid content-start gap-6">
        <Card className="grid gap-5 p-5">
          <h2 className="ui-label text-grey-500">Publicación</h2>
          <SelectField
            label="Estado"
            name="state"
            defaultValue={post?.state ?? "DRAFT"}
            options={[
              { value: "DRAFT", label: "Borrador" },
              { value: "PUBLISHED", label: "Publicado" },
            ]}
          />
          <Field
            label="Imagen de portada (URL)"
            name="coverImage"
            defaultValue={post?.coverImage}
          />
          {state.error && <p className="text-meta text-grey-700">{state.error}</p>}
          <div className="flex items-center gap-3">
            <SubmitButton label={post ? "Guardar cambios" : "Crear noticia"} />
            <Link href="/admin/noticias" className="ui-label link-underline text-grey-500">
              Cancelar
            </Link>
          </div>
        </Card>
      </aside>
    </form>
  );
}
