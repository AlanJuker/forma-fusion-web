import { removeMessage, toggleMessageRead } from "@/app/admin/actions";
import { requireSession } from "@/infrastructure/auth/guard";
import { repositories } from "@/infrastructure/config/container";
import {
  Card,
  DeleteButton,
  EmptyState,
  PageHeader,
} from "@/presentation/components/admin/ui";

export const dynamic = "force-dynamic";

const formatter = new Intl.DateTimeFormat("es-EC", {
  dateStyle: "medium",
  timeStyle: "short",
});

export default async function AdminMessagesPage() {
  await requireSession();
  const messages = await repositories.contact.findMany();
  const unread = messages.filter((message) => !message.read).length;

  return (
    <>
      <PageHeader
        title="Mensajes"
        description={`${messages.length} recibidos — ${unread} sin leer.`}
      />

      {messages.length === 0 ? (
        <EmptyState message="Todavía no has recibido mensajes desde el formulario de contacto." />
      ) : (
        <div className="grid gap-3">
          {messages.map((message) => (
            <Card
              key={message.id}
              className={`p-5 ${message.read ? "" : "border-ink"}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[15px]">
                    {message.name}
                    {!message.read && (
                      <span className="ui-label ml-2 bg-ink px-1.5 py-0.5 text-paper">
                        Nuevo
                      </span>
                    )}
                  </p>
                  <p className="text-meta text-grey-500">
                    <a
                      href={`mailto:${message.email}`}
                      className="link-underline"
                    >
                      {message.email}
                    </a>
                    {message.phone && ` · ${message.phone}`}
                  </p>
                </div>
                <span className="ui-label shrink-0 text-grey-400">
                  {formatter.format(message.createdAt)}
                </span>
              </div>

              {message.subject && (
                <p className="mt-3 text-[14px] text-grey-700">
                  Asunto: {message.subject}
                </p>
              )}
              <p className="mt-2 whitespace-pre-line text-[14px] text-grey-700">
                {message.message}
              </p>

              <div className="mt-4 flex items-center gap-3">
                <form action={toggleMessageRead}>
                  <input type="hidden" name="id" value={message.id} />
                  <input
                    type="hidden"
                    name="read"
                    value={message.read ? "false" : "true"}
                  />
                  <button
                    type="submit"
                    className="ui-label border border-grey-300 px-4 py-2 transition-colors hover:border-ink"
                  >
                    {message.read ? "Marcar como no leído" : "Marcar como leído"}
                  </button>
                </form>
                <form action={removeMessage}>
                  <input type="hidden" name="id" value={message.id} />
                  <DeleteButton />
                </form>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
