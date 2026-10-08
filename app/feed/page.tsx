import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

export default async function FeedPage() {
  const diaries = await prisma.diary.findMany({
    where: { status: "public" },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <main>
      <h1>Public Feed</h1>

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
              {" — "}
              {new Date(diary.createdAt).toLocaleDateString("id-ID")}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
