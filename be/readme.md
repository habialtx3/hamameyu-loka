# 🌿 Envireport Backend (MVP)

Envireport adalah backend RESTful API yang dirancang untuk pelaporan masalah lingkungan (sampah, lampu jalan, jalan rusak, drainase, dll.) di tingkat perumahan (RT/RW). Aplikasi ini menggantikan pelaporan manual berbasis chat WhatsApp dengan sistem monitoring yang transparan, ringan, dan mandiri.

Aplikasi ini dibangun menggunakan **Node.js + Express + MySQL** dengan **Raw SQL Queries** (tanpa ORM) demi kecepatan eksekusi tinggi dan kemudahan pemeliharaan (*vibecoding-friendly*).

---

## ✨ Fitur Utama

- **Self-Initializing Database**: Server akan otomatis mendeteksi database MySQL saat dinyalakan, membuat database jika belum ada, lalu mengeksekusi `schema.sql` dan `seed.sql` tanpa intervensi manual.
- **Relational Integrity (One-to-One Location)**: Setiap laporan memiliki relasi satu-ke-satu (*one-to-one*) dengan entitas lokasi detail (RT/RW, desa/kelurahan, kecamatan, koordinat GPS).
- **One-to-Many Report Images**: Satu laporan dapat melampirkan banyak foto pendukung.
- **Strict File Upload Constraints**:
  - Maksimal upload diatur ketat: **hanya 1-2 gambar** per laporan.
  - Ukuran gambar dibatasi maksimal **2MB per file**.
  - Hanya menerima berkas bertipe gambar (*mimetype image/*).
- **Transactional Safety & Cascading Delete**:
  - Penambahan laporan baru dibungkus dalam **MySQL Transactions** (menjamin konsistensi insert lokasi, laporan, dan banyak gambar sekaligus).
  - Penghapusan laporan otomatis menghapus berkas gambar terkait serta membersihkan lokasi (*orphan location cleaning*) agar database tetap bersih.
- **Parameterized Security**: 100% menggunakan query berparameter (*parameterized queries*) untuk mencegah celah keamanan **SQL Injection**.

---

## 🗄️ Database Design

### 1. `users`
Tabel untuk menyimpan data warga atau pengurus RT/RW.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY`, `AUTO_INCREMENT` | ID User |
| `name` | `VARCHAR(255)` | `NOT NULL` | Nama Lengkap |
| `role` | `ENUM('resident', 'admin')` | `DEFAULT 'resident'` | Peran User |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Waktu Pendaftaran |

### 2. `locations`
Tabel untuk menyimpan data lokasi pelaporan secara granular.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY`, `AUTO_INCREMENT` | ID Lokasi |
| `province` | `VARCHAR(100)` | `NOT NULL` | Provinsi |
| `city` | `VARCHAR(100)` | `NOT NULL` | Kabupaten / Kota |
| `district` | `VARCHAR(100)` | `NOT NULL` | Kecamatan |
| `village` | `VARCHAR(100)` | `NOT NULL` | Kelurahan / Desa |
| `rt` | `VARCHAR(10)` | `NOT NULL` | Rukun Tetangga (RT) |
| `rw` | `VARCHAR(10)` | `NOT NULL` | Rukun Warga (RW) |
| `latitude` | `DECIMAL(10, 8)` | `NOT NULL` | Garis Lintang Koordinat |
| `longitude` | `DECIMAL(11, 8)` | `NOT NULL` | Garis Bujur Koordinat |

### 3. `reports`
Tabel utama untuk data laporan masalah lingkungan.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY`, `AUTO_INCREMENT` | ID Laporan |
| `user_id` | `INT` | `FOREIGN KEY` (references `users.id`) | Pembuat Laporan |
| `title` | `VARCHAR(255)` | `NOT NULL` | Judul Laporan |
| `description` | `TEXT` | `NOT NULL` | Deskripsi Laporan |
| `category` | `ENUM` | `sampah`, `lampu jalan`, `jalan rusak`, `drainase` | Kategori Laporan |
| `status` | `ENUM` | `pending`, `processing`, `done` | Status Penanganan |
| `priority` | `ENUM` | `low`, `medium`, `high` | Skala Prioritas |
| `location_id` | `INT` | `FOREIGN KEY` (references `locations.id`) | Relasi Lokasi |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Waktu Pembuatan |

### 4. `report_images`
Tabel pendukung untuk menyimpan lampiran berkas foto laporan.
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `INT` | `PRIMARY KEY`, `AUTO_INCREMENT` | ID Foto |
| `report_id` | `INT` | `FOREIGN KEY` (references `reports.id` on delete cascade) | Relasi Laporan |
| `image_url` | `VARCHAR(255)` | `NOT NULL` | Path File Gambar |
| `created_at` | `TIMESTAMP` | `DEFAULT CURRENT_TIMESTAMP` | Waktu Upload |

---

## 🚀 Panduan Memulai (Setup & Run)

### 1. Prasyarat
- **Node.js** (Versi 18 ke atas disarankan)
- **MySQL Server** (Aktif di port 3306)

### 2. Kloning & Pemasangan
Masuk ke direktori backend `be/` lalu pasang semua dependensi:
```bash
git checkout feature/restart-envireport-backend
npm install
```

### 3. Konfigurasi Environment (`.env`)
Buat berkas `.env` di dalam folder `be/` dengan kredensial MySQL Anda:
```env
PORT=5000
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=password
DB_NAME=envireport
NODE_ENV=development
```

### 4. Jalankan Aplikasi
Jalankan server dalam mode pengembangan:
```bash
npm run dev
```
*Catatan: Server akan otomatis mendeteksi MySQL, membuat database `envireport`, menginisialisasi tabel, dan menyuntikkan user default (ID 1: "Warga Budi" sebagai Resident, ID 2: "Pak RT Ahmad" sebagai Admin).*

---

## 🔌 API Endpoints Documentation

Semua respons API mengembalikan format JSON yang konsisten:
```json
{
  "success": true,
  "message": "Pesan informasi",
  "data": {}
}
```

### 1. Health Check
Mengecek status kesehatan server backend.
- **Method**: `GET`
- **URL**: `/api/health`
- **Request Headers**: *None*
- **Response Contoh (200 OK)**:
```json
{
  "success": true,
  "status": "healthy",
  "timestamp": "2026-05-18T06:50:30.000Z"
}
```

---

### 2. Create Report (Buat Laporan Baru)
Membuat laporan baru lengkap dengan data lokasi granular dan maksimal 2 lampiran foto.
- **Method**: `POST`
- **URL**: `/api/reports`
- **Request Headers**:
  - `Content-Type: multipart/form-data`
  - `x-user-id: 1` (Mock User ID - opsional, default ke `1` / Warga Budi)
- **Body Parameters (form-data)**:
  - `title`: `Sampah Menumpuk di Gang`
  - `description`: `Tumpukan sampah basah di depan pos satpam belum diangkut 3 hari.`
  - `category`: `sampah` (harus salah satu: `sampah`, `lampu jalan`, `jalan rusak`, `drainase`)
  - `priority`: `high` (opsional: `low`, `medium`, `high`, default: `medium`)
  - `province`: `Jawa Barat`
  - `city`: `Bandung`
  - `district`: `Coblong`
  - `village`: `Dago` (opsional)
  - `rt`: `03`
  - `rw`: `05`
  - `latitude`: `-6.8915`
  - `longitude`: `107.6186`
  - `images`: *[Upload File Gambar]* (maksimal 2 file, masing-masing maks 2MB)
- **Sample Curl**:
```bash
curl -X POST http://localhost:5000/api/reports \
  -H "x-user-id: 1" \
  -F "title=Sampah Menumpuk di Gang" \
  -F "description=Tumpukan sampah basah belum diangkut" \
  -F "category=sampah" \
  -F "priority=high" \
  -F "province=Jawa Barat" \
  -F "city=Bandung" \
  -F "district=Coblong" \
  -F "rt=03" \
  -F "rw=05" \
  -F "images=@/path/to/foto1.png" \
  -F "images=@/path/to/foto2.png"
```
- **Response Contoh (201 Created)**:
```json
{
  "success": true,
  "message": "Report created successfully.",
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "Sampah Menumpuk di Gang",
    "description": "Tumpukan sampah basah di depan pos satpam belum diangkut 3 hari.",
    "category": "sampah",
    "status": "pending",
    "priority": "high",
    "created_at": "2026-05-18T06:50:30.000Z",
    "location": {
      "id": 1,
      "province": "Jawa Barat",
      "city": "Bandung",
      "district": "Coblong",
      "village": "Dago",
      "rt": "03",
      "rw": "05",
      "latitude": "-6.89150000",
      "longitude": "107.61860000"
    },
    "images": [
      "/uploads/reports/1779087028998-124180498.png",
      "/uploads/reports/1779087028998-352891997.png"
    ]
  }
}
```

---

### 3. Get All Reports (Ambil Semua Laporan)
Mengambil daftar seluruh laporan yang masuk beserta data lokasi dan lampiran gambarnya.
- **Method**: `GET`
- **URL**: `/api/reports`
- **Sample Curl**:
```bash
curl -X GET http://localhost:5000/api/reports
```
- **Response Contoh (200 OK)**:
```json
{
  "success": true,
  "message": "Reports retrieved successfully.",
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "title": "Sampah Menumpuk di Gang",
      "description": "Tumpukan sampah basah di depan pos satpam belum diangkut 3 hari.",
      "category": "sampah",
      "status": "pending",
      "priority": "high",
      "created_at": "2026-05-18T06:50:30.000Z",
      "location": {
        "id": 1,
        "province": "Jawa Barat",
        "city": "Bandung",
        "district": "Coblong",
        "village": "Dago",
        "rt": "03",
        "rw": "05",
        "latitude": "-6.89150000",
        "longitude": "107.61860000"
      },
      "images": [
        "/uploads/reports/1779087028998-124180498.png",
        "/uploads/reports/1779087028998-352891997.png"
      ]
    }
  ]
}
```

---

### 4. Get Report Detail by ID (Ambil Detail Laporan)
Mengambil detail satu laporan secara spesifik berdasarkan ID.
- **Method**: `GET`
- **URL**: `/api/reports/:id`
- **Sample Curl**:
```bash
curl -X GET http://localhost:5000/api/reports/1
```
- **Response Contoh (200 OK)**:
```json
{
  "success": true,
  "message": "Report detail retrieved successfully.",
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "Sampah Menumpuk di Gang",
    "description": "Tumpukan sampah basah di depan pos satpam belum diangkut 3 hari.",
    "category": "sampah",
    "status": "pending",
    "priority": "high",
    "created_at": "2026-05-18T06:50:30.000Z",
    "location": {
      "id": 1,
      "province": "Jawa Barat",
      "city": "Bandung",
      "district": "Coblong",
      "village": "Dago",
      "rt": "03",
      "rw": "05",
      "latitude": "-6.89150000",
      "longitude": "107.61860000"
    },
    "images": [
      "/uploads/reports/1779087028998-124180498.png",
      "/uploads/reports/1779087028998-352891997.png"
    ]
  }
}
```

---

### 5. Update Report Status (Perbarui Status Laporan)
Memperbarui status penanganan laporan (biasanya dilakukan oleh Pengurus RT/RW / Admin).
- **Method**: `PATCH`
- **URL**: `/api/reports/:id/status`
- **Request Headers**:
  - `Content-Type: application/json`
- **Body Parameters (JSON)**:
  - `status`: `processing` (harus salah satu: `pending`, `processing`, `done`)
- **Sample Curl**:
```bash
curl -X PATCH http://localhost:5000/api/reports/1/status \
  -H "Content-Type: application/json" \
  -d '{"status": "processing"}'
```
- **Response Contoh (200 OK)**:
```json
{
  "success": true,
  "message": "Report status updated to processing successfully.",
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "Sampah Menumpuk di Gang",
    "description": "Tumpukan sampah basah di depan pos satpam belum diangkut 3 hari.",
    "category": "sampah",
    "status": "processing",
    "priority": "high",
    "created_at": "2026-05-18T06:50:30.000Z",
    "location": {
      "id": 1,
      "province": "Jawa Barat",
      "city": "Bandung",
      "district": "Coblong",
      "village": "Dago",
      "rt": "03",
      "rw": "05",
      "latitude": "-6.89150000",
      "longitude": "107.61860000"
    },
    "images": [
      "/uploads/reports/1779087028998-124180498.png",
      "/uploads/reports/1779087028998-352891997.png"
    ]
  }
}
```

---

### 6. Delete Report (Hapus Laporan)
Menghapus laporan secara permanen beserta data lokasi dan gambar yang melekat dengannya.
- **Method**: `DELETE`
- **URL**: `/api/reports/:id`
- **Sample Curl**:
```bash
curl -X DELETE http://localhost:5000/api/reports/1
```
- **Response Contoh (200 OK)**:
```json
{
  "success": true,
  "message": "Report with ID 1 deleted successfully.",
  "data": {
    "id": 1
  }
}
```

---

## 🚨 Error Handling Responses

### Batasan Ukuran File Terlampaui (400 Bad Request)
Dikembalikan jika ukuran file gambar melebihi **2MB**.
```json
{
  "success": false,
  "message": "File too large. Maximum size is 2MB per image."
}
```

### Jumlah File Melebihi Batas (400 Bad Request)
Dikembalikan jika berkas gambar yang diunggah lebih dari **2**.
```json
{
  "success": false,
  "message": "Too many files uploaded. Maximum is 2 images."
}
```

### Laporan Tidak Ditemukan (404 Not Found)
Dikembalikan jika mengakses, memperbarui, atau menghapus ID laporan yang tidak terdaftar di database.
```json
{
  "success": false,
  "message": "Report with ID 999 not found."
}
```
