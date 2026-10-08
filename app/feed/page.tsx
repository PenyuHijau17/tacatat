import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

export default async function FeedPage() {
  const diaries = await prisma.diary.findMany({
    where: { status: "public" },
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { name: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">Public Feed</h1>

      <p>
        <Link href="/explore">Search & Explore</Link>
      </p>

      {diaries.length === 0 ? (
        <p>Belum ada diary publik.</p>
      ) : (
        <ul>
          {diaries.map((diary) => (
            <li key={diary.id}>
              <Link href={`/feed/${diary.id}`}>{diary.title}</Link>
              {" — oleh "}
              {diary.author.name}
              {diary.mood ? ` — mood: ${diary.mood}` : ""}
              {diary.tags.length > 0 ? ` — #${diary.tags.join(" #")}` : ""}
              {" — "}
              {diary._count.likes} like, {diary._count.comments} komentar
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
