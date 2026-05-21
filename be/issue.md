<<<<<<< Updated upstream
# Refaktor Kategori Laporan (Enum Category Update)

## Deskripsi Masalah
Terdapat perubahan kesepakatan dari tim terkait kategori pelaporan. Saat ini, sistem (database, validasi controller, dan dokumentasi Swagger) masih menggunakan nilai kategori lama. Kita perlu melakukan refaktor secara total agar kategori menggunakan format bahasa Inggris (*UPPER_SNAKE_CASE*).

Kategori yang **baru dan valid** saat ini hanya ada 5, yaitu:
- `WASTE`
- `SIGNS_AND_MARKINGS`
- `PUBLIC_FACILITIES`
- `ROAD_AND_SIDEWALK`
- `TREES_AND_GREEN_SPACE`

---

## 🛠️ Langkah-Langkah Implementasi (Task List)

Tugas ini dirancang agar dapat dikerjakan dengan mudah secara mandiri oleh Junior Developer atau AI model. Silakan kerjakan checklist berikut secara berurutan:

### 1. Update Skema Database (`sql/schema.sql`)
- Buka file `sql/schema.sql`.
- Cari deklarasi tabel `reports`.
- Pada definisi kolom `category`, ubah dari `ENUM(...)` yang lama menjadi:
  `category ENUM('WASTE', 'SIGNS_AND_MARKINGS', 'PUBLIC_FACILITIES', 'ROAD_AND_SIDEWALK', 'TREES_AND_GREEN_SPACE') NOT NULL`

### 2. Update Validasi API (`src/controllers/report.controller.js`)
- Buka file `src/controllers/report.controller.js`.
- Cari method `createReport` yang menangani pembuatan laporan baru (POST `/api/reports`).
- Temukan array validasi `allowedCategories`.
- Ganti isi array tersebut agar persis berisi 5 kategori baru di atas. Jika user mengirimkan kategori di luar daftar ini, pastikan endpoint mengembalikan error `400 Bad Request`.

### 3. Update Dokumentasi API (Swagger JSDoc)
Karena dokumentasi API kita berbasis JSDoc (di router dan config), Anda harus memperbarui spesifikasi Swagger agar sesuai dengan kategori baru.
- Buka `src/config/swagger.js`. Pada bagian skema `Report`, ubah nilai property `enum` dan berikan `example` yang baru (contoh: `"ROAD_AND_SIDEWALK"`).
- Buka `src/routes/report.routes.js`. Pada dokumentasi `@swagger` di endpoint `POST /api/reports` dan `GET /api/reports`, perbarui nilai `enum` dan `example` di dokumentasi query parameter dan body request.

### 4. Pengujian (Testing)
- Restart server (`npm run dev` atau `npm start`). Server otomatis akan mengeksekusi `schema.sql` dan merombak tabel karena ada instruksi `DROP TABLE IF EXISTS`.
- Buka Swagger UI (biasanya di `http://localhost:5000/api-docs`).
- Pastikan bahwa API pembuatan laporan menolak kategori lama dan berhasil memproses jika menggunakan salah satu kategori baru di atas.

---

**Mohon pastikan seluruh checklist di atas diselesaikan dengan cermat dan divalidasi sebelum mengajukan Pull Request (PR)!**
=======
# Task: Update README.md to Match Recent Changes

## Description
Perbarui file `readme.md` agar mencerminkan perubahan dan update terbaru pada sistem. Penyesuaian ini sangat penting agar dokumentasi selaras dengan source code backend saat ini.

Fokus pembaruan terutama pada bagian:
1. **Reports**
   - Penambahan kolom `time_report` dan `time_close` pada skema database.
   - Penghapusan kolom `created_at` (jika ada di dokumentasi sebelumnya).
   - Pembaruan endpoint dan format response (termasuk API historis laporan).

2. **Report Images**
   - Penjelasan relasi antara tabel `reports` dan `report_images`.
   - Update bagaimana gambar ditangani dalam laporan.

3. **Locations**
   - Pembaruan skema `locations` yang sekarang *hanya* menyimpan koordinat (latitude dan longitude), tanpa data string wilayah seperti provinsi atau kota.

## Checklist
- [ ] Sesuaikan deskripsi tabel `reports` dengan skema terbaru.
- [ ] Sesuaikan deskripsi tabel `locations` dengan skema terbaru.
- [ ] Jelaskan mekanisme handling `report images`.
- [ ] Validasi daftar endpoint API agar akurat.
>>>>>>> Stashed changes
