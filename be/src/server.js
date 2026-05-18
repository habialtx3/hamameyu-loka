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
