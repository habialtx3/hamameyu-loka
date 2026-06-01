const reportService = require('../services/report.service');
const { sendSuccess, sendError } = require('../utils/response');

class ReportController {
  async createReport(req, res, next) {
    try {
      const { title, description, category, priority, location } = req.body;

      if (!title || !description || !category) {
        return sendError(res, 'Missing required fields. Please provide title, description, and category.', 400);
      }

      // Ambil User ID dari middleware token session, dengan fallback data body/header
      let finalUserId = null;
      if (req.user && req.user.id) {
        finalUserId = req.user.id;
      } else if (req.body.userId) {
        finalUserId = parseInt(req.body.userId);
      } else if (req.headers['x-user-id']) {
        finalUserId = parseInt(req.headers['x-user-id']);
      }

      if (!finalUserId) {
        return sendError(res, 'Sesi tidak valid atau user_id tidak ditemukan. Silakan login kembali.', 401);
      }

      const latitude = location?.latitude;
      const longitude = location?.longitude;

      const reportData = {
        userId: finalUserId,
        title,
        description,
        category,
        priority: priority || 'medium',
        location: {
          latitude: latitude !== undefined && latitude !== null ? parseFloat(latitude) : 0,
          longitude: longitude !== undefined && longitude !== null ? parseFloat(longitude) : 0
        },
        images: req.body.images || []
      };

      const newReport = await reportService.createReport(reportData);
      return sendSuccess(res, 'Report created successfully.', newReport, 201);
    } catch (error) {
      next(error);
    }
  }

  async getAllReports(req, res, next) {
    try {
      const reports = await reportService.getAllReports();
      return sendSuccess(res, 'Reports retrieved successfully.', reports);
    } catch (error) {
      next(error);
    }
  }

  async getReportById(req, res, next) {
    try {
      const { id } = req.params;

      // Mengonversi string ':id' dari URL menjadi Integer untuk query database
      const report = await reportService.getReportById(parseInt(id));

      // Jika data memang tidak ada di database, pastikan dia mengembalikan status 404
      if (!report) {
        return sendError(res, `Report with ID ${id} not found.`, 404);
      }

      // Jika ada, kirim status 200 dengan datanya
      return sendSuccess(res, 'Report detail retrieved successfully.', report);
    } catch (error) {
      next(error); // Melempar ke error handler jika query database crash
    }
  }

  async updateReportStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) return sendError(res, 'Status field is required.', 400);

      const allowedStatuses = ['pending', 'processing', 'done'];
      if (!allowedStatuses.includes(status)) return sendError(res, 'Invalid status.', 400);

      const updatedReport = await reportService.updateReportStatus(parseInt(id), status);
      if (!updatedReport) return sendError(res, 'Report not found or update failed.', 404);

      return sendSuccess(res, `Report status updated successfully.`, updatedReport);
    } catch (error) {
      next(error);
    }
  }

  async deleteReport(req, res, next) {
    try {
      const { id } = req.params;
      const isDeleted = await reportService.deleteReport(parseInt(id));
      if (!isDeleted) return sendError(res, 'Report not found.', 404);
      return sendSuccess(res, `Report deleted successfully.`, { id: parseInt(id) });
    } catch (error) {
      next(error);
    }
  }

  async getReportsHistory(req, res, next) {
    try {
      const { category, start_time, limit } = req.query;
      if (!category || !start_time) return sendError(res, 'Missing query parameters.', 400);

      const historyData = await reportService.getReportsHistory({
        category,
        startTime: start_time,
        limit: limit ? parseInt(limit) : 100
      });

      const reportsMap = {};
      historyData.forEach(item => {
        reportsMap[`REP-${item.id}`] = {
          time_report: item.time_report,
          location: item.location,
          time_close: item.time_close
        };
      });

      return sendSuccess(res, 'Daftar riwayat laporan berhasil diambil', { report_count: historyData.length, reports: reportsMap });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ReportController();