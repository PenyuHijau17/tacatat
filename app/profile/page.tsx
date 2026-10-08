import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";

export default async function ProfilePage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">Profile</h1>

      <p>Nama: {session.user.name}</p>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>
      <p>Bergabung: {new Date(session.user.createdAt).toLocaleDateString("id-ID")}</p>

      <p>
        <Link href="/diaries">Diary Saya</Link>
      </p>
    </main>
  );
}
