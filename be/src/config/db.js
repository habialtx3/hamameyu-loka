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
