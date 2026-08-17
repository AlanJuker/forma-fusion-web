/**
 * Lectura de la sesión en el servidor y guardas de acceso.
 * El middleware ya bloquea /admin, pero cada Server Action vuelve a comprobar:
 * una acción puede invocarse directamente sin pasar por una navegación.
 */

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SESSION_COOKIE, verifySessionToken, type SessionPayload } from "./session";

export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/** Exige sesión válida; redirige al login si no la hay. */
export async function requireSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) redirect("/admin/login");
  return session;
}

/** Exige rol ADMIN. Lanza si el usuario solo es editor. */
export async function requireAdmin(): Promise<SessionPayload> {
  const session = await requireSession();
  if (session.role !== "ADMIN") {
    throw new Error("No tienes permisos para realizar esta acción.");
  }
  return session;
}
