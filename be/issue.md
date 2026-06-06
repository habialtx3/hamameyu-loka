# Issue: Implementasi Fitur Upload Gambar (Maksimal 2 Gambar)

## Deskripsi Fitur
Tambahkan fitur upload gambar saat membuat laporan baru (`POST /api/reports`). 
Fitur ini harus mendukung pengunggahan file gambar secara langsung menggunakan `multipart/form-data` dengan batas maksimal **2 gambar** per laporan.
Skema penyimpanan database harus merujuk pada tabel `report_images` di file [schema.sql](file:///d:/prj/InfiniteLearning/Web/Hamameyu/be/sql/schema.sql).

---

## 🛠️ Panduan Langkah Demi Langkah (Step-by-Step Guide)

Tugas ini dirancang agar dapat diimplementasikan dengan mudah oleh programmer Junior/Mid atau model AI. Ikuti langkah-langkah di bawah ini secara berurutan:

### 1. Buat & Pindah ke Branch Baru
Buat branch Git baru khusus untuk fitur ini:
```bash
git checkout -b feature/upload-images
```

### 2. Verifikasi Database
Pastikan tabel `report_images` telah terbuat di database Anda sesuai dengan [schema.sql](file:///d:/prj/InfiniteLearning/Web/Hamameyu/be/sql/schema.sql):
```sql
CREATE TABLE IF NOT EXISTS report_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  report_id INT NOT NULL,
  image_url VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (report_id) REFERENCES reports(id) ON DELETE CASCADE
);
```

### 3. Konfigurasi Upload Router ([report.routes.js](file:///d:/prj/InfiniteLearning/Web/Hamameyu/be/src/routes/report.routes.js))
*   Router saat ini sudah menggunakan library `multer` dan mendefinisikan middleware upload:
    ```javascript
    const upload = multer({
      storage: storage,
      limits: { fileSize: 2 * 1024 * 1024 } // Batas ukuran per file 2MB
    });
    ```
*   Route `POST /api/reports` saat ini sudah memiliki middleware `upload.array('images', 2)`.
*   **Tugas Anda:** 
    1. Pastikan validasi multer mengizinkan maksimal **2 gambar**.
    2. Jika pengguna mengunggah lebih dari 2 gambar, kembalikan response error `400 Bad Request`.
    *(Petunjuk: Multer `upload.array('images', 2)` secara otomatis akan melempar error `LIMIT_UNEXPECTED_FILE` jika file yang dikirim lebih dari 2. Tangkap error ini di callback/error handler multer).*

### 4. Implementasi di Controller ([report.controller.js](file:///d:/prj/InfiniteLearning/Web/Hamameyu/be/src/controllers/report.controller.js))
Perbarui method `createReport` untuk menangani file gambar yang diunggah:
1.  **Deteksi File Unggahan (`req.files`):**
    *   Jika request dikirim menggunakan `multipart/form-data`, file yang diunggah akan berada di `req.files`.
    *   Map array `req.files` untuk mengambil nama file (`file.filename`) dan ubah menjadi URL path statis, contoh: `/uploads/reports/${file.filename}`.
2.  **Fallback ke JSON (`req.body.images`):**
    *   Jika tidak ada `req.files`, periksa apakah ada `req.body.images` (array of string URL).
    *   Jika keduanya kosong, default-kan ke array kosong `[]`.
3.  **Validasi Maksimal 2 Gambar:**
    *   Validasi kembali jumlah gambar di level controller. Jika total gambar (baik dari `req.files` atau `req.body.images`) lebih dari 2, kembalikan response `400 Bad Request` dengan pesan: `"Maksimal 2 gambar yang diperbolehkan."`.
4.  **Kirim Data ke Service:**
    *   Masukkan array URL gambar tersebut ke parameter `images` saat memanggil `reportService.createReport(reportData)`.

### 5. Verifikasi Service ([report.service.js](file:///d:/prj/InfiniteLearning/Web/Hamameyu/be/src/services/report.service.js))
*   Pastikan method `createReport` di `reportService` melakukan hal-hal berikut secara transaksional:
    1.  Menyimpan data lokasi ke tabel `locations`.
    2.  Menyimpan data laporan ke tabel `reports` (beserta `location_id` yang didapat).
    3.  Melakukan iterasi pada array `images` dan menyimpannya ke tabel `report_images` dengan SQL query:
        ```sql
        INSERT INTO report_images (report_id, image_url) VALUES (?, ?)
        ```
*   *(Catatan: Logika penyimpanan database di Service ini umumnya sudah ada/disediakan, Anda hanya perlu memastikan parameter `images` terkirim dengan format array of string URL yang benar).*

---

## 🧪 Panduan Pengujian (Testing)

Lakukan pengujian manual untuk memastikan fitur berjalan dengan benar:

1.  **Pengujian Menggunakan Postman / Insomnia:**
    *   **Method:** `POST`
    *   **URL:** `http://localhost:5000/api/reports`
    *   **Headers:** (Pastikan Cookie token JWT aktif atau kirim header dummy `x-user-id: 1` jika autentikasi di-bypass untuk testing).
    *   **Body Type:** `form-data`
    *   **Fields:**
        *   `title` (Text): `Laporan Jalan Rusak`
        *   `description` (Text): `Ada lubang besar di tengah jalan.`
        *   `category` (Text): `ROAD_AND_SIDEWALK`
        *   `location[latitude]` (Text): `-6.200000`
        *   `location[longitude]` (Text): `106.810000`
        *   `images` (File): *Pilih file gambar pertama (contoh: jalan1.jpg)*
        *   `images` (File): *Pilih file gambar kedua (contoh: jalan2.jpg)*

2.  **Skenario Pengujian:**
    *   **Skenario 1: Upload 1 Gambar** -> Status `201 Created`, data tersimpan di tabel `reports` dan 1 baris di tabel `report_images`.
    *   **Skenario 2: Upload 2 Gambar** -> Status `201 Created`, data tersimpan di tabel `reports` dan 2 baris di tabel `report_images`.
    *   **Skenario 3: Upload 3 Gambar** -> Status `400 Bad Request` dengan pesan error yang sesuai (karena melebihi batas maksimal 2).
    *   **Skenario 4: Ambil Detail Laporan (`GET /api/reports/:id`)** -> Pastikan field `images` di response JSON berisi array URL gambar yang telah diupload (contoh: `["/uploads/reports/filename-1.jpg", "/uploads/reports/filename-2.jpg"]`).

---
**Penting:** Lakukan verifikasi database secara langsung (misal menggunakan MySQL client) untuk memastikan relasi `report_id` dan `image_url` terisi dengan benar setelah request berhasil!

