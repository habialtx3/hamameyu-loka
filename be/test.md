# Dokumentasi Pengujian Fitur Upload Gambar (Maksimal 2 Gambar)

Dokumentasi ini merinci skenario pengujian, detail request, endpoint, serta respon untuk fitur pembuatan laporan baru (`POST /api/reports`) dengan unggahan gambar yang diimplementasikan di [report.routes.js](file:///d:/prj/InfiniteLearning/Web/Hamameyu/be/src/routes/report.routes.js) dan [report.controller.js](file:///d:/prj/InfiniteLearning/Web/Hamameyu/be/src/controllers/report.controller.js).

---

## 📋 Ringkasan Skenario Pengujian

| No | Skenario Pengujian | Input Gambar | Ekspektasi Hasil | HTTP Status |
|---|---|---|---|---|
| 1 | Pembuatan laporan dengan **1 gambar** | 1 file fisik | Sukses dibuat & gambar tersimpan | `201 Created` |
| 2 | Pembuatan laporan dengan **2 gambar** | 2 file fisik | Sukses dibuat & kedua gambar tersimpan | `201 Created` |
| 3 | Pembuatan laporan dengan **3 gambar** | 3 file fisik | Gagal (validasi maksimal 2 gambar) | `400 Bad Request` |
| 4 | Verifikasi detail laporan yang telah dibuat | ID laporan | Gambar muncul di array `images` | `200 OK` |

---

## 🛠️ Detail Endpoint & Skenario Pengujian

### Skenario 1: Upload 1 Gambar (Sukses)

Skenario ini memastikan pengguna dapat membuat laporan baru dengan mengunggah tepat 1 gambar.

*   **Method:** `POST`
*   **URL:** `http://localhost:5000/api/reports`
*   **Headers:**
    ```http
    Content-Type: multipart/form-data
    Cookie: token=<JWT_TOKEN_ANDA>
    ```
*   **Body (Form-Data):**
    *   `title` (text): `Laporan Sampah Menumpuk`
    *   `description` (text): `Banyak tumpukan sampah plastik di selokan depan RT 02.`
    *   `category` (text): `WASTE`
    *   `location[latitude]` (text): `-6.175392`
    *   `location[longitude]` (text): `106.827153`
    *   `images` (file): `sampah1.jpg`

*   **Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "Report created successfully.",
      "data": {
        "id": 21,
        "user_id": 17,
        "title": "Laporan Sampah Menumpuk",
        "description": "Banyak tumpukan sampah plastik di selokan depan RT 02.",
        "category": "WASTE",
        "status": "pending",
        "priority": "medium",
        "time_report": "2026-06-06T10:15:30.000Z",
        "time_close": null,
        "location": {
          "id": 21,
          "latitude": "-6.17539200",
          "longitude": "106.82715300"
        },
        "images": [
          "/uploads/reports/1780765657210-71926279.png"
        ]
      }
    }
    ```

---

### Skenario 2: Upload 2 Gambar (Sukses)

Skenario ini memastikan pengguna dapat mengunggah maksimal 2 gambar sekaligus dalam satu laporan.

*   **Method:** `POST`
*   **URL:** `http://localhost:5000/api/reports`
*   **Headers:**
    ```http
    Content-Type: multipart/form-data
    Cookie: token=<JWT_TOKEN_ANDA>
    ```
*   **Body (Form-Data):**
    *   `title` (text): `Lampu Jalan Padam`
    *   `description` (text): `Lampu jalan utama dekat pos ronda mati sejak 3 hari lalu.`
    *   `category` (text): `PUBLIC_FACILITIES`
    *   `location[latitude]` (text): `-6.210432`
    *   `location[longitude]` (text): `106.845920`
    *   `images` (file): `lampu_padam1.jpg`
    *   `images` (file): `lampu_padam2.jpg`

*   **Response (201 Created):**
    ```json
    {
      "success": true,
      "message": "Report created successfully.",
      "data": {
        "id": 22,
        "user_id": 17,
        "title": "Lampu Jalan Padam",
        "description": "Lampu jalan utama dekat pos ronda mati sejak 3 hari lalu.",
        "category": "PUBLIC_FACILITIES",
        "status": "pending",
        "priority": "medium",
        "time_report": "2026-06-06T10:17:15.000Z",
        "time_close": null,
        "location": {
          "id": 22,
          "latitude": "-6.21043200",
          "longitude": "106.84592000"
        },
        "images": [
          "/uploads/reports/1780765657282-810288815.png",
          "/uploads/reports/1780765657283-795738588.png"
        ]
      }
    }
    ```

---

### Skenario 3: Upload 3 Gambar (Gagal - Validasi)

Skenario ini memverifikasi bahwa sistem menolak pembuatan laporan jika gambar yang diunggah lebih dari 2.

*   **Method:** `POST`
*   **URL:** `http://localhost:5000/api/reports`
*   **Headers:**
    ```http
    Content-Type: multipart/form-data
    Cookie: token=<JWT_TOKEN_ANDA>
    ```
*   **Body (Form-Data):**
    *   `title` (text): `Pohon Tumbang`
    *   `description` (text): `Pohon menutupi sebagian badan jalan.`
    *   `category` (text): `TREES_AND_GREEN_SPACE`
    *   `location[latitude]` (text): `-6.198231`
    *   `location[longitude]` (text): `106.820111`
    *   `images` (file): `pohon1.jpg`
    *   `images` (file): `pohon2.jpg`
    *   `images` (file): `pohon3.jpg`

*   **Response (400 Bad Request):**
    ```json
    {
      "success": false,
      "message": "Maksimal 2 gambar yang diperbolehkan."
    }
    ```

---

### Skenario 4: Verifikasi Detail Laporan (Sukses)

Memastikan endpoint pencarian data laporan tunggal mengembalikan detail laporan lengkap beserta daftar URL gambar yang tersimpan.

*   **Method:** `GET`
*   **URL:** `http://localhost:5000/api/reports/22`
*   **Headers:**
    ```http
    Cookie: token=<JWT_TOKEN_ANDA>
    ```

*   **Response (200 OK):**
    ```json
    {
      "success": true,
      "message": "Report detail retrieved successfully.",
      "data": {
        "id": 22,
        "user_id": 17,
        "title": "Lampu Jalan Padam",
        "description": "Lampu jalan utama dekat pos ronda mati sejak 3 hari lalu.",
        "category": "PUBLIC_FACILITIES",
        "status": "pending",
        "priority": "medium",
        "time_report": "2026-06-06T10:17:15.000Z",
        "time_close": null,
        "location": {
          "id": 22,
          "latitude": "-6.21043200",
          "longitude": "106.84592000"
        },
        "images": [
          "/uploads/reports/1780765657282-810288815.png",
          "/uploads/reports/1780765657283-795738588.png"
        ]
      }
    }
    ```
