import { removeCategory } from "@/app/admin/actions";
import { requireSession } from "@/infrastructure/auth/guard";
import { repositories } from "@/infrastructure/config/container";
import { CategoryForm } from "@/presentation/components/admin/entity-forms";
import { Card, DeleteButton, PageHeader } from "@/presentation/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ editar?: string }>;
}) {
  await requireSession();
  const { editar } = await searchParams;

  const categories = await repositories.categories.findAll();
  const editing = editar
    ? categories.find((category) => category.id === editar)
    : undefined;

  return (
    <>
      <PageHeader
        title="Categorías"
        description="Agrupan los proyectos y alimentan el menú del sitio."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <Card>
          {categories.length === 0 ? (
            <p className="p-6 text-grey-500">No hay categorías todavía.</p>
          ) : (
            <ul>
              {categories.map((category) => (
                <li
                  key={category.id}
                  className="flex items-center justify-between gap-4 border-b border-grey-200 px-4 py-3 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[15px]">{category.name}</p>
                    <p className="text-meta text-grey-500">
                      /{category.slug} — {category.projectCount ?? 0} proyectos
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <a
                      href={`/admin/categorias?editar=${category.id}`}
                      className="ui-label link-underline text-grey-500"
                    >
                      Editar
                    </a>
                    <form action={removeCategory}>
                      <input type="hidden" name="id" value={category.id} />
                      <DeleteButton />
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div>
          <CategoryForm
            key={editing?.id ?? "new"}
            category={editing}
            categories={categories}
          />
          {editing && (
            <a
              href="/admin/categorias"
              className="ui-label link-underline mt-3 inline-block text-grey-500"
            >
              Cancelar edición
            </a>
          )}
        </div>
      </div>
    </>
  );
}
