# Issue: Implementasi API Documentation dengan Swagger UI

## 🎯 Konteks Proyek Backend (Envireport)
Proyek ini adalah backend MVP untuk sistem pelaporan lingkungan tingkat perumahan (RT/RW).
Berikut adalah panduan struktur arsitektur yang sudah diterapkan di proyek ini agar Anda memahami basis kodenya:

- **Teknologi yang Dipakai:** Node.js, Express.js, MySQL (menggunakan query SQL mentah / *Raw Query*, tanpa ORM).
- **Library Utama:** `express` (framework), `mysql2` (koneksi database promise), `multer` (upload file gambar lokal), `cors`, `dotenv`.
- **Struktur Folder & Penamaan:**
  - `src/config/db.js` -> Konfigurasi pool database.
  - `src/routes/*.routes.js` -> Definisi endpoint API.
  - `src/controllers/*.controller.js` -> Ekstraksi parameter request, validasi input, dan memanggil service.
  - `src/services/*.service.js` -> Eksekusi logika bisnis inti dan semua query SQL `INSERT`/`SELECT`/`UPDATE`.
  - `src/utils/response.js` -> Helper pembungkus response JSON agar seragam (`sendSuccess` & `sendError`).
  - `src/middlewares/error.middleware.js` -> Global interceptor untuk error server.

---

## 🚀 Objektif Tugas Ini
Saat ini, proyek belum memiliki dokumentasi API interaktif. Tugas Anda adalah **menambahkan Swagger UI** ke dalam proyek ini. 
Dengan adanya Swagger, user lain atau developer *frontend* dapat dengan mudah membuka halaman dokumentasi di browser, melihat parameter API yang dibutuhkan, dan langsung mencoba API tersebut.

---

## 🛠️ Panduan Implementasi (Step-by-Step)
*Panduan ini dirancang sangat detail agar programmer junior-mid atau model AI dapat mengeksekusinya lapis demi lapis dengan aman.*

### 📋 Langkah 1: Instalasi Library
Install library `swagger-ui-express` yang digunakan untuk me-render UI dokumentasi.
Buka terminal di root proyek dan jalankan:
```bash
npm install swagger-ui-express
```
*(Catatan Arsitektur: Kita akan menggunakan file `swagger.json` statis alih-alih anotasi kode komentar, agar struktur file controller/route tetap bersih dan rapi).*

### 📋 Langkah 2: Buat Dokumen Definisi Swagger (`docs/swagger.json`)
Buat folder baru bernama `docs` di root proyek, dan buat file `swagger.json` di dalamnya.

**Path:** `docs/swagger.json`

Silakan buat definisi JSON OpenAPI versi 3.0.0. Anda harus menjabarkan spesifikasi keempat endpoint yang sudah ada di proyek, yaitu:
1. `GET /reports` (Mendapatkan list laporan)
2. `POST /reports` (Membuat laporan baru menggunakan `multipart/form-data`)
3. `GET /reports/{id}` (Mendapatkan detail laporan)
4. `PATCH /reports/{id}/status` (Mengubah status laporan)

*(Tugas Anda: Lengkapi struktur spesifikasi JSON OpenAPI tersebut secara valid berdasarkan data yang diminta oleh `report.controller.js` pada endpoint-endpoint di atas).*

### 📋 Langkah 3: Integrasikan Swagger ke dalam Express Server (`src/app.js`)
Setelah file JSON siap, Anda perlu mendaftarkannya di aplikasi Express.

Buka file `src/app.js`, dan lakukan perubahan berikut:
1. Import library di bagian atas file:
   ```javascript
   const swaggerUi = require('swagger-ui-express');
   const swaggerDocument = require('../docs/swagger.json');
   ```
2. Daftarkan middleware Swagger. Letakkan baris kode ini tepat **sebelum** registrasi routes API utama:
   ```javascript
   // Setup Swagger UI Documentation
   app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
   ```

### 📋 Langkah 4: Pengujian & Verifikasi
Setelah kode ditambahkan, verifikasi pekerjaan Anda dengan langkah berikut:
1. Jalankan server secara lokal: `npm run dev` (pastikan tidak ada error syntax).
2. Buka browser dan arahkan ke alamat: `http://localhost:5000/api-docs`
3. Anda seharusnya melihat antarmuka Swagger UI berwarna hijau-putih yang memuat daftar endpoint `reports`.
4. Cobalah klik **"Try it out"** pada salah satu endpoint (misal `GET /reports`) untuk memastikan Swagger berhasil melakukan *request* ke server lokal.

---

## ✅ Expected Result (Hasil yang Diharapkan)
- Server berjalan normal tanpa error saat di-start.
- Endpoint `http://localhost:5000/api-docs` sukses menampilkan antarmuka dokumentasi API interaktif.
- File `swagger.json` komprehensif dan secara akurat mendeskripsikan *body request* (khususnya form-data pada POST) dan respons yang diharapkan.
- Anda tidak memodifikasi atau merusak query SQL atau logika bisnis yang ada di `services` dan `controllers`.
