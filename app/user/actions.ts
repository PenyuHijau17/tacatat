"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";

export async function toggleFollow(userId: string) {
  const session = await getSession();
  if (!session) {
    throw new Error("Tidak terautentikasi");
  }

  if (session.user.id === userId) {
    throw new Error("Tidak bisa follow diri sendiri");
  }

  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) {
    throw new Error("User tidak ditemukan");
  }

  const existing = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId: session.user.id, followingId: userId } },
  });

  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } });
  } else {
    await prisma.follow.create({
      data: { followerId: session.user.id, followingId: userId },
    });

    await prisma.notification.create({
      data: {
        userId,
        type: "follow",
        message: `${session.user.name} mulai mengikuti Anda`,
        url: `/user/${session.user.id}`,
      },
    });
  }

  revalidatePath(`/user/${userId}`);
}
