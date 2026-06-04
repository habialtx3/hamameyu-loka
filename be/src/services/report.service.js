const { getPool, query } = require('../config/db');

/**
 * Service to handle Reports database queries (strictly using raw SQL queries with parameterization)
 */
class ReportService {
  /**
   * Membuat report baru beserta lokasinya dan banyak foto (One-to-One dengan lokasi, One-to-Many dengan foto)
   * Menggunakan MySQL Transaction demi konsistensi data.
   */
  async createReport({ userId, title, description, category, priority, location, images }) {
    const pool = getPool();
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // 1. Simpan Data Lokasi
      const insertLocationSql = `
        INSERT INTO locations (latitude, longitude)
        VALUES (?, ?)
      `;
      const [locationResult] = await conn.execute(insertLocationSql, [
        location.latitude || 0,
        location.longitude || 0
      ]);
      const locationId = locationResult.insertId;

      // 2. Simpan Data Laporan (default status: pending)
      const insertReportSql = `
        INSERT INTO reports (user_id, title, description, category, priority, location_id, status)
        VALUES (?, ?, ?, ?, ?, ?, 'pending')
      `;
      const [reportResult] = await conn.execute(insertReportSql, [
        userId,
        title,
        description,
        category,
        priority || 'medium',
        locationId
      ]);
      const reportId = reportResult.insertId;

      // 3. Simpan Banyak Gambar (jika ada)
      if (images && images.length > 0) {
        const insertImageSql = `
          INSERT INTO report_images (report_id, image_url)
          VALUES (?, ?)
        `;
        for (const imageUrl of images) {
          await conn.execute(insertImageSql, [reportId, imageUrl]);
        }
      }

      await conn.commit();

      // Kembalikan detail report yang baru dibuat
      return await this.getReportById(reportId);
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  /**
   * Mengambil semua laporan beserta relasi lokasi dan array gambar (Aggregated)
   */
  async getAllReports() {
    // 1. Ambil pool koneksi seperti di fungsi createReport
    const pool = getPool();

    try {
      // 2. Gunakan pool.execute untuk mengambil data laporan dan lokasi
      const reportsSql = `
      SELECT 
        r.id, r.user_id, r.title, r.description, r.category, r.status, r.priority, r.time_report, r.time_close,
        l.id as location_id, l.latitude, l.longitude
      FROM reports r
      JOIN locations l ON r.location_id = l.id
      ORDER BY r.time_report DESC
    `;
      // mysql2 mengembalikan array [rows, fields], kita destructuring ambil rows-nya saja
      const [reports] = await pool.execute(reportsSql);

      if (reports.length === 0) return [];

      // 3. Ambil semua gambar sekaligus (Menghindari N+1 Query)
      const imagesSql = `SELECT report_id, image_url FROM report_images`;
      const [images] = await pool.execute(imagesSql);

      // 4. Kelompokkan url gambar berdasarkan report_id (Logika kamu sudah mantap di sini)
      const imagesMap = {};
      images.forEach(img => {
        if (!imagesMap[img.report_id]) {
          imagesMap[img.report_id] = [];
        }
        imagesMap[img.report_id].push(img.image_url);
      });

      // 5. Format output respons agar rapi dan terstruktur
      return reports.map(r => ({
        id: r.id,
        user_id: r.user_id,
        title: r.title,
        description: r.description,
        category: r.category,
        status: r.status,
        priority: r.priority,
        time_report: r.time_report,
        time_close: r.time_close,
        location: {
          id: r.location_id,
          latitude: r.latitude,
          longitude: r.longitude
        },
        images: imagesMap[r.id] || []
      }));

    } catch (error) {
      // Selalu tangkap error agar jika gagal ketahuan log-nya di terminal
      console.error("Error di getAllReports Service:", error);
      throw error;
    }
  }

  /**
   * Mengambil detail laporan tunggal berdasarkan ID beserta relasi lokasi dan gambarnya
   */
  async getReportById(id) {
    const reportSql = `
      SELECT 
        r.id, r.user_id, r.title, r.description, r.category, r.status, r.priority, r.time_report, r.time_close,
        l.id as location_id, l.latitude, l.longitude
      FROM reports r
      JOIN locations l ON r.location_id = l.id
      WHERE r.id = ?
    `;
    const reports = await query(reportSql, [id]);

    if (reports.length === 0) return null;
    const r = reports[0];

    // Ambil gambar untuk laporan ini
    const imagesSql = `SELECT image_url FROM report_images WHERE report_id = ?`;
    const images = await query(imagesSql, [id]);

    return {
      id: r.id,
      user_id: r.user_id,
      title: r.title,
      description: r.description,
      category: r.category,
      status: r.status,
      priority: r.priority,
      time_report: r.time_report,
      time_close: r.time_close,
      location: {
        id: r.location_id,
        latitude: r.latitude,
        longitude: r.longitude
      },
      images: images.map(img => img.image_url)
    };
  }

  /**
   * Memperbarui status laporan (pending, processing, done) oleh admin RT/RW
   * Serta memperbarui time_close jika status diubah ke 'done' (atau NULL jika selain itu)
   */
  async updateReportStatus(id, status) {
    const updateSql = `
      UPDATE reports 
      SET status = ?, time_close = IF(? = 'done', CURRENT_TIMESTAMP, NULL)
      WHERE id = ?
    `;
    const result = await query(updateSql, [status, status, id]);
    if (result.affectedRows === 0) return null;

    return await this.getReportById(id);
  }

  /**
   * Menghapus laporan secara transactional (menghapus gambar & lokasi terkait)
   */
  async deleteReport(id) {
    const report = await this.getReportById(id);
    if (!report) return false;

    const pool = getPool();
    const conn = await pool.getConnection();

    try {
      await conn.beginTransaction();

      // 1. Hapus report (otomatis cascade menghapus di report_images)
      const deleteReportSql = `DELETE FROM reports WHERE id = ?`;
      await conn.execute(deleteReportSql, [id]);

      // 2. Hapus lokasi terkait agar tidak tersisa sebagai yatim (orphaned)
      const deleteLocationSql = `DELETE FROM locations WHERE id = ?`;
      await conn.execute(deleteLocationSql, [report.location.id]);

      await conn.commit();
      return true;
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  /**
   * Mengambil daftar report historis berdasarkan kategori dan start_time
   */
  async getReportsHistory({ category, startTime, limit = 100 }) {
    const historySql = `
      SELECT 
        r.id, r.time_report, r.time_close,
        l.latitude, l.longitude
      FROM reports r
      JOIN locations l ON r.location_id = l.id
      WHERE r.category = ? AND r.time_report >= ?
      ORDER BY r.time_report DESC
      LIMIT ?
    `;
    const reports = await query(historySql, [category, startTime, limit]);

    return reports.map(r => ({
      id: r.id,
      time_report: r.time_report,
      time_close: r.time_close,
      location: {
        latitude: r.latitude,
        longitude: r.longitude
      }
    }));
  }
}

module.exports = new ReportService();
