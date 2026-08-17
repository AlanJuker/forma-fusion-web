"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { loginSchema } from "@/application/dto/schemas";
import { verifyPassword } from "@/infrastructure/auth/password";
import {
  SESSION_COOKIE,
  createSessionToken,
  sessionCookieOptions,
} from "@/infrastructure/auth/session";
import { repositories } from "@/infrastructure/config/container";

export interface LoginState {
  error?: string;
}

export async function login(
  _prev: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Introduce un correo y una contraseña válidos." };
  }

  const user = await repositories.users.findByEmail(parsed.data.email);

  // Mismo mensaje para usuario inexistente y contraseña incorrecta: no revelamos
  // qué correos están registrados.
  const valid =
    user !== null &&
    (await verifyPassword(parsed.data.password, user.passwordHash));

  if (!user || !valid) {
    return { error: "Credenciales incorrectas." };
  }

  const token = await createSessionToken({
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, sessionCookieOptions);

  const next = formData.get("next");
  redirect(typeof next === "string" && next.startsWith("/admin") ? next : "/admin");
}

export async function logout() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  redirect("/admin/login");
}
