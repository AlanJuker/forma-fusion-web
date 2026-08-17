"use server";

import { contactSchema } from "@/application/dto/schemas";
import { submitContactMessage } from "@/application/use-cases/content";
import { repositories } from "@/infrastructure/config/container";

export interface ContactFormState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
}

export async function sendContactMessage(
  _prev: ContactFormState,
  formData: FormData,
): Promise<ContactFormState> {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    subject: formData.get("subject"),
    message: formData.get("message"),
  });

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0];
      if (typeof key === "string" && !fieldErrors[key]) {
        fieldErrors[key] = issue.message;
      }
    }
    return { status: "error", message: "Revisa los campos marcados.", fieldErrors };
  }

  try {
    await submitContactMessage(repositories.contact, parsed.data);
    return {
      status: "success",
      message: "Mensaje enviado. Te respondemos dentro de 48 horas hábiles.",
    };
  } catch {
    return {
      status: "error",
      message: "No pudimos enviar el mensaje. Inténtalo de nuevo en unos minutos.",
    };
  }
}
