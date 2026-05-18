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

---

# 📚 Documentation Plan

Rencana ini dibuat agar tim developer (junior/mid-level) atau AI coding assistant (seperti GPT-3.5, Gemini Flash, atau Claude Haiku) dapat mengimplementasikan dokumentasi API menggunakan Swagger dengan mudah, terstruktur, dan siap pakai.

## 🛠️ Tech Stack & Requirements
* **`swagger-ui-express`**: Untuk menyediakan UI interaktif Swagger di endpoint `/api-docs`.
* **`swagger-jsdoc`**: Untuk menulis dokumentasi menggunakan JSDoc comments langsung di atas router/controller, sehingga tidak perlu menulis JSON/YAML besar secara terpisah.

---

## 📋 Langkah-Langkah Implementasi Lengkap

### Langkah 1: Instalasi Dependency
Jalankan perintah berikut di root folder project `be/`:
```bash
npm install swagger-ui-express swagger-jsdoc
```

---

### Langkah 2: Setup Konfigurasi Swagger
Buat file helper baru untuk konfigurasi Swagger di `src/config/swagger.js` (opsional namun direkomendasikan agar `app.js` tetap bersih):

#### [NEW] `src/config/swagger.js`
```javascript
const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Envireport API Documentation',
      version: '1.0.0',
      description: 'Dokumentasi API untuk sistem pelaporan masalah lingkungan Envireport (Express + Raw Query)',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Development Server',
      },
    ],
    components: {
      schemas: {
        // Standard Response Format
        ApiResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string', example: 'Operation successful' },
            data: { type: 'object' }
          }
        },
        // Location Schema
        Location: {
          type: 'object',
          required: ['province', 'city', 'district', 'latitude', 'longitude'],
          properties: {
            id: { type: 'integer', example: 1 },
            province: { type: 'string', example: 'Jawa Barat' },
            city: { type: 'string', example: 'Bandung' },
            district: { type: 'string', example: 'Coblong' },
            village: { type: 'string', example: 'Dago' },
            latitude: { type: 'number', format: 'float', example: -6.89148 },
            longitude: { type: 'number', format: 'float', example: 107.61633 }
          }
        },
        // Report Schema
        Report: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            user_id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Jalan Lubang di Dago' },
            description: { type: 'string', example: 'Ada lubang besar membahayakan pengendara motor.' },
            category: { type: 'string', enum: ['sampah', 'lampu jalan', 'jalan rusak', 'drainase'], example: 'jalan rusak' },
            status: { type: 'string', enum: ['pending', 'processing', 'done'], example: 'pending' },
            priority: { type: 'string', enum: ['low', 'medium', 'high'], example: 'medium' },
            location_id: { type: 'integer', example: 1 },
            created_at: { type: 'string', format: 'date-time', example: '2026-05-18T07:11:32Z' },
            location: { $ref: '#/components/schemas/Location' },
            images: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'integer', example: 1 },
                  image_url: { type: 'string', example: '/uploads/reports/file-1715978123.jpg' }
                }
              }
            }
          }
        }
      }
    }
  },
  // Lokasi file yang berisi annotation JSDoc
  apis: ['./src/routes/*.js', './src/controllers/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
```

---

### Langkah 3: Integrasi ke Express App (`src/app.js` atau `src/server.js`)
Edit file `src/app.js` untuk mengimpor konfigurasi dan menyajikan Swagger UI pada route `/api-docs`.

Gunakan potongan kode berikut:
```javascript
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Sajikan Swagger UI di endpoint /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
```

---

### Langkah 4: Menambahkan JSDoc/Swagger Annotation pada Routes
Buka file router (`src/routes/report.routes.js`) dan tambahkan JSDoc di atas definisi masing-masing route.

#### Contoh Implementasi Annotation & Penjelasan Endpoint:

