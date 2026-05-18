# Issue: Refactor Location Fields & Adjust DB Port to 3036 (Express + MySQL Raw Query)

## 🎯 Background & Current State
We have already successfully built the **Envireport Backend MVP** using Node.js, Express, and MySQL (Raw Queries). 
Currently, the codebase contains:
- Standardized API response wrappers (`src/utils/response.js`) and a global error handling middleware.
- A raw MySQL database pool connection wrapper (`src/config/db.js`).
- Complete MVP endpoint routes, controllers, and services for **Reports** (`POST /reports`, `GET /reports`, `GET /reports/:id`, `PATCH /reports/:id/status`).
- Basic location details stored inside the `locations` table.

---

## 🚀 Scope of New Changes
We need to perform two major updates:
1. **DB Port Adjustment:** Change the default local MySQL port from `3306` to **`3036`** across configurations.
2. **Granular Location Details:** Refactor the database schema and backend code to collect detailed resident location details, specifically: **Province (Provinsi)**, **City (Kota)**, **District (Kecamatan)**, **Village (Kelurahan)**, **RT**, **RW**, **Latitude**, and **Longitude**.

---

## 🛠️ Step-by-Step Implementation Guide
*Please follow these steps sequentially. Ensure all SQL queries are raw and parameterized!*

### 📋 Step 1: Update Port DB Config (`.env` & `src/config/db.js`)
The local database runs on port `3036` instead of the standard `3306`.
1. Open [.env](file:///d:/prj/InfiniteLearning/Web/Hamameyu/be/.env) and add/update `DB_PORT=3036`.
2. Open [db.js](file:///d:/prj/InfiniteLearning/Web/Hamameyu/be/src/config/db.js) and make sure `mysql.createPool` consumes the `process.env.DB_PORT` variable:
   ```javascript
   const pool = mysql.createPool({
     host: process.env.DB_HOST || 'localhost',
     port: parseInt(process.env.DB_PORT) || 3036, // Adjust to default 3036
     user: process.env.DB_USER || 'root',
     password: process.env.DB_PASSWORD || '',
     database: process.env.DB_NAME || 'envireport',
     // ... other pool settings
   });
   ```

### 📋 Step 2: Refactor Database DDL (`sql/schema.sql` & `sql/seed.sql`)
1. Open [schema.sql](file:///d:/prj/InfiniteLearning/Web/Hamameyu/be/sql/schema.sql) and modify the `locations` table columns to support:
   - `province` VARCHAR(100) NOT NULL
   - `city` VARCHAR(100) NOT NULL
   - `district` VARCHAR(100) NOT NULL
   - `village` VARCHAR(100) NOT NULL
   - `rt` VARCHAR(10) NOT NULL
   - `rw` VARCHAR(10) NOT NULL
   - `latitude` DECIMAL(10, 8) NOT NULL
   - `longitude` DECIMAL(11, 8) NOT NULL
2. Adjust [seed.sql](file:///d:/prj/InfiniteLearning/Web/Hamameyu/be/sql/seed.sql) to populate mock data that adheres to these new database constraints if applicable.

### 📋 Step 3: Refactor Raw Queries in Service (`src/services/report.service.js`)
We need to update our service query functions to write and read the new columns:
1. Update `createReport` function:
   - The raw `INSERT INTO locations` query must now accept: `province`, `city`, `district`, `village`, `rt`, `rw`, `latitude`, `longitude`.
   - Update parameter binding array sequentially.
2. Update `getAllReports` and `getReportById` functions:
   - Update the raw `SELECT` query so that the joined query grabs `rt` and `rw` columns from `locations`.
   - Update the mapping format returned by the functions to nest these new columns inside the `location` object (e.g. `rt: r.rt, rw: r.rw`).

### 📋 Step 4: Refactor Controller Validation (`src/controllers/report.controller.js`)
We must validate and grab these fields from the request body:
1. Destructure the new properties from `req.body` in `createReport`:
   ```javascript
   const { 
     title, description, category, priority, 
     province, city, district, village, rt, rw, latitude, longitude 
   } = req.body;
   ```
2. Update validation to verify all of these are present and reject with a 400 Bad Request error if any are missing:
   `!title || !description || !category || !province || !city || !district || !village || !rt || !rw || !latitude || !longitude`
3. Map these newly validated properties to the `location` object passed to `reportService.createReport()`:
   ```javascript
   location: {
     province,
     city,
     district,
     village,
     rt,
     rw,
     latitude: parseFloat(latitude),
     longitude: parseFloat(longitude)
   }
   ```

---

## 🧪 Expected JSON Payloads & Formats

### 📥 POST `/reports` (Multipart form-data)
**Request Fields:**
- `title`: "Sampah menumpuk di gang"
- `description`: "Tumpukan sampah basah belum diangkut 3 hari"
- `category`: "sampah"
- `priority`: "medium"
- `province`: "Jawa Barat"
- `city`: "Bandung"
- `district`: "Coblong"
- `village`: "Dago"
- `rt`: "03"
- `rw`: "05"
- `latitude`: -6.8915
- `longitude`: 107.6186
- `images`: *[Upload files]*

### 📤 GET `/reports/:id` (Detail Response Example)
Expected consistent JSON response:
```json
{
  "success": true,
  "message": "Report detail retrieved successfully.",
  "data": {
    "id": 1,
    "user_id": 1,
    "title": "Sampah menumpuk di gang",
    "description": "Tumpukan sampah basah belum diangkut 3 hari",
    "category": "sampah",
    "status": "pending",
    "priority": "medium",
    "created_at": "2026-05-18T04:15:00.000Z",
    "location": {
      "id": 1,
      "province": "Jawa Barat",
      "city": "Bandung",
      "district": "Coblong",
      "village": "Dago",
      "rt": "03",
      "rw": "05",
      "latitude": -6.8915,
      "longitude": 107.6186
    },
    "images": [
      "/uploads/reports/1715980000000-123456789.jpg"
    ]
  }
}
```

---

## 🔍 Verification Steps
1. Make sure your local MySQL is active and listening on port **`3036`**.
2. Run `npm run dev` to start the server.
3. Import the updated `sql/schema.sql` into the local MySQL `envireport` database.
4. Execute a `POST` request to `http://localhost:5000/reports` containing all granular location fields and confirm a `201 Created` status code is returned.
5. Execute a `GET` request to `http://localhost:5000/reports` and check that the nested `location` object contains the `rt` and `rw` properties.
