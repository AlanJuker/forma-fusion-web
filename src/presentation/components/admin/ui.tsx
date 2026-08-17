"use client";

import Link from "next/link";
import { useFormStatus } from "react-dom";

/** Piezas de interfaz compartidas por todas las pantallas del panel. */

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: { href: string; label: string };
}) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-[28px] tracking-[-0.03em]">{title}</h1>
        {description && (
          <p className="text-meta mt-1 text-grey-600">{description}</p>
        )}
      </div>
      {action && (
        <Link
          href={action.href}
          className="ui-label bg-ink px-5 py-3 text-paper transition-opacity hover:opacity-80"
        >
          {action.label}
        </Link>
      )}
    </header>
  );
}

export function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border border-grey-200 bg-paper ${className}`}>{children}</div>
  );
}

export function EmptyState({ message, action }: { message: string; action?: React.ReactNode }) {
  return (
    <div className="border border-dashed border-grey-300 bg-paper px-6 py-16 text-center">
      <p className="text-grey-500">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Field({
  label,
  name,
  type = "text",
  defaultValue,
  placeholder,
  required = false,
  hint,
  textarea = false,
  rows = 4,
}: {
  label: string;
  name: string;
  type?: string;
  defaultValue?: string | number | null;
  placeholder?: string;
  required?: boolean;
  hint?: string;
  textarea?: boolean;
  rows?: number;
}) {
  const shared =
    "w-full border border-grey-300 bg-paper px-3 py-2.5 text-[14px] outline-none transition-colors focus:border-ink";

  return (
    <div>
      <label htmlFor={name} className="ui-label text-grey-500">
        {label}
        {required && <span aria-hidden> *</span>}
      </label>
      <div className="mt-1.5">
        {textarea ? (
          <textarea
            id={name}
            name={name}
            rows={rows}
            required={required}
            placeholder={placeholder}
            defaultValue={defaultValue ?? undefined}
            className={`${shared} resize-y`}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            required={required}
            placeholder={placeholder}
            defaultValue={defaultValue ?? undefined}
            className={shared}
          />
        )}
      </div>
      {hint && <p className="text-meta mt-1 text-grey-500">{hint}</p>}
    </div>
  );
}

export function SelectField({
  label,
  name,
  options,
  defaultValue,
  hint,
}: {
  label: string;
  name: string;
  options: { value: string; label: string }[];
  defaultValue?: string | null;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="ui-label text-grey-500">
        {label}
      </label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue ?? ""}
        className="mt-1.5 w-full border border-grey-300 bg-paper px-3 py-2.5 text-[14px] outline-none focus:border-ink"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {hint && <p className="text-meta mt-1 text-grey-500">{hint}</p>}
    </div>
  );
}

export function CheckboxField({
  label,
  name,
  defaultChecked,
  hint,
}: {
  label: string;
  name: string;
  defaultChecked?: boolean;
  hint?: string;
}) {
  return (
    <div className="flex items-start gap-3">
      {/* El hidden previo hace que el campo llegue como "false" cuando la
          casilla está desmarcada; si no, el navegador simplemente lo omite. */}
      <input type="hidden" name={name} value="false" />
      <input
        id={name}
        name={name}
        type="checkbox"
        value="true"
        defaultChecked={defaultChecked}
        className="mt-0.5 h-4 w-4 accent-black"
      />
      <div>
        <label htmlFor={name} className="text-[14px]">
          {label}
        </label>
        {hint && <p className="text-meta text-grey-500">{hint}</p>}
      </div>
    </div>
  );
}

export function SubmitButton({ label = "Guardar" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="ui-label bg-ink px-6 py-3 text-paper transition-opacity hover:opacity-80 disabled:opacity-50"
    >
      {pending ? "Guardando…" : label}
    </button>
  );
}

export function DeleteButton({ label = "Eliminar" }: { label?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(event) => {
        // Confirmación en el cliente: la acción destructiva no debe dispararse
        // por un clic accidental en la fila.
        if (!window.confirm("¿Eliminar definitivamente? Esta acción no se puede deshacer.")) {
          event.preventDefault();
        }
      }}
      className="ui-label border border-grey-300 px-4 py-2 text-grey-600 transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
    >
      {pending ? "Eliminando…" : label}
    </button>
  );
}

export function StatePill({ state }: { state: "DRAFT" | "PUBLISHED" }) {
  const published = state === "PUBLISHED";
  return (
    <span
      className={`ui-label inline-block px-2 py-1 ${
        published ? "bg-ink text-paper" : "bg-grey-200 text-grey-700"
      }`}
    >
      {published ? "Publicado" : "Borrador"}
    </span>
  );
}
