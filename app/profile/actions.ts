"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";

export async function updateProfile(formData: FormData) {
  const session = await getSession();

  if (!session) {
    throw new Error("Tidak terautentikasi");
  }

  const name = String(formData.get("name") ?? "").trim();

  if (!name) {
    return;
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { name },
  });

  revalidatePath("/profile");
  revalidatePath("/dashboard");
  revalidatePath(`/user/${session.user.id}`);
}
