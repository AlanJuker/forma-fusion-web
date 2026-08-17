"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";

import { login, type LoginState } from "@/app/admin/auth-actions";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="ui-label w-full bg-ink py-4 text-paper transition-opacity hover:opacity-80 disabled:opacity-50"
    >
      {pending ? "Verificando…" : "Entrar"}
    </button>
  );
}

export function LoginForm({ next }: { next?: string }) {
  const [state, formAction] = useActionState<LoginState, FormData>(login, {});

  return (
    <form action={formAction} className="grid gap-6">
      {next && <input type="hidden" name="next" value={next} />}

      <div>
        <label htmlFor="email" className="ui-label text-grey-400">
          Correo
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="w-full border-0 border-b border-grey-300 bg-transparent py-3 text-[15px] outline-none focus:border-ink"
        />
      </div>

      <div>
        <label htmlFor="password" className="ui-label text-grey-400">
          Contraseña
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className="w-full border-0 border-b border-grey-300 bg-transparent py-3 text-[15px] outline-none focus:border-ink"
        />
      </div>

      {state.error && <p className="text-meta text-grey-700">{state.error}</p>}

      <SubmitButton />
    </form>
  );
}
