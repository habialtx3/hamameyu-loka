# Envireport Backend Prompt (Express + MySQL + Raw Query)

Saya sedang membangun backend untuk sebuah web application bernama **Envireport**, yaitu sistem pelaporan masalah lingkungan di tingkat perumahan (RT/RW). Backend akan dibuat menggunakan **Node.js + Express + MySQL dengan raw SQL query (tanpa ORM)**.

## 🎯 Tujuan Sistem

Sistem ini digunakan untuk:

* Warga melaporkan masalah lingkungan (sampah, lampu jalan, jalan rusak, drainase, dll)
* Pengurus RT/RW memonitor dan mengelola status laporan
* Menyediakan transparansi progres laporan dari dibuat hingga selesai

---

# 🧩 Fitur Utama

## 1. Report Management

* User dapat membuat laporan masalah lingkungan
* Laporan berisi:

  * judul
  * deskripsi
  * kategori masalah
  * status laporan (pending, processing, done)
  * prioritas (low, medium, high)
  * lokasi (relasi ke entity location)
  * foto (bisa lebih dari 1)

---

## 2. Location Entity (Wajib dipisah)

Lokasi laporan harus disimpan dalam tabel terpisah.

Data lokasi:

* provinsi
* kabupaten/kota
* kecamatan
* desa/kelurahan (opsional)
* latitude
* longitude

Setiap report memiliki 1 location (one-to-one relationship).

---

## 3. Report Images

* Satu report dapat memiliki banyak gambar
* Gambar disimpan di tabel terpisah (one-to-many)

---

## 4. Status Tracking

* Status laporan dapat diubah oleh admin RT/RW:

  * pending → processing → done
* Setiap perubahan status dicatat (opsional: report updates log)

---

# 🗄️ Database Design (Konsep)

## users

* id
* name
* role (resident / admin)
* created_at

## reports

* id
* user_id (FK)
* title
* description
* category
* status
* priority
* location_id (FK)
* created_at

## locations

* id
* province
* city
* district
* village
* latitude
* longitude

## report_images

* id
* report_id (FK)
* image_url
* created_at

## report_updates (optional but recommended)

* id
* report_id (FK)
* message
* status_change
* created_at

---

# 🔌 API Endpoints

## Auth (optional)

* POST /register
* POST /login

## Reports

* POST /reports → create report (include location + images)
* GET /reports → list reports
* GET /reports/:id → detail report
* PATCH /reports/:id/status → update status (admin)

## Images

* handled in report creation or separate upload endpoint

---

# ⚙️ Technical Requirements

## Stack

* Node.js
* Express.js
* MySQL
* mysql2 (promise-based)
* dotenv
* cors

---

## Database Access Rules

* Use raw SQL queries only
* Use parameterized query to prevent SQL injection:

```sql
SELECT * FROM users WHERE id = ?
```

❌ Do not use string concatenation for queries.

---

## Project Structure

```
src/
  config/
    db.js
  controllers/
  routes/
  middlewares/
  utils/
  app.js

sql/
  schema.sql

.env
```

---

# 🧠 Business Logic Rules

* Report wajib memiliki location_id
* Report dapat memiliki banyak images
* Status report hanya boleh:

  * pending
  * processing
  * done
* Category report bersifat fixed:

  * sampah
  * lampu jalan
  * jalan rusak
  * drainase

---

# 📦 Response Format API

Semua response harus konsisten:

```json
{
  "success": true,
  "message": "string",
  "data": {}
}
```

---

# 🚀 Non-Functional Requirements

* Backend harus ringan dan sederhana (vibecoding-friendly)
* Struktur kode harus mudah dipahami
* Fokus pada MVP, bukan enterprise-level complexity
* Siap untuk dikembangkan ke fitur AI classification di masa depan

---

# 🔥 Context Produk

Envireport adalah sistem pelaporan lingkungan berbasis komunitas yang bertujuan meningkatkan transparansi dan monitoring masalah lingkungan di tingkat perumahan (RT/RW), menggantikan sistem manual berbasis chat WhatsApp.

---

# 🧩 Output yang diharapkan dari AI

Berdasarkan prompt ini, bantu:

1. Membuatkan SQL schema lengkap
2. Menyusun struktur Express backend
3. Menyusun contoh endpoint implementation dengan raw query
4. Memberikan saran best practice ringan untuk implementasi MVP

---

# 🗂️ Recommended Project Folder Structure (Express + MySQL Raw Query)

Struktur ini dibuat agar **rapi, scalable, dan tetap simple untuk vibecoding**.

```
envireport-backend/
│
├── src/
│   ├── config/
│   │   ├── db.js              # koneksi MySQL (mysql2/promise)
│   │   └── env.js             # optional: load env helper
│   │
│   ├── controllers/           # logic utama tiap feature
│   │   ├── auth.controller.js
│   │   ├── report.controller.js
│   │   └── location.controller.js
│   │
│   ├── routes/                # definisi endpoint
│   │   ├── auth.routes.js
│   │   ├── report.routes.js
│   │   └── location.routes.js
│   │
│   ├── services/              # raw query logic (IMPORTANT)
│   │   ├── auth.service.js
│   │   ├── report.service.js
│   │   └── location.service.js
│   │
│   ├── middlewares/
│   │   ├── auth.middleware.js
│   │   └── error.middleware.js
│   │
│   ├── utils/
│   │   ├── response.js        # format response konsisten
│   │   └── validator.js       # validation helper (optional)
│   │
│   ├── app.js                 # express app setup
│   └── server.js              # entry point (listen port)
│
├── sql/
│   ├── schema.sql             # semua table SQL
│   └── seed.sql               # dummy data (optional)
│
├── uploads/
│   └── reports/               # image storage (dev/local)
│
├── .env
├── .gitignore
├── package.json
└── README.md
```

---

# 🧠 Penjelasan Arsitektur (Simple)

## Flow Request:

```
Route → Controller → Service → DB (raw query)
```

## Kenapa pakai service layer?

* Biar controller tidak berantakan
* Query SQL tidak tersebar
* Lebih gampang maintenance

---

# 🔥 Catatan Penting

* **Controller = hanya handle request/response**
* **Service = semua query SQL (core logic)**
* **Routes = mapping endpoint**
* Jangan taruh SQL langsung di controller

---

# 🚀 Optional Upgrade (kalau mau lebih clean)

Kalau project kamu berkembang, bisa tambah:

* `repositories/` (lapisan query lebih strict)
* `dto/` (data shaping)
* `constants/` (enum category & status)

---

# 📝 Additional Notes for Antigravity Prompt

## Current Scope

For the current MVP phase:

* Do NOT implement authentication yet
* Skip:

  * JWT
  * login/register
  * bcrypt
  * auth middleware
* Focus only on:

  * report management
  * locations
  * report images
  * status tracking

Use simple placeholder user logic if needed.

Example:

* hardcoded resident/admin role
* dummy user_id

Authentication will be implemented later.

---

# 🔥 Simplified API Scope (Current MVP)

## Reports

* POST /api/reports
* GET /api/reports
* GET /api/reports/:id
* PATCH /api/reports/:id/status

No auth endpoints needed for now.

---

# 🧩 Simplified Users Table

## users

* id
* name
* role
* created_at

No email/password yet.
