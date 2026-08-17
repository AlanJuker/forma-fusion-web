"use client";

import { useActionState } from "react";

import {
  saveCategory,
  saveOffice,
  saveSettings,
  saveTeamMember,
  type ActionState,
} from "@/app/admin/actions";
import type { Category, Office, TeamMember } from "@/domain/entities/content";

import { Card, CheckboxField, Field, SelectField, SubmitButton } from "./ui";

/**
 * Formularios de las entidades sencillas. Todos siguen el mismo patrón:
 * un `id` oculto distingue alta de edición, y la acción redirige al listado.
 */

export function CategoryForm({
  category,
  categories,
}: {
  category?: Category;
  categories: Category[];
}) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    saveCategory,
    {},
  );

  return (
    <Card className="grid gap-5 p-5">
      <form action={formAction} className="grid gap-5">
        {category && <input type="hidden" name="id" value={category.id} />}
        <h2 className="ui-label text-grey-500">
          {category ? `Editar «${category.name}»` : "Nueva categoría"}
        </h2>
        <Field label="Nombre" name="name" required defaultValue={category?.name} />
        <Field
          label="Slug"
          name="slug"
          defaultValue={category?.slug}
          hint="Se genera automáticamente si lo dejas vacío."
        />
        <Field
          label="Descripción"
          name="description"
          textarea
          rows={2}
          defaultValue={category?.description}
        />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Orden"
            name="order"
            type="number"
            defaultValue={category?.order ?? 0}
          />
          <SelectField
            label="Categoría padre"
            name="parentId"
            defaultValue={category?.parentId ?? ""}
            options={[
              { value: "", label: "Ninguna (nivel principal)" },
              ...categories
                .filter((item) => item.id !== category?.id)
                .map((item) => ({ value: item.id, label: item.name })),
            ]}
          />
        </div>
        {state.error && <p className="text-meta text-grey-700">{state.error}</p>}
        <div>
          <SubmitButton label={category ? "Guardar" : "Crear categoría"} />
        </div>
      </form>
    </Card>
  );
}

export function TeamMemberForm({ member }: { member?: TeamMember }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    saveTeamMember,
    {},
  );

  return (
    <Card className="grid gap-5 p-5">
      <form action={formAction} className="grid gap-5">
        {member && <input type="hidden" name="id" value={member.id} />}
        <h2 className="ui-label text-grey-500">
          {member ? `Editar «${member.name}»` : "Nuevo miembro"}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nombre" name="name" required defaultValue={member?.name} />
          <Field
            label="Cargo"
            name="role"
            required
            defaultValue={member?.role}
            placeholder="Arquitecta asociada"
          />
        </div>
        <Field
          label="Foto (URL)"
          name="photo"
          defaultValue={member?.photo}
          placeholder="https://…"
        />
        <Field label="Correo" name="email" type="email" defaultValue={member?.email} />
        <Field label="Biografía" name="bio" textarea rows={3} defaultValue={member?.bio} />
        <Field label="Orden" name="order" type="number" defaultValue={member?.order ?? 0} />
        <CheckboxField
          label="Visible en el sitio"
          name="visible"
          defaultChecked={member?.visible ?? true}
        />
        {state.error && <p className="text-meta text-grey-700">{state.error}</p>}
        <div>
          <SubmitButton label={member ? "Guardar" : "Añadir al equipo"} />
        </div>
      </form>
    </Card>
  );
}

export function OfficeForm({ office }: { office?: Office }) {
  const [state, formAction] = useActionState<ActionState, FormData>(saveOffice, {});

  return (
    <Card className="grid gap-5 p-5">
      <form action={formAction} className="grid gap-5">
        {office && <input type="hidden" name="id" value={office.id} />}
        <h2 className="ui-label text-grey-500">
          {office ? `Editar «${office.city}»` : "Nueva oficina"}
        </h2>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Ciudad" name="city" required defaultValue={office?.city} />
          <Field label="País" name="country" required defaultValue={office?.country} />
        </div>
        <Field label="Dirección" name="address" required defaultValue={office?.address} />
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Teléfono" name="phone" defaultValue={office?.phone} />
          <Field label="Correo" name="email" type="email" defaultValue={office?.email} />
        </div>
        <Field label="Orden" name="order" type="number" defaultValue={office?.order ?? 0} />
        {state.error && <p className="text-meta text-grey-700">{state.error}</p>}
        <div>
          <SubmitButton label={office ? "Guardar" : "Añadir oficina"} />
        </div>
      </form>
    </Card>
  );
}

export function SettingsForm({ settings }: { settings: Record<string, string> }) {
  const [state, formAction] = useActionState<ActionState, FormData>(
    saveSettings,
    {},
  );

  return (
    <Card className="max-w-xl p-5">
      <form action={formAction} className="grid gap-5">
        <h2 className="ui-label text-grey-500">Datos de contacto del sitio</h2>
        <Field
          label="Correo de contacto"
          name="contactEmail"
          type="email"
          defaultValue={settings.contactEmail}
          placeholder="hola@formafusion.ec"
        />
        <Field label="Teléfono" name="phone" defaultValue={settings.phone} />
        <Field
          label="Instagram (URL)"
          name="instagram"
          defaultValue={settings.instagram}
          placeholder="https://www.instagram.com/formafusion.ec/"
        />
        <Field
          label="WhatsApp (URL)"
          name="whatsapp"
          defaultValue={settings.whatsapp}
          placeholder="https://wa.me/…"
        />
        <Field
          label="Lema del pie de página"
          name="footerTagline"
          defaultValue={settings.footerTagline}
        />
        {state.error && <p className="text-meta text-grey-700">{state.error}</p>}
        {state.saved && (
          <p className="text-meta text-grey-600">Ajustes guardados.</p>
        )}
        <div>
          <SubmitButton />
        </div>
      </form>
    </Card>
  );
}
