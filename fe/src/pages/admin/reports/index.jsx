import { useEffect, useState } from "react";
import { reportService } from "../../../services/api";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar";

export default function AdminReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State untuk Filter Pencarian & Dropdown Status
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Semua Status");

  // Di dalam komponen AdminReportsPage:
  const navigate = useNavigate();

  // Ambil data dari API saat komponen pertama kali dibuka
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await reportService.getAllReports();
        if (response && response.success) {
          setReports(response.data || []);
        } else {
          throw new Error(response.message || "Gagal memuat data laporan");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  // --- 1. KALKULASI SUMMARY (Menyesuaikan dengan value API: pending, processing, done) ---
  const totalReports = reports.length;
  const processedReports = reports.filter(
    (r) => r.status?.toLowerCase() === "processing",
  ).length;
  const resolvedReports = reports.filter(
    (r) => r.status?.toLowerCase() === "done",
  ).length;

  // --- 2. PEMETAAN KATEGORI KE BAHASA INDONESIA ---
  const getCategoryLabel = (category) => {
    if (!category) return "-";

    switch (category.toUpperCase()) {
      case "WASTE":
        return "Pengelolaan Sampah";
      case "SIGNS_AND_MARKINGS":
        return "Rambu & Markah Jalan";
      case "PUBLIC_FACILITIES":
        return "Fasilitas Publik";
      case "ROAD_AND_SIDEWALK":
        return "Jalan & Trotoar Rusak";
      case "TREES_AND_GREEN_SPACE":
        return "Pohon & Ruang Terbuka Hijau";
      default:
        // Antisipasi jika ada kategori lain, otomatis hilangkan underscore dan rapikan teksnya
        return category
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/\b\w/g, (char) => char.toUpperCase());
    }
  };

  // --- 3. HELPER VISUAL STATUS (Menyesuaikan pending, processing, done) ---
  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Diterima";
      case "processing":
        return "Diproses";
      case "done":
        return "Selesai";
      default:
        return status || "Diterima";
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-gray-100 text-gray-600";
      case "processing":
        return "bg-yellow-100 text-yellow-700";
      case "done":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Format tanggal ISO dari API menjadi format teks Indonesia
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // --- 4. LOGIKA FILTER SEARCH BAR & DROPDOWN ---
  const filteredReports = reports.filter((item) => {
    const matchesSearch =
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id?.toString().includes(searchQuery);

    let matchesStatus = true;
    if (statusFilter !== "Semua Status") {
      const mappedStatus = getStatusLabel(item.status);
      matchesStatus = mappedStatus === statusFilter;
    }

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="bg-[#f6faf7] min-h-screen lg:flex">
      {/* SIDEBAR (Jika ada komponen sidebar, tempatkan di sini) */}
       <Sidebar />

      {/* MAIN CONTENT */}
      <main className="flex-1 overflow-y-auto">
        {/* TOPBAR */}
        <header className="px-4 sm:px-6 lg:px-10 py-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-black">
              Semua Laporan
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Kelola seluruh laporan warga Kota Batam.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            <input
              type="text"
              placeholder="Cari laporan berdasarkan judul atau ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#51a750]/20 w-full"
            />

            {/* DROPDOWN FILTER STATUS */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-full px-5 py-3 pr-12 text-sm focus:outline-none w-full"
              >
                <option>Semua Status</option>
                <option>Diterima</option>
                <option>Diproses</option>
                <option>Selesai</option>
              </select>
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                ▼
              </span>
            </div>

            <button className="bg-[#51a750] hover:bg-[#459144] text-white px-6 py-3 rounded-full text-sm font-semibold transition whitespace-nowrap">
              Export Data
            </button>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-10 pb-10">
          {/* STATS KARTU RINGKASAN */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
            <div className="bg-white border border-[#edf3ee] rounded-[28px] p-6">
              <p className="text-sm text-gray-500">Total Laporan</p>
              <h2 className="text-3xl font-black mt-2 text-black">
                {loading ? "..." : totalReports.toLocaleString("id-ID")}
              </h2>
            </div>

            <div className="bg-white border border-[#edf3ee] rounded-[28px] p-6">
              <p className="text-sm text-gray-500">Sedang Diproses</p>
              <h2 className="text-3xl font-black mt-2 text-yellow-600">
                {loading ? "..." : processedReports.toLocaleString("id-ID")}
              </h2>
            </div>

            <div className="bg-white border border-[#edf3ee] rounded-[28px] p-6 sm:col-span-2 xl:col-span-1">
              <p className="text-sm text-gray-500">Laporan Selesai</p>
              <h2 className="text-3xl font-black mt-2 text-green-600">
                {loading ? "..." : resolvedReports.toLocaleString("id-ID")}
              </h2>
            </div>
          </div>

          {/* TABLE CONTAINER */}
          <div className="bg-white rounded-[30px] border border-[#edf3ee] p-4 sm:p-6 overflow-hidden">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-black">
                  Data Laporan Warga
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Menampilkan seluruh laporan yang masuk dari API database.
                </p>
              </div>

              <button className="bg-[#eef9f0] text-[#51a750] px-5 py-2.5 rounded-full text-sm font-semibold w-full sm:w-fit">
                + Tambah Laporan
              </button>
            </div>

            {/* STATUS UTILITY VIEWS */}
            {loading && (
              <div className="text-center py-12 text-gray-500 text-sm animate-pulse">
                Menghubungkan ke server api & sinkronisasi data...
              </div>
            )}

            {error && (
              <div className="text-center py-8 text-red-500 text-sm bg-red-50 rounded-2xl p-4 border border-red-100">
                ⚠️ Koneksi Gagal: {error}
              </div>
            )}

            {!loading && !error && filteredReports.length === 0 && (
              <div className="text-center py-12 text-gray-400 text-sm">
                Tidak ada laporan yang sesuai dengan pencarian atau filter
                status Anda.
              </div>
            )}

            {/* TAMPILAN CARD MOBILE (Lg:Hidden) */}
            {!loading && !error && filteredReports.length > 0 && (
              <div className="grid grid-cols-1 gap-4 lg:hidden">
                {filteredReports.map((item, index) => (
                  <div
                    key={item.id || index}
                    className="border border-[#edf3ee] rounded-[24px] p-5 bg-[#fcfffc]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-[#eef9f0] flex items-center justify-center text-xl">
                          📍
                        </div>
                        <div>
                          <h3 className="font-bold text-black text-sm line-clamp-1">
                            {item.title}
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            ID Laporan: #{item.id}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`text-xs px-3 py-1.5 rounded-full font-semibold whitespace-nowrap ${getStatusStyle(item.status)}`}
                      >
                        {getStatusLabel(item.status)}
                      </span>
                    </div>

                    <div className="mt-5 space-y-3 text-sm">
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-400">Koordinat Lokasi</span>
                        <span className="font-medium text-gray-700 text-right text-xs">
                          {item.location
                            ? `${parseFloat(item.location.latitude).toFixed(4)}, ${parseFloat(item.location.longitude).toFixed(4)}`
                            : "-"}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-gray-400">Kategori</span>
                        <span className="bg-[#eef9f0] text-[#51a750] text-xs px-3 py-1 rounded-full font-medium">
                          {getCategoryLabel(item.category)}
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-gray-400">ID Pelapor</span>
                        <span className="font-medium text-gray-700 text-right">
                          Warga (ID: {item.user_id || "-"})
                        </span>
                      </div>

                      <div className="flex justify-between gap-4">
                        <span className="text-gray-400">Tanggal Masuk</span>
                        <span className="font-medium text-gray-700 text-right">
                          {formatDate(item.time_report)}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-5 w-full">
                      <button
                        onClick={() => navigate(`/reports/${item.id}`)}
                        className="flex-1 text-center px-4 py-3 rounded-full text-sm bg-[#eef9f0] text-[#51a750] font-semibold transition hover:opacity-80"
                      >
                        Detail
                      </button>

                      <button className="flex-1 px-4 py-3 rounded-full text-sm bg-[#f5f5f5] text-gray-600 font-semibold transition hover:opacity-80">
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* TAMPILAN TABLE DESKTOP (Hidden on Mobile) */}
            {!loading && !error && filteredReports.length > 0 && (
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full min-w-[1000px]">
                  <thead>
                    <tr className="text-left text-sm text-gray-400 border-b border-gray-100">
                      <th className="pb-4 font-medium">ID</th>
                      <th className="pb-4 font-medium">Laporan</th>
                      <th className="pb-4 font-medium">Lokasi (Lat, Long)</th>
                      <th className="pb-4 font-medium">Kategori</th>
                      <th className="pb-4 font-medium">Pelapor</th>
                      <th className="pb-4 font-medium">Tanggal</th>
                      <th className="pb-4 font-medium">Status</th>
                      <th className="pb-4 font-medium text-center">Aksi</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredReports.map((item, index) => (
                      <tr
                        key={item.id || index}
                        className="border-b border-gray-50 hover:bg-[#f8fcf8] transition"
                      >
                        <td className="py-5 text-sm text-gray-500 font-medium">
                          #{item.id}
                        </td>

                        <td className="py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-[#eef9f0] flex items-center justify-center text-lg">
                              📍
                            </div>
                            <div>
                              <p className="font-semibold text-sm text-black max-w-[220px] truncate">
                                {item.title}
                              </p>
                              <span className="text-xs text-gray-400 capitalize">
                                Prioritas: {item.priority || "medium"}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="text-sm text-gray-600 text-xs font-mono">
                          {item.location
                            ? `${parseFloat(item.location.latitude).toFixed(4)}, ${parseFloat(item.location.longitude).toFixed(4)}`
                            : "-"}
                        </td>

                        <td>
                          <span className="bg-[#eef9f0] text-[#51a750] text-xs px-3 py-1 rounded-full font-medium">
                            {getCategoryLabel(item.category)}
                          </span>
                        </td>

                        <td className="text-sm text-gray-600">
                          User ID: {item.user_id || "-"}
                        </td>

                        <td className="text-sm text-gray-500">
                          {formatDate(item.time_report)}
                        </td>

                        <td>
                          <span
                            className={`text-xs px-3 py-1.5 rounded-full font-semibold ${getStatusStyle(item.status)}`}
                          >
                            {getStatusLabel(item.status)}
                          </span>
                        </td>

                        <td>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => navigate(`/reports/${item.id}`)}
                              className="flex not-last:text-center px-4 py-3 rounded-full text-sm bg-[#eef9f0] text-[#51a750] font-semibold transition hover:opacity-80"
                            >
                              Detail
                            </button>

                            <button className="flex px-4 py-3 rounded-full text-sm bg-[#f5f5f5] text-gray-600 font-semibold transition hover:opacity-80">
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* CONTROL PAGINATION */}
            {!loading && !error && filteredReports.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-8">
                <p className="text-sm text-gray-500">
                  Menampilkan 1-{filteredReports.length} dari{" "}
                  {filteredReports.length} laporan ditemukan
                </p>

                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:bg-[#f5faf6] transition">
                    ←
                  </button>
                  <button className="w-10 h-10 rounded-full bg-[#51a750] text-white font-semibold">
                    1
                  </button>
                  <button className="w-10 h-10 rounded-full border border-gray-200 text-gray-500 hover:bg-[#f5faf6] transition">
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
