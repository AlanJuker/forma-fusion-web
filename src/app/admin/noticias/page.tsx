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

export default async function AdminNewsPage() {
  await requireSession();
  const posts = await repositories.news.findMany();

  return (
    <>
      <PageHeader
        title="Noticias"
        description={`${posts.length} publicaciones.`}
        action={{ href: "/admin/noticias/nueva", label: "Nueva noticia" }}
      />

      {posts.length === 0 ? (
        <EmptyState
          message="Todavía no hay publicaciones."
          action={
            <Link href="/admin/noticias/nueva" className="ui-label link-underline">
              Escribir la primera &#8594;
            </Link>
          }
        />
      ) : (
        <Card>
          <ul>
            {posts.map((post) => (
              <li
                key={post.id}
                className="flex items-center justify-between gap-4 border-b border-grey-200 px-4 py-3 last:border-b-0"
              >
                <div className="min-w-0">
                  <Link
                    href={`/admin/noticias/${post.id}`}
                    className="link-underline block truncate text-[15px]"
                  >
                    {post.title}
                  </Link>
                  <p className="text-meta text-grey-500">
                    {post.publishedAt
                      ? post.publishedAt.toLocaleDateString("es-EC")
                      : "Sin publicar"}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <StatePill state={post.state} />
                  <Link
                    href={`/admin/noticias/${post.id}`}
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
