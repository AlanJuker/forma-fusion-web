import { requireSession } from "@/infrastructure/auth/guard";
import { repositories } from "@/infrastructure/config/container";
import { SettingsForm } from "@/presentation/components/admin/entity-forms";
import { PageHeader } from "@/presentation/components/admin/ui";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const session = await requireSession();
  const settings = await repositories.settings.getAll();

  return (
    <>
      <PageHeader
        title="Ajustes"
        description="Datos globales que aparecen en el pie de página y en contacto."
      />

      <SettingsForm settings={settings} />

      <div className="mt-10 max-w-xl border-t border-grey-200 pt-6">
        <p className="ui-label text-grey-500">Tu cuenta</p>
        <p className="text-meta mt-2 text-grey-600">
          {session.name} — {session.email}
        </p>
        <p className="text-meta text-grey-600">
          Rol: {session.role === "ADMIN" ? "Administrador" : "Editor"}
        </p>
      </div>
    </>
  );
}
