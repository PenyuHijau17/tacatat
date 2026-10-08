import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { getSession } from "@/app/lib/session";
import { toggleLike, addComment, toggleBookmark, reportDiary } from "../actions";

export default async function PublicDiaryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const diaryId = Number(id);

  if (!Number.isInteger(diaryId)) {
    notFound();
  }

  const diary = await prisma.diary.findUnique({
    where: { id: diaryId },
    include: {
      author: { select: { name: true } },
      likes: true,
      bookmarks: true,
      comments: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { name: true } } },
      },
    },
  });

  // Hanya diary public yang boleh tampil; draft dan private
  // diperlakukan sama seperti tidak ditemukan.
  if (!diary || diary.status !== "public") {
    notFound();
  }

  const session = await getSession();
  const toggleLikeWithId = toggleLike.bind(null, diary.id);
  const toggleBookmarkWithId = toggleBookmark.bind(null, diary.id);
  const reportDiaryWithId = reportDiary.bind(null, diary.id);
  const addCommentWithId = addComment.bind(null, diary.id);
  const isBookmarked = session
    ? diary.bookmarks.some((bookmark) => bookmark.userId === session.user.id)
    : false;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">{diary.title}</h1>

      <p>Oleh: <Link href={`/user/${diary.authorId}`}>{diary.author.name}</Link></p>
      {diary.mood && <p>Mood: {diary.mood}</p>}
      {diary.tags.length > 0 && <p>Tags: #{diary.tags.join(" #")}</p>}
      <p>{new Date(diary.createdAt).toLocaleDateString("id-ID")}</p>

      <p>{diary.content}</p>

      <p>{diary.likes.length} like</p>
      {session ? (
        <form action={toggleLikeWithId}>
          <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white">
            Like / Unlike
          </button>
        </form>
      ) : (
        <p>Login untuk memberi like.</p>
      )}

      {session ? (
        <form action={toggleBookmarkWithId}>
          <button type="submit" className="rounded border border-zinc-300 px-4 py-2">
            {isBookmarked ? "Hapus Bookmark" : "Bookmark"}
          </button>
        </form>
      ) : (
        <p>Login untuk mem-bookmark.</p>
      )}

      {session ? (
        <form action={reportDiaryWithId}>
          <label htmlFor="reason">Laporkan diary ini</label>
          <textarea
            id="reason"
            name="reason"
            rows={2}
            required
            className="w-full rounded border border-zinc-300 px-3 py-2"
            placeholder="Alasan laporan"
          />
          <button type="submit" className="rounded border border-red-300 px-4 py-2 text-red-700">
            Kirim Laporan
          </button>
        </form>
      ) : (
        <p>Login untuk melaporkan.</p>
      )}

      <h2 className="text-xl font-semibold">Komentar</h2>

      {diary.comments.length === 0 ? (
        <p>Belum ada komentar.</p>
      ) : (
        <ul>
          {diary.comments.map((comment) => (
            <li key={comment.id}>
              <strong>{comment.user.name}:</strong> {comment.content}
            </li>
          ))}
        </ul>
      )}

      {session ? (
        <form action={addCommentWithId}>
          <textarea
            name="content"
            rows={3}
            required
            className="w-full rounded border border-zinc-300 px-3 py-2"
            placeholder="Tulis komentar..."
          />
          <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white">
            Kirim
          </button>
        </form>
      ) : (
        <p>Login untuk berkomentar.</p>
      )}
    </main>
  );
}
