# 🌐 Envireport - Fullstack Setup Guide

Selamat datang di proyek **Envireport**! Repositori ini dibagi menjadi dua bagian utama:

- **/fe:** Frontend menggunakan *React.js (Vite)*
- **/be:** Backend menggunakan *Express.js & MySQL*

> ⚠️ **PENTING:** Proyek ini tidak memiliki `package.json` di root folder. Anda **wajib** berpindah ke folder `/be` atau `/fe` terlebih dahulu sebelum menjalankan perintah `npm`.

---

## 🛠️ Persiapan Awal (Prerequisites)

Sebelum memulai, pastikan perangkat Anda sudah terinstal aplikasi berikut:

- **Node.js** (Versi 18 atau terbaru)
- **MySQL Server** (Bisa via XAMPP, Laragon, atau Docker)
- **Git**

---

## 💾 1. Backend Setup (`/be`)

Buka terminal baru, lalu masuk ke folder backend:

```bash
cd be
```

### 🔹 Langkah A: Buat & Konfigurasi Database MySQL

1. Buka database manager pilihan Anda (phpMyAdmin / DBeaver / Navicat).
2. Buat database baru dengan nama: `envireport`
3. Eksekusi seluruh skrip SQL yang ada di dalam berkas [be/sql/schema.sql](file:///d:/prj/InfiniteLearning/Web/Hamameyu/be/sql/schema.sql).
   
   *Skema inti database mencakup tabel:*
   - `users`: Data pengguna (warga & admin).
   - `roles` & `user_roles`: Sistem hak akses/peran (`resident`, `admin`).
   - `locations`: Koordinat latitude dan longitude laporan.
   - `reports`: Data utama laporan aduan warga.
   - `report_images`: Menyimpan path/URL lampiran gambar laporan (maksimal 2 gambar per laporan).

### 🔹 Langkah B: Setup Environment Variables

Buat file baru bernama `.env` di dalam folder `/be`, lalu sesuaikan konfigurasinya:

```env
PORT=5000
NODE_ENV=development
DB_HOST=127.0.0.1
DB_USER=root
DB_PASSWORD=isi_password_mysql_kamu
DB_NAME=envireport
DB_PORT=3306
JWT_SECRET=MasukanKataKunciRahasiaBebasDisini123!
```

### 🔹 Langkah C: Install & Jalankan Backend

Jalankan perintah berikut secara berurutan di dalam terminal folder `/be`:

```bash
npm install
npm run dev
```

> 🚀 **Info:** Backend akan berjalan di URL: `http://localhost:5000`

---

## 💻 2. Frontend Setup (`/fe`)

Buka **terminal baru** (pisahkan dengan terminal backend), lalu masuk ke folder frontend:

```bash
cd fe
```

### 🔹 Langkah A: Install & Jalankan Frontend

Jalankan perintah berikut di dalam terminal folder `/fe`:

```bash
npm install
npm run dev
```

> 🚀 **Info:** Frontend akan berjalan di URL lokal: `http://localhost:5173`

---

## ⚠️ Catatan Penting Pengujian & Integrasi

- **Autentikasi Berbasis Cookie:** Proyek ini menggunakan *HttpOnly Cookies* untuk menyimpan token login (`token`). Token akan terkirim otomatis di browser atau Postman selama opsi *Credentials / Include Cookies* aktif.
- **Upload File Gambar**: Proses upload gambar di frontend menggunakan format `multipart/form-data` dengan field key `images` (mendukung maksimal 2 gambar).
- **Masalah CORS:** Jika frontend gagal memanggil API backend, pastikan backend sudah mengizinkan origin URL dari frontend (`http://localhost:5173`) pada konfigurasi CORS di Express.
