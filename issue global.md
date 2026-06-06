# Issue: Implementasi Upload Gambar & View Detail Laporan (Frontend)

## 📌 Deskripsi Fitur
Tugas ini berfokus pada integrasi Frontend (FE) untuk mengirimkan file gambar (maksimal 2 gambar) saat pembuatan laporan baru (`POST /api/reports`) menggunakan format `multipart/form-data`. Selain itu, pastikan halaman Detail Laporan (`ReportDetailPage`) dapat menampilkan gambar-gambar tersebut secara dinamis.

Panduan ini disusun secara langkah-demi-langkah agar mudah diikuti oleh programmer junior-mid maupun model AI yang lebih murah (seperti Gemini Flash / GPT-4o-mini).

---

## 🛠️ Panduan Langkah demi Langkah (Step-by-Step)

### Langkah 1: Perbarui Service API Frontend (`fe/src/services/api.js`)
Service API saat ini (`createReport`) dikonfigurasi untuk mengirim JSON murni dengan header `"Content-Type": "application/json"`. Kita perlu mengubahnya agar mendukung pengiriman `FormData` (untuk upload file biner/gambar).

#### 📝 File yang Diedit: [api.js](file:///d:/prj/InfiniteLearning/Web/Hamameyu/fe/src/services/api.js)

Ubah method `createReport` agar:
1. Menerima parameter `formData` yang bertipe instance `FormData`.
2. **Menghapus** header `"Content-Type": "application/json"`. *(Penting: Browser secara otomatis akan menetapkan header `Content-Type` ke `multipart/form-data` beserta `boundary` yang unik jika kita mengosongkannya).*
3. Tetap pertahankan opsi `credentials: "include"` agar cookie JWT token dari user tetap terkirim untuk autentikasi.

**Contoh Kode Perubahan:**
```javascript
// Sebelum:
createReport: async (reportData) => { ... }

// Sesudah:
createReport: async (formData) => {
  try {
    const response = await fetch(`${BASE_URL}/reports`, {
      method: "POST",
      credentials: "include", // Cookie JWT token tetap dikirim
      body: formData, // Mengirim objek FormData, bukan string JSON
    });
    
    return await response.json();
  } catch (error) {
    console.error("Gagal membuat laporan di service:", error);
    return { success: false, message: "Terjadi kesalahan jaringan." };
  }
},
```

---

### Langkah 2: Refactor Fungsi Submit di Halaman Pengajuan Laporan (`fe/src/pages/user/report_submission/index.jsx`)
Saat ini, fungsi `onSubmit` mengabaikan input file `images` dari form dan hanya mengirim objek JSON kosong (`images: []`). Kita harus menggantinya menggunakan objek `FormData`.

#### 📝 File yang Diedit: [index.jsx (report_submission)](file:///d:/prj/InfiniteLearning/Web/Hamameyu/fe/src/pages/user/report_submission/index.jsx)

Perbarui fungsi `onSubmit` di dalam komponen `ReportSubmissionPage` sebagai berikut:
1. Pastikan validasi kategori terpilih berjalan.
2. Inisialisasi objek `FormData` baru: `const formData = new FormData();`
3. Tambahkan field teks dasar ke dalam `formData`:
   - `title`
   - `description`
   - `category`
   - `priority`
4. Tambahkan field koordinat lokasi. Backend mendukung dua metode parsing lokasi:
   - Menggunakan key individual: `location[latitude]` dan `location[longitude]`
   - ATAU mengirim objek stringified JSON: `location` berisi `JSON.stringify({ latitude, longitude })`
   *(Gunakan format key individual `location[latitude]` dan `location[longitude]` untuk sinkronisasi optimal).*
5. Ambil file gambar dari state form (`data.images`, yang merupakan tipe data `FileList`).
6. Lakukan validasi jumlah file:
   - Ambil maksimal 2 gambar saja (gunakan `Array.from(data.images).slice(0, 2)`).
   - Lakukan perulangan (loop) untuk menambahkan tiap file gambar ke `formData` dengan nama field yang sama, yaitu `'images'`.
7. Panggil service `reportService.createReport(formData)` untuk mengirim request ke backend.

