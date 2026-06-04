# Api dan Backend Specs

Sistem Backend **Envireport** adalah platform pelaporan masalah lingkungan berbasis API. Dokumentasi ini mencakup arsitektur database, sistem keamanan berbasis Cookie-JWT, dan spesifikasi lengkap setiap endpoint.

## 🗄️ 1. Arsitektur Database (Skema Tabel)

Backend ini menggunakan relational database (MySQL/Postgres) dengan 2 tabel utama yang saling berelasi (*One-to-Many* antara `users` dan `reports`).

### A. Tabel `users`

Menyimpan informasi akun pengguna dan peran (role) mereka untuk hak akses.

| **Nama Kolom** | **Tipe Data** | **Atribut** | **Keterangan** |
| --- | --- | --- | --- |
| `id` | INT / BIGINT | Primary Key, Auto Increment | ID unik pengguna |
| `name` | VARCHAR(255) | NOT NULL | Nama lengkap |
| `username` | VARCHAR(100) | NOT NULL, UNIQUE | Username untuk login |
| `email` | VARCHAR(255) | NOT NULL, UNIQUE | Email aktif |
| `password` | VARCHAR(255) | NOT NULL | Hash password (BCrypt) |
| `role` | ENUM / VARCHAR | NOT NULL (Default: `'resident'`) | Pilihan: `'resident'`, `'admin'`, `'staff'` |
| `created_at` | TIMESTAMP | Default: `CURRENT_TIMESTAMP` | Waktu pendaftaran |

### B. Tabel `reports`

Menyimpan data laporan masalah lingkungan yang dikirim oleh masyarakat.

| **Nama Kolom** | **Tipe Data** | **Atribut** | **Keterangan** |
| --- | --- | --- | --- |
| `id` | INT / BIGINT | Primary Key, Auto Increment | ID unik laporan |
| `user_id` | INT / BIGINT | Foreign Key ➡️ `users.id` | Pengirim laporan (diambil dari JWT) |
| `title` | VARCHAR(255) | NOT NULL | Judul laporan |
| `description` | TEXT | NOT NULL | Detail kronologi masalah |
| `category` | VARCHAR(100) | NOT NULL | Contoh: `TREES_AND_GREEN_SPACE`, `ROAD_AND_SIDEWALK` |
| `priority` | ENUM / VARCHAR | NOT NULL (Default: `'medium'`) | Pilihan: `'low'`, `'medium'`, `'high'` |
| `province` | VARCHAR(100) | NULLABLE | Provinsi lokasi kejadian |
| `city` | VARCHAR(100) | NULLABLE | Kota / Kabupaten |
| `district` | VARCHAR(100) | NULLABLE | Kecamatan |
| `village` | VARCHAR(100) | NULLABLE | Kelurahan / Desa |
| `rt` | VARCHAR(5) | NULLABLE | Rukun Tetangga |
| `rw` | VARCHAR(5) | NULLABLE | Rukun Warga |
| `latitude` | DECIMAL(10, 8) | NOT NULL | Koordinat Lintang |
| `longitude` | DECIMAL(11, 8) | NOT NULL | Koordinat Bujur |
| `images` | TEXT / JSON | NULLABLE | Path/URL foto bukti (Array string) |
| `status` | ENUM / VARCHAR | NOT NULL (Default: `'pending'`) | Pilihan: `'pending'`, `'in_progress'`, `'done'` |
| `created_at` | TIMESTAMP | Default: `CURRENT_TIMESTAMP` | Waktu laporan dibuat |

## 🔐 2. Sistem Keamanan & Autentikasi (Middleware)

Sistem tidak menggunakan header `Authorization: Bearer <token>`, melainkan menggunakan **HttpOnly Cookies**. Token JWT akan disimpan otomatis oleh browser/client di dalam cookie bernama `token` saat login berhasil.

### Alur Kerja Middleware:

1. **`authenticateToken`**: Memvalidasi cookie `token`. Jika valid, data user disimpan ke dalam objek `req.user`.
2. **`authorizeRoles(...allowedRoles)`**: Memeriksa apakah `req.user.role` diizinkan mengakses endpoint terkait.

> ⚠️ **Penting untuk Frontend/Mobile:** Pastikan mengaktifkan opsi `withCredentials: true` pada library HTTP client Anda (seperti Axios atau Fetch) agar cookie otomatis terkirim di setiap request.
> 

## 🚀 3. Spesifikasi API Endpoints

**Base URL:** `http://localhost:5000/api`

### 🔑 Modul: Authentication (`/auth`)

### 1. Register Akun

- **Method:** `POST`
- **Path:** `/auth/register`
- **Akses:** Publik (Tanpa Login)
- **Request Body (JSON):**

JSON

```
{
  "name": "Admin test",
  "username": "admin11",
  "email": "admin@gmail.com",
  "password": "password"
}
```

- **Response Sukses (201 Created):**

JSON

```
{
  "message": "Registrasi berhasil"
}
```

