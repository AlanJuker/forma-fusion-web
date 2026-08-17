import { removeOffice } from "@/app/admin/actions";
import { requireSession } from "@/infrastructure/auth/guard";
import { repositories } from "@/infrastructure/config/container";
import { OfficeForm } from "@/presentation/components/admin/entity-forms";
import { Card, DeleteButton, PageHeader } from "@/presentation/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminOfficesPage({
  searchParams,
}: {
  searchParams: Promise<{ editar?: string }>;
}) {
  await requireSession();
  const { editar } = await searchParams;

  const offices = await repositories.offices.findMany();
  const editing = editar ? offices.find((office) => office.id === editar) : undefined;

  return (
    <>
      <PageHeader
        title="Oficinas"
        description="Se muestran en el pie de página y en contacto."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <Card>
          {offices.length === 0 ? (
            <p className="p-6 text-grey-500">No hay oficinas registradas.</p>
          ) : (
            <ul>
              {offices.map((office) => (
                <li
                  key={office.id}
                  className="flex items-start justify-between gap-4 border-b border-grey-200 px-4 py-3 last:border-b-0"
                >
                  <div className="min-w-0">
                    <p className="text-[15px]">{office.city}</p>
                    <p className="text-meta text-grey-500">
                      {office.address} — {office.country}
                    </p>
                    {(office.phone || office.email) && (
                      <p className="text-meta text-grey-500">
                        {[office.phone, office.email].filter(Boolean).join(" · ")}
                      </p>
                    )}
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <a
                      href={`/admin/oficinas?editar=${office.id}`}
                      className="ui-label link-underline text-grey-500"
                    >
                      Editar
                    </a>
                    <form action={removeOffice}>
                      <input type="hidden" name="id" value={office.id} />
                      <DeleteButton />
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div>
          <OfficeForm key={editing?.id ?? "new"} office={editing} />
          {editing && (
            <a
              href="/admin/oficinas"
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
