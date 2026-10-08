"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";

export async function markRead(id: number) {
  const session = await getSession();

  if (!session) {
    throw new Error("Tidak terautentikasi");
  }

  const notification = await prisma.notification.findUnique({ where: { id } });

  if (!notification || notification.userId !== session.user.id) {
    throw new Error("Notifikasi tidak ditemukan");
  }

  await prisma.notification.update({
    where: { id },
    data: { read: true },
  });

  revalidatePath("/notifications");
}
