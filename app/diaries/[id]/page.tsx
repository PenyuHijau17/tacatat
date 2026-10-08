import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";
import { deleteDiary } from "../actions";

export default async function DiaryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const diaryId = Number(id);

  if (!Number.isInteger(diaryId)) {
    notFound();
  }

  const diary = await prisma.diary.findUnique({ where: { id: diaryId } });

  if (!diary || diary.authorId !== session.user.id) {
    notFound();
  }

  const deleteWithId = deleteDiary.bind(null, diary.id);

  return (
    <main>
      <h1>{diary.title}</h1>

      <p>Status: {diary.status}</p>
      {diary.mood && <p>Mood: {diary.mood}</p>}
      <p>{new Date(diary.createdAt).toLocaleDateString("id-ID")}</p>

      <p>{diary.content}</p>

      <p>
        <Link href={`/diaries/${diary.id}/edit`}>Edit</Link>
      </p>

      <form action={deleteWithId}>
        <button type="submit">Hapus</button>
      </form>

      <p>
        <Link href="/diaries">Kembali ke Private Space</Link>
      </p>
    </main>
  );
}
