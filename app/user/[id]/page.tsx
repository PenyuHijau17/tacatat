import Link from "next/link";
import { notFound } from "next/navigation";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";
import { toggleFollow } from "../actions";

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      diaries: {
        where: { status: "public" },
        orderBy: { createdAt: "desc" },
      },
      _count: { select: { followers: true, following: true } },
    },
  });

  if (!user) {
    notFound();
  }

  const session = await getSession();
  const isOwnProfile = session?.user.id === user.id;

  let isFollowing = false;
  if (session && !isOwnProfile) {
    const existing = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: user.id,
        },
      },
    });
    isFollowing = !!existing;
  }

  const toggleFollowWithId = toggleFollow.bind(null, user.id);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">{user.name}</h1>
      <p>
        {user._count.followers} followers · {user._count.following} following
      </p>

      {session && !isOwnProfile && (
        <form action={toggleFollowWithId}>
          <button
            type="submit"
            className="rounded bg-zinc-900 px-4 py-2 text-white"
          >
            {isFollowing ? "Unfollow" : "Follow"}
          </button>
        </form>
      )}

      <h2 className="text-xl font-semibold">Public Diary</h2>

      {user.diaries.length === 0 ? (
        <p>Belum ada diary publik.</p>
      ) : (
        <ul>
          {user.diaries.map((diary) => (
            <li key={diary.id}>
              <Link href={`/feed/${diary.id}`}>{diary.title}</Link>
              {diary.mood ? ` — mood: ${diary.mood}` : ""}
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
