import { createDiary } from "../actions";

export default function NewDiaryPage() {
  return (
    <main>
      <h1>Diary Baru</h1>

      <form action={createDiary}>
        <div>
          <label htmlFor="title">Judul</label>
          <input id="title" name="title" type="text" required />
        </div>

        <div>
          <label htmlFor="content">Isi</label>
          <textarea id="content" name="content" required />
        </div>

        <div>
          <label htmlFor="mood">Mood (opsional)</label>
          <input id="mood" name="mood" type="text" />
        </div>

        <div>
          <label htmlFor="tags">Tags (pisahkan dengan koma, opsional)</label>
          <input id="tags" name="tags" type="text" />
        </div>

        <div>
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue="draft">
            <option value="draft">Draft</option>
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>
        </div>

        <button type="submit">Simpan</button>
      </form>
    </main>
  );
}