**Contoh Kode Perubahan:**
```javascript
const onSubmit = async (data) => {
  // 1. Validasi dasar agar user memilih kategori
  if (!data.category) {
    alert("Silakan pilih kategori laporan terlebih dahulu.");
    return;
  }

  // 2. Buat objek FormData
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("description", data.description);
  formData.append("category", data.category);
  formData.append("priority", data.priority);

  // Append koordinat lokasi
  formData.append("location[latitude]", parseFloat(mapCoords.lat.toFixed(6)));
  formData.append("location[longitude]", parseFloat(mapCoords.lng.toFixed(6)));

  // 3. Append gambar (maksimal 2)
  if (data.images && data.images.length > 0) {
    const filesToUpload = Array.from(data.images).slice(0, 2);
    filesToUpload.forEach((file) => {
      formData.append("images", file); // Field name wajib 'images' sesuai backend
    });
  }

  try {
    // 4. Kirim request ke backend menggunakan service
    const result = await reportService.createReport(formData);

    if (result.success) {
      alert("Laporan Anda berhasil dikirim ke sistem aduan warga.");
      navigate(backPath);
    } else {
      alert(result.message || "Gagal mengirimkan laporan.");
    }
  } catch (error) {
    console.error("Error saat submit FormData:", error);
    alert("Terjadi kesalahan koneksi server.");
  }
};
```

---

### Langkah 3: Verifikasi Tampilan Gambar di Halaman Detail Laporan (`fe/src/pages/user/report_detail/index.jsx`)
Halaman ini sudah dirancang untuk merender gambar secara dinamis dengan mengiterasi array URL gambar (`report.images`).

#### 📝 File yang Diverifikasi: [index.jsx (report_detail)](file:///d:/prj/InfiniteLearning/Web/Hamameyu/fe/src/pages/user/report_detail/index.jsx)

Pastikan bagian render foto bukti di dalam file ini menggunakan endpoint backend yang benar:
* Path gambar statis yang dikembalikan oleh API backend adalah `/uploads/reports/nama_file.jpg`.
* Frontend harus menggabungkan host backend (`http://localhost:5000`) dengan path gambar tersebut.
* Pastikan kode berikut ada dan berfungsi:
  ```javascript
  {report.images && report.images.length > 0 ? (
    report.images.map((imgUrl, idx) => (
      <img
        key={idx}
        src={`http://localhost:5000${imgUrl}`}
        alt={`Bukti Keluhan ${idx + 1}`}
        className="w-full aspect-square object-cover rounded-3xl border border-gray-200"
      />
    ))
  ) : (
    <div className="col-span-2 py-8 bg-[#f0f2f5] text-center text-gray-400 rounded-3xl text-sm">
      Tidak ada lampiran foto untuk laporan ini.
    </div>
  )}
  ```

---

## 🧪 Panduan Verifikasi & Pengujian (Testing)

Lakukan pengujian manual berikut di browser untuk memverifikasi kebenaran implementasi:

1. **Buka Aplikasi Frontend:**
   Jalankan server pengembangan frontend (`npm run dev` di folder `/fe`) dan arahkan browser ke halaman pembuatan laporan (`http://localhost:5173/report/submit` atau rute setara).

2. **Isi Form & Pilih Gambar:**
   - Tulis judul, deskripsi, pilih kategori, dan prioritas.
   - Klik map untuk menentukan koordinat lokasi.
   - Klik area upload gambar lalu pilih **1 atau 2 file gambar** (format JPG/PNG, maksimal 2MB per file).

3. **Buka Developer Tools (F12) -> Tab Network:**
   - Tekan tombol **"Kirim Laporan Resmi Warga"**.
   - Cari request `POST /api/reports` di tab Network.
   - Verifikasi **Request Headers**:
     - Pastikan `Content-Type` berisi nilai `multipart/form-data; boundary=----WebKitFormBoundary...` (bukan `application/json`).
   - Verifikasi **Request Payload / Form Data**:
     - Pastikan field `title`, `description`, `category`, `priority`, `location[latitude]`, `location[longitude]`, dan `images` (sebagai file biner) terkirim secara lengkap.

4. **Verifikasi Database & Folder Penyimpanan:**
   - Periksa database MySQL di tabel `report_images` untuk memastikan baris baru dengan path `/uploads/reports/...` berhasil disimpan.
   - Periksa folder backend `be/uploads/reports/` untuk memastikan file gambar fisik telah tersimpan di server.

5. **Verifikasi Halaman Detail Laporan:**
   - Setelah sukses terkirim, buka halaman detail laporan tersebut (`http://localhost:5173/reports/:id`).
   - Pastikan gambar bukti ter-render dengan sempurna tanpa ada broken image (eror 404).
