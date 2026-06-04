const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Memanggil pool database

// POST /auth/register
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user baru
    const userQuery = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id';
    const userResult = await db.query(userQuery, [username, email, hashedPassword]);
    const userId = userResult.rows[0].id;

    // Ambil ID untuk role 'User' (Default)
    const roleResult = await db.query("SELECT id FROM roles WHERE name = 'User'");
    if (roleResult.rows.length === 0) {
      return res.status(500).json({ error: "Role 'User' belum di-input di database." });
    }
    const roleId = roleResult.rows[0].id;

    // Hubungkan user ke role 'User'
    await db.query('INSERT INTO user_roles (user_id, role_id) VALUES ($1, $2)', [userId, roleId]);

    res.status(201).json({ message: "User berhasil didaftarkan dengan role User!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const query = `
      SELECT u.*, r.name as role_name 
      FROM users u
      JOIN user_roles ur ON u.id = ur.user_id
      JOIN roles r ON ur.role_id = r.id
      WHERE u.email = $1
    `;
    const result = await db.query(query, [email]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Email atau password salah" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role_name },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: "Login berhasil", token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;