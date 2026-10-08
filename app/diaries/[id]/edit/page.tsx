import { notFound, redirect } from "next/navigation";
import { getSession } from "@/app/lib/session";
import { prisma } from "@/app/lib/prisma";
import { updateDiary } from "../../actions";

export default async function EditDiaryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ error?: string }>;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const { error } = await searchParams;
  const diaryId = Number(id);

  if (!Number.isInteger(diaryId)) {
    notFound();
  }

  const diary = await prisma.diary.findUnique({ where: { id: diaryId } });

  if (!diary || diary.authorId !== session.user.id) {
    notFound();
  }

  const updateWithId = updateDiary.bind(null, diary.id);

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">Edit Diary</h1>

      {error && <p role="alert" className="text-red-600">{error}</p>}

      <form action={updateWithId}>
        <div>
          <label htmlFor="title">Judul</label>
          <input
            id="title"
            name="title"
            type="text"
            defaultValue={diary.title}
            required
          />
        </div>

        <div>
          <label htmlFor="content">Isi</label>
          <textarea
            id="content"
            name="content"
            defaultValue={diary.content}
            required
          />
        </div>

        <div>
          <label htmlFor="mood">Mood (opsional)</label>
          <input
            id="mood"
            name="mood"
            type="text"
            defaultValue={diary.mood ?? ""}
          />
        </div>

        <div>
          <label htmlFor="tags">Tags (pisahkan dengan koma, opsional)</label>
          <input
            id="tags"
            name="tags"
            type="text"
            defaultValue={diary.tags.join(", ")}
          />
        </div>

        <div>
          <label htmlFor="status">Status</label>
          <select className="rounded border border-zinc-300 px-3 py-2" id="status" name="status" defaultValue={diary.status}>
            <option value="draft">Draft</option>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </div>

        <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white">Simpan Perubahan</button>
      </form>
    </main>
  );
}
