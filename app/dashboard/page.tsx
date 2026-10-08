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
    <main>
      <h1>Dashboard</h1>

      <p>Selamat datang, {session.user.name}</p>
      <p>Email: {session.user.email}</p>
      <p>Role: {session.user.role}</p>

      <p>
        <Link href="/diaries">Private Space</Link>
      </p>

      <LogoutButton />
    </main>
  );
}
