# Panduan Pengujian Global: Fitur Upload Gambar & Detail Laporan

Panduan ini berisi alur pengujian lengkap untuk fitur upload gambar pada form laporan serta verifikasi gambar di halaman detail laporan. Ikuti langkah-langkah di bawah ini untuk memastikan fitur bekerja dengan benar pada skenario berhasil maupun gagal.

---

## 📋 Prasyarat Pengujian (Prerequisites)

Sebelum memulai pengujian, pastikan:
1. **Backend Aktif**: Server backend berjalan di `http://localhost:5000` (Jalankan `npm run dev` di folder `/be`).
2. **Frontend Aktif**: Server frontend berjalan di `http://localhost:5173` (Jalankan `npm run dev` di folder `/fe`).
3. **Database Siap**: Pastikan MySQL berjalan dan tabel `report_images` sudah terbuat.
4. **Sudah Login**: Pastikan Anda telah melakukan login di frontend sebagai warga/resident agar cookie JWT token aktif.

---

## 🟢 Alur Pengujian 1: Skenario Sukses (Success Flow)

Skenario ini menguji pengiriman laporan baru dengan menyertakan gambar valid dan memverifikasi visualisasinya di halaman detail.

### Langkah-langkah Pengujian:
1. Buka halaman pembuatan laporan di browser: `http://localhost:5173/report/submit`.
2. Isi data laporan secara lengkap:
   * **Judul**: `Jalan Rusak Ring Road`
   * **Deskripsi**: `Ada lubang sedalam 15cm yang membahayakan pengendara motor.`
   * **Kategori**: Pilih `Jalan & Trotoar Rusak`.
   * **Prioritas**: Pilih `Tinggi / Mendesak (High)`.
3. Klik pada peta lokasi untuk menandai koordinat laporan.
4. Di bagian **Foto Lampiran Bukti**, klik area upload dan pilih **1 atau 2 file gambar** (Format `.jpg` / `.png` dengan ukuran masing-masing di bawah 2MB).
5. Buka **Developer Tools** di browser Anda (`F12` atau klik kanan -> `Inspect`), lalu masuk ke tab **Network**.
6. Klik tombol **"Kirim Laporan Resmi Warga"**.

### Ekspektasi Hasil Berhasil (Expected Success):
* **Notifikasi Frontend**: Muncul alert browser bertuliskan `"Laporan Anda berhasil dikirim ke sistem aduan warga."`.
* **Navigasi**: Setelah menekan "OK" pada alert, halaman otomatis berpindah kembali ke halaman dashboard/daftar laporan.
* **Analisis Network Tab (F12)**:
  * Cari request `POST /api/reports` yang berstatus **`201 Created`**.
  * Periksa **Request Headers**: `Content-Type` harus bernilai `multipart/form-data; boundary=...`.
  * Periksa **Request Payload / Form Data**: Memuat semua text field dan data binary file di key `images`.
* **Penyimpanan Server & Database**:
  * Periksa folder backend `be/uploads/reports/`, pastikan file gambar fisik yang diunggah tersimpan di sana dengan nama unik (timestamp prefix).
  * Lakukan query di database: `SELECT * FROM report_images;`. Baris baru harus tercatat dengan `image_url` yang mengarah ke path gambar statis (contoh: `/uploads/reports/filename.jpg`).
* **Verifikasi Tampilan Detail Laporan**:
  * Buka detail laporan yang baru saja dibuat (`http://localhost:5173/reports/<id_laporan_baru>`).
  * Di bagian **Foto Bukti**, gambar yang Anda upload harus muncul dengan sempurna dan tidak ada gambar yang pecah/error.

---

## 🔴 Alur Pengujian 2: Skenario Gagal (Failure Flow)

Skenario ini menguji pertahanan sistem (validasi) terhadap input yang tidak sesuai aturan.

### Kasus Gagal A: Mengunggah Lebih dari 2 Gambar
1. Buka kembali halaman pembuatan laporan.
2. Isi data wajib form dan pilih koordinat di peta.
3. Di bagian upload gambar, pilih **3 file gambar** sekaligus.
4. Klik **"Kirim Laporan Resmi Warga"**.
* **Ekspektasi Hasil**:
  * Muncul pesan alert error dari sistem: `"Maksimal 2 gambar yang diperbolehkan."`.
  * Request `POST /api/reports` mengembalikan status code **`400 Bad Request`**.
  * Laporan baru **tidak tersimpan** ke database dan tidak ada file baru yang masuk ke folder uploads.

### Kasus Gagal B: Ukuran File Gambar Melebihi Batas (Max 2MB)
1. Siapkan file gambar yang ukurannya sengaja dibuat lebih besar dari 2MB (misal: 3MB atau lebih).
2. Isi data form pembuatan laporan.
3. Upload gambar berukuran besar tersebut.
4. Klik **"Kirim Laporan Resmi Warga"**.
* **Ekspektasi Hasil**:
  * Muncul pesan alert error dari sistem: `"Ukuran file maksimal adalah 2MB per gambar."`.
  * Request `POST /api/reports` gagal dengan status code **`400 Bad Request`**.

### Kasus Gagal C: Sesi Login Kadaluarsa / Tidak Terautentikasi
1. Lakukan logout dari aplikasi, atau hapus cookie token JWT Anda melalui DevTools browser (Tab `Application` -> `Cookies` -> Hapus token).
2. Coba kirim data laporan baru melalui API / pengisian form.
* **Ekspektasi Hasil**:
  * Muncul pesan alert error: `"Sesi tidak valid atau user_id tidak ditemukan. Silakan login kembali."`.
  * Request `POST /api/reports` mengembalikan status code **`401 Unauthorized`**.

---

## 🛠️ Daftar Checklist Pengujian Mandiri bagi User

Silakan centang checklist berikut saat Anda melakukan pengujian langsung di browser:

- [ ] Membuka form dan mengunggah **1 gambar** -> Berhasil terkirim & gambar muncul di halaman detail.
- [ ] Membuka form dan mengunggah **2 gambar** -> Berhasil terkirim & kedua gambar muncul di halaman detail.
- [ ] Mengunggah **3 gambar** -> Ditolak oleh sistem dengan pesan error maks 2 gambar.
- [ ] Mengunggah gambar **> 2MB** -> Ditolak oleh sistem dengan pesan error maks ukuran file 2MB.
- [ ] Memeriksa tab Network -> Mengonfirmasi payload terkirim sebagai `multipart/form-data`.
- [ ] Memeriksa folder backend `/be/uploads/reports/` -> File gambar beneran masuk ke server lokal.
