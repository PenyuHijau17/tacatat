"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";

type DiaryStatusInput = "draft" | "public" | "private";

function parseStatus(value: FormDataEntryValue | null): DiaryStatusInput {
  if (value === "public" || value === "private") {
    return value;
  }
  return "draft";
}

function parseFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const moodRaw = String(formData.get("mood") ?? "").trim();

  if (!title) {
    throw new Error("Judul diary wajib diisi");
  }
  if (!content) {
    throw new Error("Isi diary wajib diisi");
  }

  return {
    title,
    content,
    mood: moodRaw === "" ? null : moodRaw,
    status: parseStatus(formData.get("status")),
  };
}

export async function createDiary(formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const fields = parseFields(formData);

  await prisma.diary.create({
    data: {
      ...fields,
      authorId: session.user.id,
    },
  });

  revalidatePath("/diaries");
  redirect("/diaries");
}

async function getOwnedDiary(id: number) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const diary = await prisma.diary.findUnique({ where: { id } });

  if (!diary || diary.authorId !== session.user.id) {
    throw new Error("Diary tidak ditemukan atau bukan milik Anda");
  }

  return diary;
}

export async function updateDiary(id: number, formData: FormData) {
  await getOwnedDiary(id);
  const fields = parseFields(formData);

  await prisma.diary.update({
    where: { id },
    data: {
      ...fields,
      // Reset moderasi saat writter mengajukan ulang sebagai public
      ...(fields.status === "public" ? { moderationStatus: "none" as const } : {}),
    },
  });

  revalidatePath("/diaries");
  revalidatePath(`/diaries/${id}`);
  redirect(`/diaries/${id}`);
}

export async function deleteDiary(id: number) {
  await getOwnedDiary(id);

  await prisma.diary.delete({ where: { id } });

  revalidatePath("/diaries");
  redirect("/diaries");
}
