import Link from "next/link";
import { prisma } from "@/app/lib/prisma";

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; mood?: string }>;
}) {
  const { q, mood } = await searchParams;
  const query = (q ?? "").trim();
  const moodFilter = (mood ?? "").trim();

  const diaries = await prisma.diary.findMany({
    where: {
      status: "public",
      ...(query
        ? {
            OR: [
              { title: { contains: query, mode: "insensitive" } },
              { content: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(moodFilter
        ? { mood: { contains: moodFilter, mode: "insensitive" } }
        : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">Search & Explore</h1>

      <form method="get" action="/explore">
        <div>
          <label htmlFor="q">Cari</label>
          <input
            id="q"
            name="q"
            type="text"
            defaultValue={query}
            placeholder="Judul atau isi diary"
          />
        </div>

        <div>
          <label htmlFor="mood">Mood</label>
          <input
            id="mood"
            name="mood"
            type="text"
            defaultValue={moodFilter}
            placeholder="Mis. happy"
          />
        </div>

        <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white">Cari</button>
      </form>

      {diaries.length === 0 ? (
        <p>Tidak ada hasil.</p>
      ) : (
        <ul>
          {diaries.map((diary) => (
            <li key={diary.id}>
              <Link href={`/feed/${diary.id}`}>{diary.title}</Link>
              {" — oleh "}
              <Link href={`/user/${diary.authorId}`}>{diary.author.name}</Link>
              {diary.mood ? ` — mood: ${diary.mood}` : ""}
              {diary.tags.length > 0 ? ` — #${diary.tags.join(" #")}` : ""}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
