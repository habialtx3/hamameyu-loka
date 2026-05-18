# Issue: Fix Database Connection, Port Configuration, and Auto-Create DB

## 🎯 Konteks Masalah
Saat dilakukan testing API menggunakan Postman, server tidak dapat memproses request dengan baik (terjadi error atau crash). Berdasarkan pengecekan, terdapat beberapa masalah utama:
1. **Port MySQL Salah:** Konfigurasi `.env` dan `db.js` menggunakan port `3036`, padahal MySQL di lokal berjalan di port default `3306`.
2. **Kredensial Password Kosong:** Lupa mengisi `DB_PASSWORD` di `.env` yang menyebabkan koneksi ditolak oleh MySQL.
3. **Database Tidak Terbuat Otomatis (Auto-Create Failed):** Aplikasi langsung mencoba melakukan koneksi `pool` ke database `envireport`. Jika database tersebut belum ada di MySQL server lokal, aplikasi akan langsung *crash* / *error*.

---

## 🚀 Objektif Tugas Ini
Memperbaiki mekanisme koneksi database pada backend agar aplikasi menjadi tahan banting (*robust*) dan ramah digunakan (bisa langsung berjalan tanpa perlu *create database* manual di MySQL).

Tugas ini dirancang sangat detail agar programmer junior-mid atau model AI dapat dengan mudah mengikuti dan mengeksekusinya.

---

## 🛠️ Panduan Implementasi (Step-by-Step)
*Penting: Tolong ikuti langkah ini secara berurutan tanpa merusak logika yang sudah ada.*

### 📋 Langkah 1: Perbarui Konfigurasi Environment (`.env`)
Buka file `.env` dan lakukan penyesuaian nilai:
1. Ubah `DB_PORT` menjadi `3306`.
2. Tambahkan password MySQL lokal Anda ke `DB_PASSWORD` (misalnya: `root`, atau biarkan kosong HANYA JIKA MySQL Anda memang tidak di-password).
**Contoh `.env`:**
```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=masukkan_password_mysql_disini
DB_NAME=envireport
DB_PORT=3306
```

### 📋 Langkah 2: Refactor Koneksi Database (`src/config/db.js`)
Kita perlu mengubah `db.js` agar bisa menjalankan query `CREATE DATABASE IF NOT EXISTS` sebelum membuat `pool`. Karena hal ini bersifat asynchronous, kita akan membungkusnya dalam fungsi `initDB()`.

Buka `src/config/db.js` dan ganti seluruh isinya dengan pola berikut:
```javascript
const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

async function initDB() {
  const host = process.env.DB_HOST || 'localhost';
  const port = parseInt(process.env.DB_PORT) || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'envireport';

  // 1. Buat koneksi awal TANPA menyebutkan database
  const connection = await mysql.createConnection({ host, port, user, password });
  
  // 2. Buat database otomatis jika belum ada
  await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
  await connection.end(); // Tutup koneksi awal

  // 3. Setelah DB dipastikan ada, buat Pool utama
  pool = mysql.createPool({
    host,
    port,
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  console.log(`✅ Database '${database}' initialized and pool connected.`);
}

// Helper untuk eksekusi query raw
const query = async (sql, params) => {
  if (!pool) throw new Error("Database belum diinisialisasi! (pool is null)");
  const [results] = await pool.execute(sql, params);
  return results;
};

// Export helper query, referensi pool, dan fungsi inisialisasi
module.exports = {
  initDB,
  query,
  getPool: () => pool
};
```

### 📋 Langkah 3: Modifikasi Service Layer (`src/services/report.service.js`)
Karena kita mengubah `db.js`, cara mengambil koneksi dari `pool` di Service Layer harus disesuaikan.
Buka `src/services/report.service.js` dan perbarui cara pemanggilan `pool`.
1. Ubah impor di baris 1 menjadi:
   ```javascript
   const { getPool, query } = require('../config/db');
   ```
2. Cari bagian `const conn = await pool.getConnection();` (berada di dalam fungsi `createReport`), dan ubah menjadi:
   ```javascript
   const pool = getPool();
   const conn = await pool.getConnection();
   ```

### 📋 Langkah 4: Modifikasi File Entry Point (`src/server.js`)
Kita harus menjalankan fungsi `initDB()` terlebih dahulu sebelum aplikasi Express mulai menerima *request* (`app.listen`).
Buka `src/server.js` dan perbarui isinya menjadi seperti ini:
```javascript
const app = require('./app');
const { initDB } = require('./config/db');
require('dotenv').config();

const PORT = process.env.PORT || 5000;

// Jalankan inisialisasi Database terlebih dahulu
initDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`============================================`);
      console.log(`🚀 Envireport Backend Server running on port ${PORT}`);
      console.log(`👉 Health check: http://localhost:${PORT}/health`);
      console.log(`👉 Swagger Docs: http://localhost:${PORT}/api-docs`);
      console.log(`============================================`);
    });
  })
  .catch((err) => {
    console.error("❌ Gagal menginisialisasi Database:", err);
    process.exit(1); // Matikan server jika DB gagal connect
  });
```

---

## ✅ Expected Result (Hasil yang Diharapkan)
1. Saat menjalankan `npm run dev`, server harus berhasil terhubung ke MySQL di port `3306`.
2. Jika database `envireport` belum ada di phpMyAdmin / MySQL, server akan **otomatis membuatnya** tanpa pesan error.
3. API bisa berjalan dengan normal di Postman tanpa ada error koneksi (terutama saat mencoba endpoint `GET /reports` dan `POST /reports`).
4. Pastikan user selalu diingatkan untuk mengisi `DB_PASSWORD` sesuai dengan settingan komputer masing-masing.
