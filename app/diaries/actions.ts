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
  const tagsRaw = String(formData.get("tags") ?? "").trim();

  if (!title || !content) {
    return {
      ok: false as const,
      error: !title ? "Judul diary wajib diisi" : "Isi diary wajib diisi",
    };
  }

  return {
    ok: true as const,
    fields: {
      title,
      content,
      mood: moodRaw === "" ? null : moodRaw,
      tags: tagsRaw === "" ? [] : tagsRaw.split(",").map((tag) => tag.trim()).filter((tag) => tag !== ""),
      status: parseStatus(formData.get("status")),
    },
  };
}

export async function createDiary(formData: FormData) {
  const session = await getSession();
  if (!session) {
    redirect("/login");
  }

  const parsed = parseFields(formData);

  if (!parsed.ok) {
    redirect(`/diaries/new?error=${encodeURIComponent(parsed.error)}`);
  }

  await prisma.diary.create({
    data: {
      ...parsed.fields,
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
  const parsed = parseFields(formData);

  if (!parsed.ok) {
    redirect(`/diaries/${id}/edit?error=${encodeURIComponent(parsed.error)}`);
  }

  const fields = parsed.fields;

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
