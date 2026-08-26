/** Casos de uso del formulario de contacto. */

import type { ContactMessage } from "@/domain/entities/content";
import type { ContactRepository } from "@/domain/repositories";

export async function submitContactMessage(
  repo: ContactRepository,
  input: {
    name: string;
    email: string;
    phone?: string | null;
    subject?: string | null;
    message: string;
  },
): Promise<ContactMessage> {
  return repo.create({
    name: input.name,
    email: input.email,
    phone: input.phone ?? null,
    subject: input.subject ?? null,
    message: input.message,
  });
}
