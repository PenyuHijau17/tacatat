import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import { updateProfile } from "./actions";

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

      <h2 className="text-xl font-semibold">Ubah Nama</h2>
      <form action={updateProfile}>
        <input
          name="name"
          defaultValue={session.user.name}
          required
          className="w-full rounded border border-zinc-300 px-3 py-2"
        />
        <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white">
          Simpan
        </button>
      </form>

      <p>
        <Link href="/diaries">Diary Saya</Link>
      </p>
    </main>
  );
}
