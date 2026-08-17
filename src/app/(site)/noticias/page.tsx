import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { listPublishedNews } from "@/application/use-cases/content";
import { repositories } from "@/infrastructure/config/container";
import { Reveal } from "@/presentation/components/ui/reveal";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Noticias",
  description: "Novedades, obras en curso y publicaciones de Forma & Fusión.",
};

const dateFormatter = new Intl.DateTimeFormat("es-EC", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default async function NewsPage() {
  const posts = await listPublishedNews(repositories.news);

  return (
    <>
      <header className="gutter-x pt-32 pb-10 md:pt-40 md:pb-14">
        <Reveal>
          <p className="ui-label text-grey-400">{posts.length} publicaciones</p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="display mt-4">Noticias</h1>
        </Reveal>
      </header>

      <section className="rule-t">
        {posts.length === 0 && (
          <p className="gutter-x py-20 text-grey-400">
            Todavía no hay publicaciones.
          </p>
        )}
        {posts.map((post, index) => (
          <Reveal key={post.id} delay={(index % 3) * 0.06}>
            <Link
              href={`/noticias/${post.slug}`}
              className="group gutter-x rule-b grid items-center gap-6 py-6 md:grid-cols-12"
            >
              <div className="md:col-span-2">
                <span className="ui-label text-grey-400">
                  {post.publishedAt ? dateFormatter.format(post.publishedAt) : ""}
                </span>
              </div>
              <div className="md:col-span-6">
                <h2 className="text-[22px] leading-tight tracking-[-0.02em] transition-opacity duration-300 group-hover:opacity-60">
                  {post.title}
                </h2>
                {post.excerpt && (
                  <p className="text-meta mt-2 max-w-md text-grey-600">
                    {post.excerpt}
                  </p>
                )}
              </div>
              {post.coverImage && (
                <div className="md:col-span-3 md:col-start-10">
                  <div className="media-zoom relative aspect-[16/10]">
                    <Image
                      src={post.coverImage}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 25vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </Link>
          </Reveal>
        ))}
      </section>
    </>
  );
}
