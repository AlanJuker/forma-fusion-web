import Link from "next/link";
import { notFound } from "next/navigation";

import { removeNews } from "@/app/admin/actions";
import { requireSession } from "@/infrastructure/auth/guard";
import { repositories } from "@/infrastructure/config/container";
import { NewsForm } from "@/presentation/components/admin/news-form";
import { DeleteButton, PageHeader } from "@/presentation/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminNewsEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireSession();
  const { id } = await params;

  const isNew = id === "nueva";
  const post = isNew ? null : await repositories.news.findById(id);
  if (!isNew && !post) notFound();

  return (
    <>
      <PageHeader title={isNew ? "Nueva noticia" : "Editar noticia"} />

      <div className="mb-6">
        <Link href="/admin/noticias" className="ui-label link-underline text-grey-500">
          &#8592; Volver
        </Link>
      </div>

      <NewsForm post={post} />

      {post && (
        <div className="mt-10 border-t border-grey-200 pt-6">
          <p className="ui-label text-grey-500">Zona peligrosa</p>
          <form action={removeNews} className="mt-3">
            <input type="hidden" name="id" value={post.id} />
            <DeleteButton label="Eliminar noticia" />
          </form>
        </div>
      )}
    </>
  );
}