### 2. Login

- **Method:** `POST`
- **Path:** `/auth/login`
- **Akses:** Publik (Tanpa Login)
- **Request Body (JSON):**

JSON

```
{
  "email": "ahma2212@mail.com",
  "password": "passwordRahasia123"
}
```

- **Response Sukses (200 OK):**
    
    *Backend otomatis mengeset Set-Cookie: `token=<JWT_DATA>; HttpOnly; Secure`*
    

JSON

```
{
  "message": "Login berhasil",
  "user": {
    "id": 10,
    "name": "Ahmad",
    "role": "resident"
  }
}
```

### 3. Logout

- **Method:** `POST`
- **Path:** `/auth/logout`
- **Akses:** Wajib Login (Cookie Aktif)
- **Response Sukses (200 OK):**
    
    *Backend otomatis menghapus/membersihkan cookie `token`.*
    

JSON

```
{
  "message": "Logout berhasil"
}
```

### 📋 Modul: Reports (`/reports`)

### 4. Create New Report (Buat Laporan)

- **Method:** `POST`
- **Path:** `/reports`
- **Akses:** Wajib Login (Semua Role)
- **Request Body (JSON):**

JSON

```
{
  "title": "Dahan Pohon Rindang Menutupi Kabel Listrik",
  "description": "Pohon peneduh di depan ruko sudah terlalu rimbun dan dahannya mulai melilit kabel listrik tegangan tinggi.",
  "category": "TREES_AND_GREEN_SPACE",
  "priority": "medium",
  "location": {
    "latitude": -6.198231,
    "longitude": 106.820111
  },
  "images": [
    "/uploads/reports/pohon_kabel.jpg"
  ]
}
```

> *Catatan: `userId` tidak perlu dikirim di body karena backend otomatis mengambil ID dari JWT (`req.user.id`).*
> 

### 5. Get All Reports (Ambil Semua Laporan)

- **Method:** `GET`
- **Path:** `/reports`
- **Akses:** Publik / Wajib Login (Sesuai kebijakan tim)
- **Response Sukses (200 OK):**

JSON

```
[
  {
    "id": 1,
    "title": "Dahan Pohon Rindang...",
    "status": "pending",
    "created_at": "2026-06-04T07:00:00Z"
  }
]
```

### 6. Get Report By ID / Update Detail Wilayah

- **Method:** `GET` / `PUT` *(Disarankan diganti ke PUT/PATCH jika ada pengiriman data)*
- **Path:** `/reports/:id` (Contoh: `/reports/4`)
- **Akses:** Wajib Login
- **Request Body (Multipart Form-Data):**
    
    Digunakan untuk melengkapi data wilayah administratif atau mengunggah file gambar fisik.
    
    - `title`: `Mencoba`
    - `description`: `Waduhh`
    - `category`: `sampah`
    - `priority`: `low`
    - `province`: `kepulauan riau`
    - `city`: `medan`
    - `district`: `binje`
    - `village`: `batu aji`
    - `rt`: `08`
    - `rw`: `08`
    - `latitude`: `3.505050`
    - `longitude`: `3.505050`
    - `images`: `[File Gambar/Foto Fisik (.png/.jpg)]`

### 7. Update Report Status (Ubah Status Laporan)

- **Method:** `PATCH`
- **Path:** `/reports/:id/status` (Contoh: `/reports/1/status`)
- **Akses:** Otorisasi Khusus (`"admin"`, `"staff"`)
- **Request Body (JSON):**

JSON

```
{
  "status" : "done"
}
```

*(Pilihan status: `'pending'`, `'in_progress'`, `'done'`)*

### 8. Get Report History (Riwayat Berfilter)

- **Method:** `GET`
- **Path:** `/reports/history`
- **Akses:** Wajib Login
- **Query Parameters:**
    - `category` : `ROAD_AND_SIDEWALK` (Pilihan filter kategori)
    - `start_time` : `2026-05-18T10:00:00Z` (Filter waktu mulai)

### 9. Delete Report (Hapus Laporan)

- **Method:** `DELETE`
- **Path:** `/reports/:id` (Contoh: `/reports/2`)
- **Akses:** Otorisasi Khusus (`"admin"`)

## 🛠️ 4. Kode Respon Standar (HTTP Status Codes)

Pastikan backend mengembalikan kode status berikut agar frontend dapat menangani error dengan seragam:

- **`200 OK`**: Permintaan berhasil.
- **`201 Created`**: Data/Akun baru berhasil dibuat.
- **`400 Bad Request`**: Format input data salah atau ada parameter wajib yang kurang.
- **`401 Unauthorized`**: Belum login (Cookie tidak ditemukan).
- **`403 Forbidden`**: Token kedaluwarsa atau Role akun tidak memiliki hak akses ke endpoint tersebut.
- **`404 Not Found`**: Data laporan atau rute URL tidak ditemukan.
- **`500 Internal Server Error`**: Terjadi kesalahan pada server/database.