const userService = require('../services/user.service.js');

class UserController {
  // Handler untuk GET /api/users
  async fetchAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      return res.status(200).json({
        success: true,
        data: users
      });
    } catch (error) {
      console.error("Error di fetchAllUsers:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }

  // Handler untuk PATCH /api/users/:id/role
  async changeRole(req, res) {
    const { id } = req.params;
    const { role } = req.body; // FE mengirim { "role": "admin" } atau { "role": "resident" }

    if (!role) {
      return res.status(400).json({ success: false, message: "Field 'role' wajib diisi." });
    }

    try {
      const updated = await userService.updateUserRole(id, role);
      if (!updated) {
        return res.status(404).json({ success: false, message: "User tidak ditemukan atau gagal diupdate." });
      }

      return res.status(200).json({
        success: true,
        message: `Role user berhasil diubah menjadi ${role}`,
        data: updated
      });
    } catch (error) {
      console.error("Error di changeRole:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
}

module.exports = new UserController();