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

async function notify(userId: string, type: string, message: string, url?: string) {
  await prisma.notification.create({
    data: { userId, type, message, url },
  });
}

export async function toggleLike(id: number) {
  const { session, diary } = await requirePublicDiary(id);

  const existing = await prisma.like.findUnique({
    where: { diaryId_userId: { diaryId: id, userId: session.user.id } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
  } else {
    await prisma.like.create({
      data: { diaryId: id, userId: session.user.id },
    });

    if (diary.authorId !== session.user.id) {
      await notify(diary.authorId, "like", `${session.user.name} memberi like pada diary Anda`, `/feed/${id}`);
    }
  }

  revalidatePath(`/feed/${id}`);
  revalidatePath("/feed");
}

export async function reportDiary(id: number, formData: FormData) {
  const { session } = await requirePublicDiary(id);

  const reason = String(formData.get("reason") ?? "").trim();
  if (!reason) {
    return;
  }

  await prisma.report.create({
    data: { diaryId: id, userId: session.user.id, reason },
  });

  revalidatePath(`/feed/${id}`);
}

export async function toggleBookmark(id: number) {
  const { session } = await requirePublicDiary(id);

  const existing = await prisma.bookmark.findUnique({
    where: { diaryId_userId: { diaryId: id, userId: session.user.id } },
  });

  if (existing) {
    await prisma.bookmark.delete({ where: { id: existing.id } });
  } else {
    await prisma.bookmark.create({
      data: { diaryId: id, userId: session.user.id },
    });
  }

  revalidatePath(`/feed/${id}`);
  revalidatePath("/bookmarks");
}

export async function addComment(id: number, formData: FormData) {
  const { session, diary } = await requirePublicDiary(id);

  const content = String(formData.get("content") ?? "").trim();
  if (!content) {
    return;
  }

  await prisma.comment.create({
    data: { diaryId: id, userId: session.user.id, content },
  });

  if (diary.authorId !== session.user.id) {
    await notify(diary.authorId, "comment", `${session.user.name} berkomentar pada diary Anda`, `/feed/${id}`);
  }

  revalidatePath(`/feed/${id}`);
}
