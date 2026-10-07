# TACATAT — PROJECT RULES

## 1. Tentang TACATAT

TACATAT adalah sebuah Social Diary berbasis web.

Tujuan utama TACATAT adalah menjadi tempat bagi pengguna untuk menulis, menyimpan, mengelola, dan membagikan diary mereka.

Diary adalah inti utama website.

Fitur sosial seperti like, komentar, follow, dan fitur interaksi lainnya hanya menjadi pendukung pengalaman diary, bukan menggantikan fungsi diary sebagai fokus utama website.


## 2. Konsep Utama

TACATAT memiliki dua jenis ruang diary:

### Public Diary

Diary yang dipilih untuk dibagikan kepada publik.

Public diary:
- dapat dilihat oleh pengguna lain;
- dapat muncul di area publik;
- dapat menerima interaksi sosial sesuai aturan website;
- dapat dikelola dan dimoderasi oleh admin.

### Private Diary

Diary pribadi milik seorang writter.

Private diary:
- hanya dapat diakses oleh pemiliknya;
- tidak ditampilkan di area publik;
- tidak dapat diakses oleh pengguna lain;
- tidak dapat diakses oleh admin.

Private diary harus selalu dilindungi oleh authorization di sisi server.


## 3. Role

TACATAT memiliki dua role utama:

- admin
- writter

Tidak menambahkan role lain tanpa keputusan khusus.


## 4. Writter

Writter adalah pengguna yang membuat dan mengelola diary.

Writter dapat:
- membuat diary;
- membaca diary miliknya;
- mengedit diary miliknya;
- menghapus diary miliknya;
- menyimpan diary sebagai private;
- membagikan diary sebagai public;
- mengelola isi diary miliknya;
- mengelola profile miliknya;
- menggunakan fitur sosial yang tersedia.

Writter hanya boleh mengubah diary yang memang menjadi miliknya.


## 5. Admin

Admin bertugas mengelola bagian publik dan administrasi TACATAT.

Admin dapat:
- mengelola akun/user sesuai kebutuhan administrasi;
- mengelola public diary;
- melakukan moderasi terhadap konten publik;
- mengelola data publik yang memang diperbolehkan oleh sistem;
- mengelola komentar atau laporan pada area publik sesuai aturan.

### Aturan penting

Admin TIDAK BOLEH mengakses private diary milik writter.

Admin tidak boleh:
- membaca isi private diary;
- membuka private space milik writter;
- melihat detail private diary;
- mengedit private diary;
- menghapus private diary;
- menggunakan hak admin untuk melewati aturan private diary.

Hak admin tidak boleh menjadi jalan untuk melewati privasi writter.


## 6. Diary

Diary merupakan fitur dan data utama TACATAT.

Diary dapat memiliki informasi seperti:
- judul;
- isi diary;
- tanggal;
- mood;
- gambar;
- tags;
- status public/private;
- informasi pemilik.

Pengembangan diary harus selalu mempertahankan fokus utama TACATAT sebagai Social Diary.


## 7. Diary Ownership

Setiap diary harus memiliki pemilik.

Writter hanya dapat:
- melihat diary miliknya;
- membuat diary miliknya;
- mengedit diary miliknya;
- menghapus diary miliknya.

User tidak boleh mendapatkan akses terhadap diary milik writter lain hanya dengan mengubah URL, ID, parameter, atau request.

Ownership harus diperiksa melalui authorization di server.


## 8. Status Diary

Diary dapat memiliki status:

- draft;
- public;
- private.

Status digunakan untuk menentukan bagaimana diary diperlakukan oleh sistem.

Diary private tidak boleh masuk ke area publik.

Diary yang belum dipublikasikan tidak boleh dianggap sebagai public diary hanya karena URL atau ID-nya diketahui.


## 9. Public Diary

Public diary merupakan bagian utama dari area sosial TACATAT.

Public diary dapat:
- ditampilkan pada public feed;
- dibaca oleh pengguna lain;
- menerima like;
- menerima komentar;
- menerima interaksi sosial lain yang memang direncanakan;
- dimoderasi oleh admin.

