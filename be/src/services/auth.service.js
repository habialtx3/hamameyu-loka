const db = require('../config/db');

const AuthService = {
    findByEmail: async (email) => {
        const query = `
            SELECT u.*, r.name as role_name 
            FROM users u
            JOIN user_roles ur ON u.id = ur.user_id
            JOIN roles r ON ur.role_id = r.id
            WHERE u.email = ?
        `;
        const result = await db.query(query, [email]);
        
        // Ambil data baris pertama dengan aman
        if (!result) return null;
        const rows = Array.isArray(result) ? (Array.isArray(result[0]) ? result[0] : result) : (result.rows || result);
        return rows && rows.length > 0 ? rows[0] : null;
    },

    createUser: async (username, email, hashedPassword, name) => {
        // 1. Insert ke tabel users
        const userResult = await db.query(
            'INSERT INTO users (username, email, password, name) VALUES (?, ?, ?, ?)', 
            [username, email, hashedPassword, name]
        );

        // Ambil ID secara aman
        const userId = userResult.insertId || (userResult[0] && userResult[0].insertId);

        // 2. Ambil ID untuk role 'User'
        const roleResult = await db.query("SELECT id, name FROM roles WHERE name = 'User'");
        
        // Pengecekan ekstra aman untuk mencari di mana letak datanya berada
        let roleId = null;

        if (roleResult) {
            // Gabungkan semua kemungkinan struktur data ke dalam satu array flat
            const dataFlat = [].concat(roleResult, roleResult.rows, roleResult[0]).filter(Boolean);
            
            // Cari objek yang memiliki properti 'id'
            const targetRole = dataFlat.find(item => item.id !== undefined);
            if (targetRole) {
                roleId = targetRole.id;
            }
        }

        // Jika taktik di atas gagal, gunakan fallback angka 2 (asumsi ID 'User' di database Anda adalah 2)
        // Sesuai urutan biasanya: 1 = Admin, 2 = User
        if (!roleId) {
            roleId = 2; 
        }

        // 3. Hubungkan ke tabel pivot user_roles
        await db.query(
            'INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)', 
            [userId, roleId]
        );

        return userId;
    }
};

module.exports = AuthService;