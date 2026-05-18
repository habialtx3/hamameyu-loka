const reportService = require('../services/report.service');
const { sendSuccess, sendError } = require('../utils/response');

class ReportController {
  /**
   * Create a new report
   */
  async createReport(req, res, next) {
    try {
      const { title, description, category, priority, province, city, district, village, latitude, longitude } = req.body;

      // Basic validation
      if (!title || !description || !category || !province || !city || !district || !latitude || !longitude) {
        return sendError(res, 'Missing required fields. Ensure title, description, category, and full location coordinates are provided.', 400);
      }

      // Validate category
      const allowedCategories = ['sampah', 'lampu jalan', 'jalan rusak', 'drainase'];
      if (!allowedCategories.includes(category)) {
        return sendError(res, `Invalid category. Must be one of: ${allowedCategories.join(', ')}`, 400);
      }

      // Validate priority if provided
      const allowedPriorities = ['low', 'medium', 'high'];
      if (priority && !allowedPriorities.includes(priority)) {
        return sendError(res, `Invalid priority. Must be one of: ${allowedPriorities.join(', ')}`, 400);
      }

      // Mock user context: Read x-user-id from headers, default to 1 (Warga Budi)
      const userId = parseInt(req.headers['x-user-id']) || 1;

      // Extract image paths from uploaded files (via Multer)
      const images = req.files ? req.files.map(file => `/uploads/reports/${file.filename}`) : [];

      const reportData = {
        userId,
        title,
        description,
        category,
        priority,
        location: {
          province,
          city,
          district,
          village,
          latitude: parseFloat(latitude),
          longitude: parseFloat(longitude)
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
   * Update report status
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
