import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";
import { markRead } from "./actions";

export default async function NotificationsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const notifications = await prisma.notification.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">Notifikasi</h1>

      {notifications.length === 0 ? (
        <p>Belum ada notifikasi.</p>
      ) : (
        <ul>
          {notifications.map((notification) => (
            <li key={notification.id} className={notification.read ? "opacity-60" : ""}>
              {notification.url ? (
                <Link href={notification.url}>{notification.message}</Link>
              ) : (
                notification.message
              )}
              {" — "}
              {new Date(notification.createdAt).toLocaleString("id-ID")}
              {!notification.read && (
                <form action={markRead.bind(null, notification.id)} style={{ display: "inline" }}>
                  <button type="submit" className="ml-2 text-sm underline">
                    Tandai dibaca
                  </button>
                </form>
              )}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