##### 1. POST `/api/reports` (Create Report)
```javascript
/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Membuat laporan masalah lingkungan baru
 *     description: Endpoint ini membuat laporan baru beserta detail lokasi dan gambar.
 *     tags: [Reports]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - priority
 *               - location
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Jalan Rusak & Berlubang"
 *               description:
 *                 type: string
 *                 example: "Lubang sedalam 15cm di jalan utama perumahan RT 03."
 *               category:
 *                 type: string
 *                 enum: [sampah, lampu jalan, jalan rusak, drainase]
 *                 example: "jalan rusak"
 *               priority:
 *                 type: string
 *                 enum: [low, medium, high]
 *                 example: "high"
 *               location:
 *                 type: object
 *                 required: [province, city, district, latitude, longitude]
 *                 properties:
 *                   province:
 *                     type: string
 *                     example: "Jawa Barat"
 *                   city:
 *                     type: string
 *                     example: "Bandung"
 *                   district:
 *                     type: string
 *                     example: "Coblong"
 *                   village:
 *                     type: string
 *                     example: "Dago"
 *                   latitude:
 *                     type: number
 *                     example: -6.89148
 *                   longitude:
 *                     type: number
 *                     example: 107.61633
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   description: URL gambar yang sudah diupload
 *                   example: "/uploads/reports/jalan-rusak.jpg"
 *     responses:
 *       201:
 *         description: Laporan berhasil dibuat
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Laporan berhasil dibuat"
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 *       400:
 *         description: Request body tidak valid
 *       500:
 *         description: Internal server error
 */
```

##### 2. GET `/api/reports` (Get All Reports)
```javascript
/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Mendapatkan semua daftar laporan
 *     description: Mengambil seluruh list laporan dari database beserta data lokasi dan gambarnya.
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, done]
 *         description: Filter laporan berdasarkan status
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [sampah, lampu jalan, jalan rusak, drainase]
 *         description: Filter laporan berdasarkan kategori
 *     responses:
 *       200:
 *         description: Berhasil mengambil data laporan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Daftar laporan berhasil dimuat"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 *       500:
 *         description: Internal server error
 */
```

##### 3. GET `/api/reports/:id` (Get Report Detail)
```javascript
/**
 * @swagger
 * /api/reports/{id}:
 *   get:
 *     summary: Mendapatkan detail laporan berdasarkan ID
 *     description: Mengambil detail satu laporan secara spesifik beserta data lokasi dan daftar gambar terkait.
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Laporan
 *     responses:
 *       200:
 *         description: Detail laporan ditemukan
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Detail laporan ditemukan"
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 *       404:
 *         description: Laporan tidak ditemukan
 *       500:
 *         description: Internal server error
 */
```

##### 4. PATCH `/api/reports/:id/status` (Update Status)
```javascript
/**
 * @swagger
 * /api/reports/{id}/status:
 *   patch:
 *     summary: Memperbarui status laporan (Admin RT/RW)
 *     description: Mengubah status report (pending ke processing, atau processing ke done) oleh pengurus RT/RW.
 *     tags: [Reports]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID Laporan
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, done]
 *                 example: "processing"
 *     responses:
 *       200:
 *         description: Status laporan berhasil diperbarui
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Status laporan berhasil diperbarui menjadi processing"
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 *       400:
 *         description: Status tidak valid atau urutan status salah
 *       404:
 *         description: Laporan tidak ditemukan
 *       500:
 *         description: Internal server error
 */
```

---

## 🎯 Panduan untuk Junior/Mid Programmer & AI Model
Jika Anda (atau AI model) ditugaskan untuk mengimplementasikan rencana ini, ikuti checklist berikut:

1. **Persiapan:** Pastikan database sudah terinstall dan backend server berjalan (`npm run dev` atau `node src/server.js`).
2. **Setup Boilerplate:** Buat file `src/config/swagger.js` sesuai kode di atas.
3. **Kaitkan dengan App:** Daftarkan middleware Swagger UI di file `src/app.js` tepat sebelum route utama Anda di-mount.
4. **Copy-Paste & Sesuaikan:** Salin annotasi JSDoc di atas dan letakkan tepat di atas method handler router Anda pada file `src/routes/report.routes.js` (atau file route/controller terkait).
5. **Verifikasi:**
   - Buka browser dan arahkan ke: `http://localhost:3000/api-docs`
   - Pastikan halaman Swagger UI termuat dengan baik.
   - Coba jalankan endpoint menggunakan tombol **"Try it out"** langsung di UI Swagger untuk memastikan endpoint berjalan dan menghasilkan response JSON yang sama persis dengan dokumentasi.

