const reportService = require('../services/report.service');
const { sendSuccess, sendError } = require('../utils/response');

/**
 * Controller to handle Reports HTTP requests
 */
class ReportController {
  /**
   * Create a new report (including location & files)
   */
  async createReport(req, res, next) {
    try {
      const {
        title,
        description,
        category,
        priority,
        province,
        city,
        district,
        village,
        rt,
        rw,
        latitude,
        longitude
      } = req.body;

      // 1. Validasi Input Dasar
      if (!title || !description || !category || !province || !city || !district || !rt || !rw) {
        return sendError(res, 'Missing required fields. Please provide title, description, category, and complete location data.', 400);
      }

      // Validasi Kategori
      const allowedCategories = ['sampah', 'lampu jalan', 'jalan rusak', 'drainase'];
      if (!allowedCategories.includes(category)) {
        return sendError(res, `Invalid category. Must be one of: ${allowedCategories.join(', ')}`, 400);
      }

      // Validasi Prioritas jika ada
      const allowedPriorities = ['low', 'medium', 'high'];
      if (priority && !allowedPriorities.includes(priority)) {
        return sendError(res, `Invalid priority. Must be one of: ${allowedPriorities.join(', ')}`, 400);
      }

      // User ID Mock: Ambil dari header 'x-user-id', jika tidak ada default ke 1 (Warga Budi)
      const userId = parseInt(req.headers['x-user-id']) || 1;

      // Ambil path gambar yang di-upload dari Multer
      const images = req.files ? req.files.map(file => `/uploads/reports/${file.filename}`) : [];

      const reportData = {
        userId,
        title,
        description,
        category,
        priority: priority || 'medium',
        location: {
          province,
          city,
          district,
          village: village || '',
          rt,
          rw,
          latitude: latitude ? parseFloat(latitude) : 0,
          longitude: longitude ? parseFloat(longitude) : 0
        },
        images
      };

      const newReport = await reportService.createReport(reportData);
      return sendSuccess(res, 'Report created successfully.', newReport, 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all reports
   */
  async getAllReports(req, res, next) {
    try {
      const reports = await reportService.getAllReports();
      return sendSuccess(res, 'Reports retrieved successfully.', reports);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get report detail by ID
   */
  async getReportById(req, res, next) {
    try {
      const { id } = req.params;
      const report = await reportService.getReportById(parseInt(id));

      if (!report) {
        return sendError(res, `Report with ID ${id} not found.`, 404);
      }

      return sendSuccess(res, 'Report detail retrieved successfully.', report);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update report status (admin RT/RW only, e.g., pending -> processing -> done)
   */
  async updateReportStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return sendError(res, 'Status field is required.', 400);
      }

      const allowedStatuses = ['pending', 'processing', 'done'];
      if (!allowedStatuses.includes(status)) {
        return sendError(res, `Invalid status. Must be one of: ${allowedStatuses.join(', ')}`, 400);
      }

      const updatedReport = await reportService.updateReportStatus(parseInt(id), status);

      if (!updatedReport) {
        return sendError(res, `Report with ID ${id} not found or update failed.`, 404);
      }

      return sendSuccess(res, `Report status updated to ${status} successfully.`, updatedReport);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportController();
