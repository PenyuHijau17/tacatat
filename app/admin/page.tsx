import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";
import { blockDiary, reviseDiary } from "./actions";

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const publicDiaries = await prisma.diary.findMany({
    where: { status: "public" },
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <main>
      <h1>Admin Dashboard</h1>

      <p>Selamat datang, {session.user.name}</p>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>

      <h2>Moderasi Public Diary</h2>

      {publicDiaries.length === 0 ? (
        <p>Tidak ada public diary.</p>
      ) : (
        <ul>
          {publicDiaries.map((diary) => (
            <li key={diary.id}>
              {diary.title} — oleh {diary.author.name}{" "}
              <form action={blockDiary.bind(null, diary.id)} style={{ display: "inline" }}>
                <button type="submit">Block</button>
              </form>{" "}
              <form action={reviseDiary.bind(null, diary.id)} style={{ display: "inline" }}>
                <button type="submit">Revisi</button>
              </form>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

