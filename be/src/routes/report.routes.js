const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const reportController = require('../controllers/report.controller');

// Pastikan folder uploads/reports ada
const uploadDir = path.join(__dirname, '../../uploads/reports');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Konfigurasi Penyimpanan Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// File Filter hanya menerima Gambar
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Batasan upload: 2MB per file, maksimal 2 file
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { 
    fileSize: 2 * 1024 * 1024 // 2MB Limit
  }
});

// Definisi Endpoint

/**
 * @swagger
 * /api/reports:
 *   post:
 *     summary: Membuat laporan masalah lingkungan baru
 *     description: Endpoint ini membuat laporan baru beserta detail lokasi dan file gambar menggunakan multipart/form-data.
 *     tags: [Reports]
 *     parameters:
 *       - in: header
 *         name: x-user-id
 *         schema:
 *           type: integer
 *           default: 1
 *         description: ID Warga (jika kosong, default ke 1)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
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
 *               latitude:
 *                 type: number
 *                 format: float
 *                 example: -6.89148
 *               longitude:
 *                 type: number
 *                 format: float
 *                 example: 107.61633
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Maksimal 2 file gambar (maks 2MB per file)
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
 *                   example: "Report created successfully."
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 *       400:
 *         description: Request body tidak valid
 *       500:
 *         description: Internal server error
 */
router.post('/reports', (req, res, next) => {
  // Parsing array gambar dengan nama field 'images' maksimal 2 file
  upload.array('images', 2)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      // Kesalahan internal dari Multer (misal limit jumlah file atau size terlampaui)
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
          success: false,
          message: 'Too many files uploaded. Maximum is 2 images.'
        });
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          message: 'File too large. Maximum size is 2MB per image.'
        });
      }
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      // Kesalahan kustom atau tipe file tidak sesuai
      return res.status(400).json({ success: false, message: err.message });
    }
    
    // Lanjutkan ke controller jika tidak ada error upload
    reportController.createReport(req, res, next);
  });
});

/**
 * @swagger
 * /api/reports:
 *   get:
 *     summary: Mendapatkan semua daftar laporan
 *     description: Mengambil seluruh list laporan dari database beserta data lokasi dan gambarnya.
 *     tags: [Reports]
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
 *                   example: "Reports retrieved successfully."
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Report'
 *       500:
 *         description: Internal server error
 */
router.get('/reports', reportController.getAllReports);

/**
 * @swagger
 * /api/reports/history:
 *   get:
 *     summary: Mengambil daftar report historis sebagai kandidat pembanding
 *     description: Mengambil list report historis berdasarkan kategori dan start_time batas bawah.
 *     tags: [Reports]
 *     parameters:
 *       - in: query
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *         description: Kategori laporan
 *       - in: query
 *         name: start_time
 *         required: true
 *         schema:
 *           type: string
 *           format: date-time
 *         description: Batas waktu pencarian awal (ISO 8601)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 *         description: Maksimal jumlah laporan yang dikembalikan
 *     responses:
 *       200:
 *         description: Daftar riwayat laporan berhasil diambil
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
 *                   example: "Daftar riwayat laporan berhasil diambil"
 *                 data:
 *                   type: object
 *                   properties:
 *                     report_count:
 *                       type: integer
 *                       example: 2
 *                     reports:
 *                       type: object
 *                       additionalProperties:
 *                         type: object
 *                         properties:
 *                           time_report:
 *                             type: string
 *                             format: date-time
 *                             example: "2026-05-18T14:00:00+07:00"
 *                           location:
 *                             type: object
 *                             properties:
 *                               latitude:
 *                                 type: number
 *                                 example: -6.2088
 *                               longitude:
 *                                 type: number
 *                                 example: 106.8456
 *                           time_close:
 *                             type: string
 *                             format: date-time
 *                             nullable: true
 *                             example: "2026-05-19T14:00:00+07:00"
 *       400:
 *         description: Kategori atau start_time kosong / tidak valid
 *       500:
 *         description: Internal server error
 */
router.get('/reports/history', reportController.getReportsHistory);

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
 *                   example: "Report detail retrieved successfully."
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 *       404:
 *         description: Laporan tidak ditemukan
 *       500:
 *         description: Internal server error
 */
router.get('/reports/:id', reportController.getReportById);

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
 *                   example: "Report status updated to processing successfully."
 *                 data:
 *                   $ref: '#/components/schemas/Report'
 *       400:
 *         description: Status tidak valid atau parameter salah
 *       404:
 *         description: Laporan tidak ditemukan
 *       500:
 *         description: Internal server error
 */
router.patch('/reports/:id/status', reportController.updateReportStatus);

/**
 * @swagger
 * /api/reports/{id}:
 *   delete:
 *     summary: Menghapus laporan (dan file gambar terkait) berdasarkan ID
 *     description: Menghapus laporan spesifik secara permanen beserta data lokasi dan file gambarnya dari disk.
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
 *         description: Laporan berhasil dihapus
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type:   string
 *                   example: "Report with ID 1 deleted successfully."
 *                 data:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *       404:
 *         description: Laporan tidak ditemukan
 *       500:
 *         description: Internal server error
 */
router.delete('/reports/:id', reportController.deleteReport);

module.exports = router;
