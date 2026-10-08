import { createDiary } from "../actions";

export default async function NewDiaryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-4 p-6">
      <h1 className="text-2xl font-bold">Diary Baru</h1>

      {error && <p role="alert" className="text-red-600">{error}</p>}

      <form action={createDiary}>
        <div>
          <label htmlFor="title">Judul</label>
          <input className="w-full rounded border border-zinc-300 px-3 py-2" id="title" name="title" type="text" required />
        </div>

        <div>
          <label htmlFor="content">Isi</label>
          <textarea className="w-full rounded border border-zinc-300 px-3 py-2" rows={6} id="content" name="content" required />
        </div>

        <div>
          <label htmlFor="mood">Mood (opsional)</label>
          <input className="w-full rounded border border-zinc-300 px-3 py-2" id="mood" name="mood" type="text" />
        </div>

        <div>
          <label htmlFor="tags">Tags (pisahkan dengan koma, opsional)</label>
          <input className="w-full rounded border border-zinc-300 px-3 py-2" id="tags" name="tags" type="text" />
        </div>

        <div>
          <label htmlFor="status">Status</label>
          <select className="rounded border border-zinc-300 px-3 py-2" id="status" name="status" defaultValue="draft">
            <option value="draft">Draft</option>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </div>

        <button type="submit" className="rounded bg-zinc-900 px-4 py-2 text-white">Simpan</button>
      </form>
    </main>
  );
}
