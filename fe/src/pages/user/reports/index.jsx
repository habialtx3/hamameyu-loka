import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../../../components/navbar";

export default function UserReportsPage() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchUserReports = async () => {
    setIsLoading(true);
    try {
      // Menggunakan fetch native yang sama dengan struktur dasar endpoint Anda
      const res = await fetch("http://localhost:5000/api/reports", {
        method: "GET",
        headers: {
          "x-user-id": "1", // Mock User ID Resident
        },
      });
      const responseJson = await res.json();

      if (responseJson.success && Array.isArray(responseJson.data)) {
        // FILTER: Hanya mengambil laporan milik user_id 1 (Personal Resident)
        const myReports = responseJson.data.filter(
          (item) => item.user_id === 8,
        );
        setReports(myReports);
      }
    } catch (error) {
      console.error("Gagal mengambil data laporan warga:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Ambil data dari backend saat komponen pertama kali dimuat
  useEffect(() => {
    fetchUserReports();
  }, []);

  // HELPER 1: Mengatur warna bodi kartu, ketebalan border, dan warna teks utama
  const getCardStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "received":
      case "pending":
      case "diterima":
      case "ditinjau":
        // Latar belakang putih bersih, border abu-abu tebal & putus-putus
        return "bg-white border-2 border-dashed border-gray-400 hover:bg-gray-50 text-gray-900";

      case "processing":
      case "diproses":
      case "pengerjaan":
        // Latar belakang Kuning/Amber tegas, teks hitam pekat untuk kontras maksimal
        return "bg-amber-400 border border-amber-500 hover:bg-amber-500 text-black";

      case "done":
      case "selesai":
        // Latar belakang Hijau solid, komponen teks di dalamnya otomatis putih bersih
        return "bg-[#51a750] border border-[#449144] hover:bg-[#459144] text-white";

      default:
        return "bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-900";
    }
  };

  // HELPER 2: Mengatur warna badge kecil status agar kontras dengan warna bodi kartu
  const getBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "received":
      case "pending":
      case "diterima":
      case "ditinjau":
        return "bg-gray-800 text-white";
      case "processing":
      case "diproses":
      case "pengerjaan":
        return "bg-black text-white";
      case "done":
      case "selesai":
        return "bg-white text-[#51a750]";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  // HELPER 3: Standardisasi Label Bahasa
  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "received":
      case "pending":
      case "ditinjau":
        return "Ditinjau";
      case "processing":
      case "pengerjaan":
        return "Diproses";
      case "done":
      case "selesai":
        return "Selesai";
      default:
        return status;
    }
  };

  // FILTER SEARCH (Memeriksa judul, ID, atau deskripsi laporan)
  const filteredReports = reports.filter((report) => {
    const query = search.toLowerCase();
    return (
      report.title?.toLowerCase().includes(query) ||
      report.id?.toString().toLowerCase().includes(query) ||
      report.description?.toLowerCase().includes(query)
    );
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6faf7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#51a750] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium text-sm animate-pulse">
            Menghubungkan & memuat data keluhan...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6faf7]">
      <Navbar variant="dashboard" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
          {/* LEFT */}
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-black">
              My Reports
            </h1>
            <p className="text-sm text-gray-500 mt-1 max-w-2xl">
              View all reports and complaint history submitted by you.
            </p>
          </div>

          {/* SEARCH */}
          <div className="w-full lg:max-w-md">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>

              <input
                type="text"
                placeholder="Search report by title, ID or content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-[#51a750]/20 focus:border-[#51a750] transition"
              />
            </div>
          </div>
        </div>

        {/* REPORT LIST CONTAINER */}
        <div className="space-y-4">
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => {
              const cardStyle = getCardStyle(report.status);
              const badgeStyle = getBadgeStyle(report.status);

              const isDone =
                report.status?.toLowerCase() === "done" ||
                report.status?.toLowerCase() === "selesai";
              const isProcessing =
                report.status?.toLowerCase() === "processing" ||
                report.status?.toLowerCase() === "diproses" ||
                report.status?.toLowerCase() === "pengerjaan";

              // Sinkronisasi warna teks deskripsi bawah agar kontras lulus uji
              const textMetaColor = isDone
                ? "text-green-100/90"
                : isProcessing
                  ? "text-amber-950/70"
                  : "text-gray-400";

              const textDescColor = isDone
                ? "text-green-50/90"
                : isProcessing
                  ? "text-amber-900/90"
                  : "text-gray-600";

              const textTitleColor = isDone ? "text-white" : "text-black";

              return (
                <div
                  key={report.id}
                  className={`rounded-[24px] p-5 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 transition-all duration-200 shadow-sm ${cardStyle}`}
                >
                  {/* LEFT CONTENT */}
                  <div className="flex-1 min-w-0">
                    {/* TOP INFO METADATA */}
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span
                        className={`text-xs font-black ${isDone ? "text-green-100" : "text-gray-500"}`}
                      >
                        #{report.id}
                      </span>

                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider border shadow-sm ${
                          isDone
                            ? "bg-green-600/30 border-green-400/20 text-white"
                            : isProcessing
                              ? "bg-amber-500/20 border-amber-600/20 text-amber-950"
                              : "bg-white/80 text-gray-700 border-gray-100"
                        }`}
                      >
                        {report.category || "General"}
                      </span>

                      {/* Badge Status Kontras */}
                      <span
                        className={`text-[11px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wide shadow-sm ${badgeStyle}`}
                      >
                        {getStatusLabel(report.status)}
                      </span>
                    </div>

                    {/* TITLE */}
                    <h2
                      className={`text-lg sm:text-xl font-black leading-tight mb-2 ${textTitleColor}`}
                    >
                      {report.title}
                    </h2>

                    {/* DESCRIPTION */}
                    <p
                      className={`text-sm leading-relaxed line-clamp-2 max-w-4xl ${textDescColor}`}
                    >
                      {report.description}
                    </p>

                    {/* DATE */}
                    <p
                      className={`text-xs font-semibold mt-3 ${textMetaColor}`}
                    >
                      Dikirim pada:{" "}
                      {report.time_report
                        ? new Date(report.time_report).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "long", year: "numeric" },
                          )
                        : report.date || "-"}
                    </p>
                  </div>

                  {/* BUTTON ACTION */}
                  <div className="w-full lg:w-auto flex justify-end items-center shrink-0">
                    <Link
                      to={`/reports/${report.id}`}
                      state={{ from: "/reports" }}
                      className="w-full sm:w-auto"
                    >
                      <button
                        className={`w-full sm:w-auto text-center px-6 py-3 rounded-full text-sm font-black transition-all shadow-md border ${
                          isDone
                            ? "bg-white hover:bg-gray-100 text-[#51a750] border-transparent"
                            : isProcessing
                              ? "bg-black hover:bg-gray-900 text-white border-transparent"
                              : "bg-white hover:bg-black hover:text-white text-black border-gray-300"
                        }`}
                      >
                        See More →
                      </button>
                    </Link>
                  </div>
                </div>
              );
            })
          ) : (
            /* EMPTY STATE */
            <div className="bg-white border border-[#edf3ee] rounded-[28px] p-12 text-center shadow-sm">
              <div className="text-4xl mb-3">🔍</div>
              <h3 className="text-lg font-bold text-black mb-1">
                No Reports Found
              </h3>
              <p className="text-gray-500 text-sm">
                Belum ada berkas laporan keluhan yang sesuai dengan kata kunci
                Anda.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
