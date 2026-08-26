"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { logout } from "@/app/admin/auth-actions";
import type { SessionPayload } from "@/infrastructure/auth/session";

const NAV = [
  { href: "/admin", label: "Resumen", exact: true },
  { href: "/admin/proyectos", label: "Proyectos" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/mensajes", label: "Mensajes", badge: true },
  { href: "/admin/ajustes", label: "Ajustes" },
];

export function AdminShell({
  children,
  session,
  unreadCount,
}: {
  children: React.ReactNode;
  session: SessionPayload;
  unreadCount: number;
}) {
  const pathname = usePathname();
  const [navOpen, setNavOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <div className="min-h-screen md:grid md:grid-cols-[220px_1fr]">
      {/* Barra lateral */}
      <aside className="border-grey-200 bg-paper md:sticky md:top-0 md:h-screen md:border-r">
        <div className="flex items-center justify-between border-b border-grey-200 p-5 md:block md:border-b-0">
          <div>
            <Link href="/admin" className="text-[15px] tracking-[-0.02em]">
              Forma &amp; Fusión
            </Link>
            <p className="ui-label mt-1 text-grey-400">Panel de contenido</p>
          </div>
          <button
            type="button"
            className="ui-label md:hidden"
            onClick={() => setNavOpen((open) => !open)}
            aria-expanded={navOpen}
          >
            {navOpen ? "Cerrar" : "Menú"}
          </button>
        </div>

        <nav className={`px-5 pb-5 md:block ${navOpen ? "block" : "hidden"}`}>
          <ul className="mt-4 space-y-0.5">
            {NAV.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setNavOpen(false)}
                  className={`flex items-center justify-between px-2 py-2 text-[14px] transition-colors ${
                    isActive(item.href, item.exact)
                      ? "bg-ink text-paper"
                      : "text-grey-700 hover:bg-grey-100"
                  }`}
                >
                  {item.label}
                  {item.badge && unreadCount > 0 && (
                    <span className="ui-label rounded-full bg-grey-800 px-1.5 py-0.5 text-paper">
                      {unreadCount}
                    </span>
                  )}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t border-grey-200 pt-4">
            <Link href="/" target="_blank" className="ui-label link-underline text-grey-500">
              Ver el sitio &#8599;
            </Link>
            <p className="text-meta mt-4 truncate text-grey-500">{session.name}</p>
            <p className="ui-label text-grey-400">
              {session.role === "ADMIN" ? "Administrador" : "Editor"}
            </p>
            <form action={logout} className="mt-3">
              <button type="submit" className="ui-label link-underline text-grey-500">
                Cerrar sesión
              </button>
            </form>
          </div>
        </nav>
      </aside>

      <div className="min-w-0 bg-grey-100/40">
        <div className="p-5 md:p-10">{children}</div>
      </div>
    </div>
  );
}
