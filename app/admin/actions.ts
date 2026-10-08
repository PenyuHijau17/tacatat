"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";

async function requireAdmin() {
  const session = await getSession();

  if (!session) {
    throw new Error("Tidak terautentikasi");
  }

  if (session.user.role !== "admin") {
    throw new Error("Hanya admin yang boleh melakukan moderasi");
  }

  return session;
}

export async function blockDiary(id: number) {
  await requireAdmin();

  const diary = await prisma.diary.findUnique({ where: { id } });

  if (!diary || diary.status !== "public") {
    throw new Error("Hanya public diary yang dapat di-block");
  }

  await prisma.diary.update({
    where: { id },
    data: { status: "draft", moderationStatus: "blocked" },
  });

  revalidatePath("/admin");
  revalidatePath("/feed");
  revalidatePath("/explore");
}

export async function reviseDiary(id: number) {
  await requireAdmin();

  const diary = await prisma.diary.findUnique({ where: { id } });

  if (!diary || diary.status !== "public") {
    throw new Error("Hanya public diary yang dapat diminta revisi");
  }

  await prisma.diary.update({
    where: { id },
    data: { status: "draft", moderationStatus: "revision" },
  });

  revalidatePath("/admin");
  revalidatePath("/feed");
  revalidatePath("/explore");
}