Public diary tetap merupakan diary terlebih dahulu dan elemen sosial hanya menjadi pendukung.


## 10. Private Space

TACATAT memiliki konsep Private Space sebagai tempat writter mengelola diary pribadinya.

Private Space harus benar-benar privat.

```text
Writter
   ↓
Private Space miliknya
   ↓
Private Diary


User lain tidak boleh masuk.

Admin juga tidak boleh masuk.

UI, route, API, database query, dan server authorization harus mengikuti aturan tersebut.


11. Moderation

Admin dapat melakukan moderasi terhadap public diary.

Moderasi memiliki dua tindakan utama:

Block

block berarti public diary dianggap tidak layak berada di area publik.

Diary yang di-block:

dikeluarkan dari area publik;
tidak dapat tampil sebagai public content;
dikembalikan kepada writter untuk ditangani sesuai mekanisme yang dibuat.
Revisi

revisi berarti diary dikembalikan kepada writter karena membutuhkan perbaikan.

Writter kemudian dapat memperbaiki diary sebelum diajukan kembali untuk public.

Batas Moderasi

Moderasi admin berlaku terhadap public content.

Moderasi tidak boleh digunakan sebagai alasan untuk membuka private diary writter.

12. Fitur Sosial

Fitur sosial merupakan fitur pendukung diary.

Fitur sosial yang dapat dikembangkan meliputi:

like;
comment;
reply;
bookmark;
share;
report;
follow;
profile;
notification.

Fitur sosial tidak boleh menggeser fokus TACATAT dari diary.

13. Mood

Diary dapat memiliki mood.

Mood merupakan bagian dari pengalaman diary dan dapat digunakan untuk:

memberi konteks terhadap diary;
membantu pengguna memahami suasana tulisan;
mendukung eksplorasi diary;
mendukung fitur statistik atau tampilan mood apabila fitur tersebut dikembangkan.
14. Public Feed dan Reader

TACATAT memiliki area untuk menemukan dan membaca public diary.

Public feed harus:

hanya menampilkan diary yang memang boleh berada di area publik;
tidak menampilkan private diary;
tidak membocorkan isi private diary melalui pencarian, API, metadata, atau response lainnya.

Reader harus tetap menonjolkan isi diary, bukan hanya elemen sosialnya.

15. Search dan Explore

TACATAT dapat memiliki fitur:

search;
explore;
filtering berdasarkan mood atau informasi diary lainnya.

Search dan explore hanya boleh bekerja terhadap data yang memang boleh ditemukan oleh pengguna.

Private diary tidak boleh muncul melalui:

search;
explore;
public feed;
rekomendasi;
metadata publik;
endpoint/API publik.
16. Profile

Pengguna memiliki profile.

Profile dapat digunakan untuk menampilkan informasi publik yang memang diperbolehkan.

Profile tidak boleh digunakan untuk membocorkan private diary milik writter.

17. Authentication

TACATAT membutuhkan authentication untuk membedakan:

user yang belum login;
writter;
admin.

Protected pages dan protected actions harus memeriksa authentication.

Role harus diperiksa melalui authorization.

Authentication dan authorization adalah dua hal yang berbeda dan keduanya harus diterapkan dengan benar.

18. Authorization

Semua aturan akses penting harus diperiksa di server.

Jangan mengandalkan:

menyembunyikan tombol;
menyembunyikan menu;
redirect dari client;
pengecekan UI saja.

Contoh:

Jika admin tidak boleh membuka private diary, maka server harus benar-benar menolak request tersebut.

Bukan hanya:

Private Diary
     ↓
tombol disembunyikan dari admin

tetapi:

Request admin
     ↓
Server memeriksa permission
     ↓
Akses ditolak
19. Tech Stack

TACATAT dibangun menggunakan:

Next.js;
TypeScript;
Docker;
PostgreSQL;
Prisma;
Tailwind CSS.

Project dijalankan menggunakan environment Docker.

Development environment harus menjaga konsistensi versi dan dependency project.

20. Struktur Pengembangan

Pengembangan fitur mengikuti alur:

Requirement
    ↓
Design / Planning
    ↓
Database Design
    ↓
Implementation
    ↓
Authorization
    ↓
UI
    ↓
Testing
    ↓
Review
    ↓
Git Commit

Jangan langsung membuat banyak fitur tanpa memastikan fitur sebelumnya benar.

21. Definition of Done

Sebuah fitur tidak dianggap selesai hanya karena tampil di browser.

Fitur dianggap selesai apabila:

requirement sudah sesuai;
implementasi berjalan;
authorization benar;
data yang dihasilkan benar;
UI bekerja;
error handling diperhatikan;
test/verifikasi dilakukan;
tidak melanggar aturan private/public;
tidak merusak fitur sebelumnya;
kode sudah direview;
perubahan sudah di-commit ke Git.
22. Aturan Penggunaan AI

AI boleh digunakan untuk:

membantu merancang fitur;
menjelaskan konsep;
membuat kode;
memperbaiki error;
membuat test;
melakukan refactoring;
membantu dokumentasi.

Namun hasil AI harus selalu diperiksa.

Jangan menganggap kode benar hanya karena:

berhasil di-generate;
tidak menunjukkan error;
berhasil dijalankan sekali;
terlihat bagus.

Setiap hasil AI harus dibandingkan dengan aturan TACATAT.

Jika hasil AI bertentangan dengan PROJECT_RULES.md, maka aturan project harus diutamakan.

23. Prinsip Pengembangan

TACATAT dikembangkan dengan prinsip:

Diary First

Diary adalah pusat TACATAT.

Privacy First

Private diary benar-benar privat, termasuk dari admin.

Authorization First

Permission harus ditegakkan di server.

Verification First

Fitur harus diverifikasi sebelum dianggap selesai.

Simple Before Complex

Jangan menambahkan kompleksitas yang belum dibutuhkan.

Context Before Code

Pahami requirement dan aturan project sebelum menulis implementasi.

24. Aturan yang Tidak Boleh Dilupakan
1. Role hanya:
   admin
   writter

2. Diary adalah inti utama website.

3. Diary dapat bersifat public atau private.

4. Private diary hanya dapat diakses pemiliknya.

5. Admin TIDAK BOLEH mengakses private diary writter.

6. Admin dapat mengelola public diary.

7. Moderasi block dan revisi berlaku untuk public content.

8. Private diary tidak boleh bocor melalui UI, route,
   API, search, explore, atau metadata.

9. Authorization harus dilakukan di server.

10. Fitur sosial adalah pendukung diary.

11. Jangan menambahkan fitur besar hanya karena AI bisa membuatnya.

12. Setiap fitur harus diverifikasi sebelum dianggap selesai.

13. Perubahan yang sudah selesai harus di-commit ke Git.
25. Tujuan Akhir TACATAT

TACATAT bukan sekadar aplikasi yang memiliki fitur diary.

TACATAT harus menjadi sebuah Social Diary di mana:

                 DIARY
                   │
          ┌────────┴────────┐
          │                 │
       PRIVATE            PUBLIC
          │                 │
          │           ┌─────┴─────┐
          │           │           │
        Owner        Reader      Social
                                  │
                            Like / Comment
                            Follow / Share
          │
    Private Space

Semua fitur yang ditambahkan harus mendukung konsep tersebut.

Diary tetap menjadi pusat TACATAT.


Menurutku versi ini lebih cocok dijadikan file sebenarnya karena **nggak terlalu banyak hiasan**, tapi tetap punya struktur yang jelas untuk dibaca manusia maupun dijadikan context oleh AI.

Satu catatan: aku sengaja **tidak memasukkan detail implementasi yang belum benar-benar kita putuskan**. Jadi file ini berfungsi sebagai arah/ketentuan produk, bukan sebagai dokumentasi kode.