"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";

async function requirePublicDiary(id: number) {
  const session = await getSession();
  if (!session) {
    throw new Error("Tidak terautentikasi");
  }

  const diary = await prisma.diary.findUnique({ where: { id } });
  if (!diary || diary.status !== "public") {
    throw new Error("Diary tidak tersedia");
  }

  return { session, diary };
}

export async function toggleLike(id: number) {
  const { session } = await requirePublicDiary(id);

  const existing = await prisma.like.findUnique({
    where: { diaryId_userId: { diaryId: id, userId: session.user.id } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({
      data: { diaryId: id, userId: session.user.id },
    });
  }

  revalidatePath(`/feed/${id}`);
  revalidatePath("/feed");
}

export async function addComment(id: number, formData: FormData) {
  const { session } = await requirePublicDiary(id);

  const content = String(formData.get("content") ?? "").trim();
  if (!content) {
    return;
  }

  await prisma.comment.create({
    data: { diaryId: id, userId: session.user.id, content },
  });

  revalidatePath(`/feed/${id}`);
}
