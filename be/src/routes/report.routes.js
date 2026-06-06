const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const reportController = require('../controllers/report.controller');
const { authenticateToken } = require('../middlewares/auth.middleware');

const uploadDir = path.join(__dirname, '../../uploads/reports');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => { cb(null, uploadDir); },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 }
});

// ==========================================
// 1. RUTE STATIS (Harus Paling Atas!)
// ==========================================

// GET ALL: /api/reports
router.get('/reports', reportController.getAllReports);

// GET HISTORY: /api/reports/history
router.get('/reports/history', reportController.getReportsHistory);

// POST CREATE: /api/reports
router.post('/reports', authenticateToken, (req, res, next) => {
  if (req.is('json') || req.headers['content-type']?.includes('application/json')) {
    return reportController.createReport(req, res, next);
  }
  upload.array('images', 2)(req, res, (err) => {
    if (err) {
      let message = err.message;
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        message = 'Maksimal 2 gambar yang diperbolehkan.';
      } else if (err.code === 'LIMIT_FILE_SIZE') {
        message = 'Ukuran file maksimal adalah 2MB per gambar.';
      }
      return res.status(400).json({ success: false, message });
    }
    reportController.createReport(req, res, next);
  });
});

// ==========================================
// 2. RUTE DINAMIS PARAMETER (Wajib di Bawah!)
// ==========================================

// 🔴 GET DETAIL BY ID: /api/reports/:id
// Pastikan tidak ada typo pada nama fungsi 'getReportById'
router.get('/reports/:id', reportController.getReportById);

// PATCH STATUS: /api/reports/:id/status
router.patch('/reports/:id/status', reportController.updateReportStatus);

// DELETE: /api/reports/:id
router.delete('/reports/:id', reportController.deleteReport);

module.exports = router;