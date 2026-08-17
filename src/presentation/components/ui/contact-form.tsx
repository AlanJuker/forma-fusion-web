"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import {
  sendContactMessage,
  type ContactFormState,
} from "@/app/(site)/contacto/actions";

const INITIAL: ContactFormState = { status: "idle" };

/** Campo con línea inferior, sin caja: coherente con el resto del sitio. */
function Field({
  label,
  name,
  type = "text",
  required = false,
  error,
  textarea = false,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  textarea?: boolean;
}) {
  const shared =
    "w-full border-0 border-b border-grey-300 bg-transparent py-3 text-[15px] outline-none transition-colors focus:border-ink placeholder:text-grey-400";

  return (
    <div>
      <label htmlFor={name} className="ui-label text-grey-400">
        {label}
        {required && <span aria-hidden> *</span>}
      </label>
      {textarea ? (
        <textarea
          id={name}
          name={name}
          rows={5}
          required={required}
          className={`${shared} resize-none`}
          aria-invalid={Boolean(error)}
        />
      ) : (
        <input
          id={name}
          name={name}
          type={type}
          required={required}
          className={shared}
          aria-invalid={Boolean(error)}
        />
      )}
      {error && <p className="text-meta mt-1.5 text-grey-700">{error}</p>}
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="ui-label group relative overflow-hidden border border-ink px-8 py-4 transition-colors duration-500 hover:text-paper disabled:opacity-50"
    >
      {/* Relleno negro que sube desde abajo al pasar el cursor */}
      <span className="absolute inset-0 -z-10 translate-y-full bg-ink transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-y-0" />
      {pending ? "Enviando…" : "Enviar mensaje"}
    </button>
  );
}

export function ContactForm() {
  const [state, formAction] = useActionState(sendContactMessage, INITIAL);

  if (state.status === "success") {
    return (
      <div className="rule-t pt-8">
        <p className="display-sm">Gracias.</p>
        <p className="mt-4 max-w-md text-[15px] text-grey-600">{state.message}</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="grid gap-8">
      <div className="grid gap-8 sm:grid-cols-2">
        <Field
          label="Nombre"
          name="name"
          required
          error={state.fieldErrors?.name}
        />
        <Field
          label="Correo"
          name="email"
          type="email"
          required
          error={state.fieldErrors?.email}
        />
        <Field label="Teléfono" name="phone" type="tel" error={state.fieldErrors?.phone} />
        <Field label="Asunto" name="subject" error={state.fieldErrors?.subject} />
      </div>
      <Field
        label="Cuéntanos sobre el proyecto"
        name="message"
        textarea
        required
        error={state.fieldErrors?.message}
      />

      {state.status === "error" && state.message && (
        <p className="text-meta text-grey-700">{state.message}</p>
      )}

      <div>
        <SubmitButton />
      </div>
    </form>
  );
}
