import Image from "next/image";

import { removeTeamMember } from "@/app/admin/actions";
import { requireSession } from "@/infrastructure/auth/guard";
import { repositories } from "@/infrastructure/config/container";
import { TeamMemberForm } from "@/presentation/components/admin/entity-forms";
import { Card, DeleteButton, PageHeader } from "@/presentation/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminTeamPage({
  searchParams,
}: {
  searchParams: Promise<{ editar?: string }>;
}) {
  await requireSession();
  const { editar } = await searchParams;

  const team = await repositories.team.findMany();
  const editing = editar ? team.find((member) => member.id === editar) : undefined;

  return (
    <>
      <PageHeader title="Equipo" description="Aparece en la página del estudio." />

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <Card>
          {team.length === 0 ? (
            <p className="p-6 text-grey-500">No hay miembros registrados.</p>
          ) : (
            <ul>
              {team.map((member) => (
                <li
                  key={member.id}
                  className="flex items-center gap-4 border-b border-grey-200 px-4 py-3 last:border-b-0"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden bg-grey-100">
                    {member.photo && (
                      <Image
                        src={member.photo}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-cover"
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[15px]">{member.name}</p>
                    <p className="text-meta text-grey-500">{member.role}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    {!member.visible && (
                      <span className="ui-label text-grey-400">Oculto</span>
                    )}
                    <a
                      href={`/admin/equipo?editar=${member.id}`}
                      className="ui-label link-underline text-grey-500"
                    >
                      Editar
                    </a>
                    <form action={removeTeamMember}>
                      <input type="hidden" name="id" value={member.id} />
                      <DeleteButton />
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <div>
          <TeamMemberForm key={editing?.id ?? "new"} member={editing} />
          {editing && (
            <a
              href="/admin/equipo"
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
