const mysql = require('mysql2/promise');
const fs = require('fs').promises;
const path = require('path');
require('dotenv').config();

let pool;

async function initDB() {
  const host = process.env.DB_HOST || '127.0.0.1';
  const port = parseInt(process.env.DB_PORT) || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'envireport';

  console.log(`⏳ Connecting to MySQL server at ${host}:${port}...`);
  
  // 1. Buat koneksi sementara tanpa nama database untuk memastikan DB ada
  const tempConn = await mysql.createConnection({
    host,
    port,
    user,
    password
  });
  
  // 2. Buat database jika belum ada
  await tempConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
  await tempConn.end();

  // 3. Gunakan koneksi sementara dengan multipleStatements: true untuk inisialisasi schema dan seed
  const setupConn = await mysql.createConnection({
    host,
    port,
    user,
    password,
    database,
    multipleStatements: true
  });

  // Eksekusi schema.sql
  try {
    const schemaPath = path.join(__dirname, '../../sql/schema.sql');
    const schemaSql = await fs.readFile(schemaPath, 'utf8');
    await setupConn.query(schemaSql);
    console.log(`✅ Schema initialized successfully.`);
  } catch (error) {
    console.error(`⚠️ Schema initialization error:`, error.message);
  }

  // Eksekusi seed.sql
  try {
    const seedPath = path.join(__dirname, '../../sql/seed.sql');
    const seedSql = await fs.readFile(seedPath, 'utf8');
    await setupConn.query(seedSql);
    console.log(`✅ Seed data initialized successfully.`);
  } catch (error) {
    console.error(`⚠️ Seed data initialization error:`, error.message);
  }

  await setupConn.end();

  // 4. Inisialisasi pool utama tanpa multipleStatements demi keamanan dari SQL Injection
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

  console.log(`🚀 Connection pool successfully connected to database: '${database}'`);
}

const query = async (sql, params) => {
  if (!pool) throw new Error("Database pool is not initialized! (pool is null)");
  const [results] = await pool.execute(sql, params);
  return results;
};

module.exports = {
  initDB,
  query,
  getPool: () => pool
};
