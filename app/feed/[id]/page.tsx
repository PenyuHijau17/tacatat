import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

export default async function PublicDiaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const diaryId = Number(id);

  if (!Number.isInteger(diaryId)) {
    notFound();
  }

  const diary = await prisma.diary.findUnique({
    where: { id: diaryId },
    include: { author: { select: { name: true } } },
  });

  // Hanya diary public yang boleh tampil; draft dan private
  // diperlakukan sama seperti tidak ditemukan.
  if (!diary || diary.status !== "public") {
    notFound();
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">{diary.title}</h1>

      <p>Oleh: {diary.author.name}</p>
      {diary.mood && <p>Mood: {diary.mood}</p>}
      {diary.tags.length > 0 && <p>Tags: #{diary.tags.join(" #")}</p>}
      <p>{new Date(diary.createdAt).toLocaleDateString("id-ID")}</p>

      <p>{diary.content}</p>
    </main>
  );
}
