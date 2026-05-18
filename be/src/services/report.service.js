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
        INSERT INTO locations (province, city, district, village, rt, rw, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [locationResult] = await conn.execute(insertLocationSql, [
        location.province,
        location.city,
        location.district,
        location.village || '',
        location.rt || '',
        location.rw || '',
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
    const reportsSql = `
      SELECT 
        r.id, r.user_id, r.title, r.description, r.category, r.status, r.priority, r.created_at,
        l.id as location_id, l.province, l.city, l.district, l.village, l.rt, l.rw, l.latitude, l.longitude
      FROM reports r
      JOIN locations l ON r.location_id = l.id
      ORDER BY r.created_at DESC
    `;
    const reports = await query(reportsSql);

    if (reports.length === 0) return [];

    // Ambil semua gambar sekaligus untuk efisiensi (menghindari N+1 query)
    const imagesSql = `SELECT report_id, image_url FROM report_images`;
    const images = await query(imagesSql);

    // Kelompokkan url gambar berdasarkan report_id
    const imagesMap = {};
    images.forEach(img => {
      if (!imagesMap[img.report_id]) {
        imagesMap[img.report_id] = [];
      }
      imagesMap[img.report_id].push(img.image_url);
    });

    // Format output respons agar rapi
    return reports.map(r => ({
      id: r.id,
      user_id: r.user_id,
      title: r.title,
      description: r.description,
      category: r.category,
      status: r.status,
      priority: r.priority,
      created_at: r.created_at,
      location: {
        id: r.location_id,
        province: r.province,
        city: r.city,
        district: r.district,
        village: r.village,
        rt: r.rt,
        rw: r.rw,
        latitude: r.latitude,
        longitude: r.longitude
      },
      images: imagesMap[r.id] || []
    }));
  }

  /**
   * Mengambil detail laporan tunggal berdasarkan ID beserta relasi lokasi dan gambarnya
   */
  async getReportById(id) {
    const reportSql = `
      SELECT 
        r.id, r.user_id, r.title, r.description, r.category, r.status, r.priority, r.created_at,
        l.id as location_id, l.province, l.city, l.district, l.village, l.rt, l.rw, l.latitude, l.longitude
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
      created_at: r.created_at,
      location: {
        id: r.location_id,
        province: r.province,
        city: r.city,
        district: r.district,
        village: r.village,
        rt: r.rt,
        rw: r.rw,
        latitude: r.latitude,
        longitude: r.longitude
      },
      images: images.map(img => img.image_url)
    };
  }

  /**
   * Memperbarui status laporan (pending, processing, done) oleh admin RT/RW
   */
  async updateReportStatus(id, status) {
    const updateSql = `
      UPDATE reports 
      SET status = ?
      WHERE id = ?
    `;
    const result = await query(updateSql, [status, id]);
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
}

module.exports = new ReportService();
