import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { repositories } from "@/infrastructure/config/container";
import { Reveal } from "@/presentation/components/ui/reveal";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = await repositories.news.findBySlug(slug);
  if (!post || post.state !== "PUBLISHED") return { title: "Noticia no encontrada" };
  return {
    title: post.title,
    description: post.excerpt ?? undefined,
  };
}

export default async function NewsDetailPage({ params }: Params) {
  const { slug } = await params;
  const post = await repositories.news.findBySlug(slug);
  if (!post || post.state !== "PUBLISHED") notFound();

  return (
    <article className="gutter-x pt-32 pb-24 md:pt-40">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <p className="ui-label text-grey-400">
            {post.publishedAt
              ? new Intl.DateTimeFormat("es-EC", {
                  day: "2-digit",
                  month: "long",
                  year: "numeric",
                }).format(post.publishedAt)
              : ""}
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <h1 className="display-sm mt-4 text-balance">{post.title}</h1>
        </Reveal>
        {post.excerpt && (
          <Reveal delay={0.16}>
            <p className="mt-6 text-[18px] text-grey-700">{post.excerpt}</p>
          </Reveal>
        )}
      </div>

      {post.coverImage && (
        <Reveal delay={0.2}>
          <div className="relative mt-12 aspect-[16/9] w-full">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      )}

      {post.body && (
        <div className="mx-auto mt-12 max-w-3xl">
          {post.body.split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 40)} className="mb-5 text-[15px] text-grey-700">
              {paragraph}
            </p>
          ))}
        </div>
      )}

      <div className="mx-auto mt-16 max-w-3xl">
        <Link href="/noticias" className="ui-label link-underline">
          &#8592; Todas las noticias
        </Link>
      </div>
    </article>
  );
}
