# 🌐 Envireport - Fullstack Setup Guide

Selamat datang di proyek **Envireport**! Repositori ini dibagi menjadi dua bagian utama:

- **Fe:** Frontend menggunakan *React.js*
- **Be:** Backend menggunakan *Express.js & MySQL*

## 🛠️ Persiapan Awal (Prerequisites)

Sebelum memulai, pastikan perangkat kamu sudah terinstal aplikasi berikut:

- **Node.js** (Versi 18 atau terbaru)
- **MySQL Server** (Bisa via XAMPP, Laragon, atau Docker)
- **Git**

## 💾 1. Backend Setup (`/Be`)

Buka terminal baru, lalu masuk ke folder backend:

Bash

```
cd Be
```

### 🔹 Langkah A: Buat Database MySQL

1. Buka database manager pilihanmu (phpMyAdmin / DBeaver / Navicat).
2. Buat database baru dengan nama: `envireport`
3. Eksekusi query SQL berikut untuk membuat tabel:

SQL

```
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('resident', 'admin', 'staff') DEFAULT 'resident',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
    province VARCHAR(100),
    city VARCHAR(100),
    district VARCHAR(100),
    village VARCHAR(100),
    rt VARCHAR(5),
    rw VARCHAR(5),
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    images TEXT,
    status ENUM('pending', 'in_progress', 'done') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### 🔹 Langkah B: Setup Environment Variables

Buat file baru bernama `.env` di dalam folder `/Be`, lalu sesuaikan konfigurasinya:

Cuplikan kode

```
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=isi_password_mysql_kamu
DB_NAME=envireport
DB_PORT=3306
JWT_SECRET=MasukanKataKunciRahasiaBebasDisini123!
```

### 🔹 Langkah C: Install & Jalankan Backend

Jalankan perintah berikut secara berurutan di dalam terminal folder `/Be`:

Bash

```
npm install
npm run dev
```

> 🚀 **Info:** Backend akan berjalan di URL: `http://localhost:5000`
> 

## 💻 2. Frontend Setup (`/Fe`)

Buka **terminal baru** (pisahkan dengan terminal backend), lalu masuk ke folder frontend:

Bash

```
cd Fe
```

### 🔹 Langkah A: Install & Jalankan Frontend

Jalankan perintah berikut di dalam terminal folder `/Fe`:

Bash

```
npm install
npm run dev
```

> 🚀 **Info:** Frontend akan berjalan di URL lokal yang tertera pada terminal kamu (biasanya `http://localhost:5173` atau `http://localhost:3000`).
> 

## ⚠️ Catatan Penting Pengujian & Integrasi

- **Autentikasi Berbasis Cookie:** Proyek ini menggunakan *HttpOnly Cookies* untuk menyimpan token login. Saat menggunakan Postman atau integrasi browser, token **tidak perlu** dimasukkan di header secara manual karena akan terkirim otomatis.
- **Masalah CORS:** Jika frontend gagal melakukan *fetching* data ke backend, pastikan backend sudah mengizinkan origin URL dari frontend kamu pada konfigurasi CORS di Express.
