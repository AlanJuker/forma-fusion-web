import type { Metadata } from "next";

import { LoginForm } from "@/presentation/components/admin/login-form";

export const metadata: Metadata = {
  title: "Acceso — Administración",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <p className="ui-label text-grey-400">Forma &amp; Fusión</p>
        <h1 className="display-sm mt-3">Administración</h1>
        <p className="text-meta mt-3 text-grey-600">
          Accede para gestionar el contenido del sitio.
        </p>
        <div className="mt-10">
          <LoginForm next={next} />
        </div>
      </div>
    </main>
  );
}
