const { getPool } = require('../config/db'); // Menggunakan pool MySQL2 kamu

class UserService {
  /**
   * Mengambil semua user beserta nama rolenya untuk tabel FE Admin
   */
  async getAllUsers() {
    const pool = getPool();
    const query = `
      SELECT u.id, u.username, u.email, u.name, r.name as role_name 
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      ORDER BY u.username ASC
    `;
    
    // MySQL2 mengembalikan [rows, fields], kita ambil rows-nya saja
    const [rows] = await pool.execute(query);
    return rows;
  }

  /**
   * Mengubah role user (misal dari 'resident' ke 'admin' atau sebaliknya)
   */
  async updateUserRole(userId, targetRoleName) {
    const pool = getPool();
    
    // 1. Cari ID dari role tujuan (pastikan inputnya 'admin' atau 'resident')
    const [roles] = await pool.execute("SELECT id FROM roles WHERE name = ?", [targetRoleName.toLowerCase()]);
    if (roles.length === 0) {
      throw new Error(`Role '${targetRoleName}' tidak terdaftar di database.`);
    }
    const roleId = roles[0].id;

    // 2. Update tabel pivot user_roles
    const updateQuery = `
      UPDATE user_roles 
      SET role_id = ? 
      WHERE user_id = ?
    `;
    const [result] = await pool.execute(updateQuery, [roleId, userId]);
    
    if (result.affectedRows === 0) return null; // Jika user_id tidak ditemukan

    return { userId, newRole: targetRoleName.toLowerCase() };
  }
}

module.exports = new UserService();