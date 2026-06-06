const BASE_URL = 'http://localhost:5000/api';

export const reportService = {
  // 1. Create Report menggunakan FormData (mendukung upload gambar)
  createReport: async (formData) => {
    try {
      const response = await fetch(`${BASE_URL}/reports`, {
        method: "POST",
        credentials: "include", // Tetap wajib agar cookie token (JWT) kamu ikut terkirim
        body: formData, // Mengirim objek FormData
      });
      
      return await response.json();
    } catch (error) {
      console.error("Gagal membuat laporan di service:", error);
      return { success: false, message: "Terjadi kesalahan jaringan." };
    }
  },
  
  // 3. Get All Reports
  getAllReports: async () => {
    try {
      const response = await fetch(`${BASE_URL}/reports`);
      if (!response.ok) throw new Error('Gagal mengambil semua laporan');
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: [] };
    }
  },

  // 5. Update Report Status
  updateStatus: async (id, status) => {
    try {
      const response = await fetch(`${BASE_URL}/reports/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error('Gagal memperbarui status laporan');
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },

  // 7. Get Historical Reports (Untuk tren visualisasi data)
  getHistory: async (category, startTime, limit = 100) => {
    try {
      const response = await fetch(
        `${BASE_URL}/reports/history?category=${category}&start_time=${startTime}&limit=${limit}`
      );
      if (!response.ok) throw new Error('Gagal mengambil riwayat laporan');
      return await response.json();
    } catch (error) {
      console.error(error);
      return { success: false, data: { report_count: 0, reports: {} } };
    }
  }
};