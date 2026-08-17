/**
 * Sesión del panel de administración.
 *
 * Se firma un JWT (jose) y se guarda en una cookie httpOnly. Se usa `jose` en
 * lugar de librerías con dependencias de Node porque el middleware de Next.js
 * corre en el runtime Edge y debe poder verificar el token allí.
 */

import { SignJWT, jwtVerify } from "jose";

import type { UserRole } from "@/domain/entities/content";

export const SESSION_COOKIE = "ff_session";
const SESSION_DURATION_SECONDS = 60 * 60 * 8; // 8 horas

export interface SessionPayload {
  sub: string;
  email: string;
  name: string;
  role: UserRole;
}

function getSecret(): Uint8Array {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET no está configurado o es demasiado corto (mínimo 16 caracteres).",
    );
  }
  return new TextEncoder().encode(secret);
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string | undefined,
): Promise<SessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: ["HS256"],
    });
    if (!payload.sub || typeof payload.email !== "string") return null;
    return {
      sub: payload.sub,
      email: payload.email,
      name: typeof payload.name === "string" ? payload.name : "",
      role: payload.role === "ADMIN" ? "ADMIN" : "EDITOR",
    };
  } catch {
    // Token expirado, manipulado o firmado con otro secreto.
    return null;
  }
}

export const sessionCookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_DURATION_SECONDS,
};
