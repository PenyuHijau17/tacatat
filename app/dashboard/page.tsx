import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import LogoutButton from "./logout-button";

export default async function DashboardPage() {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <p>Selamat datang, {session.user.name}</p>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>

      <p>
        <Link href="/diaries">Private Space</Link>
      </p>
      <p>
        <Link href="/profile">Profile</Link>
      </p>
      <p>
        <Link href="/bookmarks">Bookmark</Link>
      </p>

      <LogoutButton />
    </main>
  );
}
