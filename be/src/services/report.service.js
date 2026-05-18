const { pool, query } = require('../config/db');

/**
 * Service to handle Reports
 */
class ReportService {
  /**
   * Create a new report (includes location creation and batch image insertion)
   */
  async createReport({ userId, title, description, category, priority, location, images }) {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      // 1. Insert Location
      const insertLocationSql = `
        INSERT INTO locations (province, city, district, village, rt, rw, latitude, longitude)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [locationResult] = await conn.execute(insertLocationSql, [
        location.province,
        location.city,
        location.district,
        location.village,
        location.rt,
        location.rw,
        location.latitude,
        location.longitude
      ]);
      const locationId = locationResult.insertId;

      // 2. Insert Report
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

      // 3. Insert Images (if any)
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

      // Return the created report detail
      return this.getReportById(reportId);
    } catch (error) {
      await conn.rollback();
      throw error;
    } finally {
      conn.release();
    }
  }

  /**
   * Get all reports, including joined location data and aggregated image URLs
   */
  async getAllReports() {
    // We can query reports joined with locations
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

    // Fetch all images to attach in-memory
    const imagesSql = `SELECT report_id, image_url FROM report_images`;
    const images = await query(imagesSql);

    // Group images by report_id
    const imagesMap = {};
    images.forEach(img => {
      if (!imagesMap[img.report_id]) {
        imagesMap[img.report_id] = [];
      }
      imagesMap[img.report_id].push(img.image_url);
    });

    // Format the response structure nicely
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
   * Get single report by ID, with location and images
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

    // Fetch images for this report
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
   * Update report status
   */
  async updateReportStatus(id, status) {
    const updateSql = `
      UPDATE reports 
      SET status = ?
      WHERE id = ?
    `;
    const result = await query(updateSql, [status, id]);
    if (result.affectedRows === 0) return null;

    return this.getReportById(id);
  }
}

module.exports = new ReportService();
