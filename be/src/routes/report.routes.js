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

router.get('/reports', reportController.getAllReports);
router.get('/reports/:id', reportController.getReportById);
router.patch('/reports/:id/status', reportController.updateReportStatus);

module.exports = router;
