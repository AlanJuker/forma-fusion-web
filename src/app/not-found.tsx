import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="ui-label text-grey-400">Error 404</p>
      <h1 className="display mt-4">Página no encontrada</h1>
      <p className="mt-6 max-w-sm text-[15px] text-grey-600">
        La dirección que buscas no existe o el contenido fue movido.
      </p>
      <Link href="/" className="ui-label link-underline mt-10">
        Volver al inicio &#8594;
      </Link>
    </main>
  );
}
