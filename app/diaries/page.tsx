import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";

export default async function DiariesPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const diaries = await prisma.diary.findMany({
    where: { authorId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">Private Space</h1>

      <p>
        <Link href="/diaries/new">Tulis diary baru</Link>
      </p>

      {diaries.length === 0 ? (
        <p>Belum ada diary.</p>
      ) : (
        <ul>
          {diaries.map((diary) => (
            <li key={diary.id}>
              <Link href={`/diaries/${diary.id}`}>{diary.title}</Link>
              {" — "}
              <span>{diary.status}</span>
              {diary.mood ? ` — mood: ${diary.mood}` : ""}
              {diary.tags.length > 0 ? ` — #${diary.tags.join(" #")}` : ""}
              {diary.moderationStatus !== "none"
                ? ` — moderasi: ${diary.moderationStatus}`
                : ""}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
