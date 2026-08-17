import type { Metadata } from "next";

import { getSession } from "@/infrastructure/auth/guard";
import { repositories } from "@/infrastructure/config/container";
import { AdminShell } from "@/presentation/components/admin/admin-shell";

export const metadata: Metadata = {
  title: "Administración",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  // Sin sesión la única ruta alcanzable es /admin/login (lo garantiza el
  // middleware), y esa página se dibuja sin el armazón del panel.
  if (!session) return <>{children}</>;

  const unread = await repositories.contact.countUnread();

  return (
    <AdminShell session={session} unreadCount={unread}>
      {children}
    </AdminShell>
  );
}
