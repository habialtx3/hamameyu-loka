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
        latitude,
        longitude
      } = req.body;

      // 1. Validasi Input Dasar
      if (!title || !description || !category) {
        return sendError(res, 'Missing required fields. Please provide title, description, and category.', 400);
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

  /**
   * Delete report by ID
   */
  async deleteReport(req, res, next) {
    try {
      const { id } = req.params;
      const isDeleted = await reportService.deleteReport(parseInt(id));

      if (!isDeleted) {
        return sendError(res, `Report with ID ${id} not found.`, 404);
      }

      return sendSuccess(res, `Report with ID ${id} deleted successfully.`, { id: parseInt(id) });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get historical reports mapping to a dictionary structure
   */
  async getReportsHistory(req, res, next) {
    try {
      const { category, start_time, limit } = req.query;

      if (!category || !start_time) {
        return sendError(res, 'Missing required query parameters: category and start_time are mandatory.', 400);
      }

      const limitParsed = limit ? parseInt(limit) : 100;

      const historyData = await reportService.getReportsHistory({
        category,
        startTime: start_time,
        limit: limitParsed
      });

      // Transform array into dict format: REP-{id}
      const reportsMap = {};
      historyData.forEach(item => {
        reportsMap[`REP-${item.id}`] = {
          time_report: item.time_report,
          location: item.location,
          time_close: item.time_close
        };
      });

      const responseData = {
        report_count: historyData.length,
        reports: reportsMap
      };

      return sendSuccess(res, 'Daftar riwayat laporan berhasil diambil', responseData);
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportController();
