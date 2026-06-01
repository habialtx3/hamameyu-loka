const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const reportController = require('../controllers/report.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

// ... Konfigurasi storage, fileFilter, dan upload Multer Anda tetap biarkan seperti semula ...

// 🔴 PERBAIKAN RUTE POST COBA DI-SPLIT ATAU DIBUAT AMAN
router.post('/reports', authenticateToken, (req, res, next) => {
  // Cek apakah request yang datang berupa JSON murni
  if (req.is('json') || req.headers['content-type']?.includes('application/json')) {
    // Jika JSON, langsung bypass / loloskan tanpa lewat Multer!
    return reportController.createReport(req, res, next);
  }

  // Jika bukan JSON (berarti FormData / multipart), jalankan Multer seperti biasa
  upload.array('images', 2)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({ success: false, message: 'Too many files uploaded. Maximum is 2 images.' });
      }
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ success: false, message: 'File too large. Maximum size is 2MB per image.' });
      }
      return res.status(400).json({ success: false, message: err.message });
    } else if (err) {
      return res.status(400).json({ success: false, message: err.message });
    }
    
    reportController.createReport(req, res, next);
  });
});

// 🔴 PASTIKAN RUTE LAINNYA TIDAK TERTUTUP ATAU TERGANGGU
router.get('/reports', reportController.getAllReports); // Pastikan rute GET ALL Anda terdaftar di sini!
router.get('/reports/history', reportController.getReportsHistory);
router.patch('/reports/:id/status', reportController.updateReportStatus);
router.delete('/reports/:id', reportController.deleteReport);

module.exports = router;