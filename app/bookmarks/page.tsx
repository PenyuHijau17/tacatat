import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";

export default async function BookmarksPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const bookmarks = await prisma.bookmark.findMany({
    where: { userId: session.user.id, diary: { status: "public" } },
    orderBy: { createdAt: "desc" },
    include: {
      diary: {
        include: { author: { select: { name: true } } },
      },
    },
  });

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">Bookmark Saya</h1>

      {bookmarks.length === 0 ? (
        <p>Belum ada diary yang di-bookmark.</p>
      ) : (
        <ul>
          {bookmarks.map((bookmark) => (
            <li key={bookmark.id}>
              <Link href={`/feed/${bookmark.diary.id}`}>
                {bookmark.diary.title}
              </Link>
              {" — oleh "}
              <Link href={`/user/${bookmark.diary.authorId}`}>
                {bookmark.diary.author.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
