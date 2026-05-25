import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../../../components/navbar";

export default function UserDashboardPage() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch data dari backend
  useEffect(() => {
    fetch("http://localhost:5000/api/reports", {
      method: "GET",
      headers: {
        "x-user-id": "1", // Mock User ID sesuai dokumentasi backend Anda
      },
    })
      .then((res) => res.json())
      .then((responseJson) => {
        if (responseJson.success) {
          // Filter hanya report milik user_id 1 untuk dashboard personal resident
          const myReports = responseJson.data.filter(
            (item) => item.user_id === 1,
          );
          setReports(myReports);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Gagal mengambil data:", error);
        setIsLoading(false);
      });
  }, []);

  // Hitung data statistik secara dinamis
  const totalComplaints = reports.length;
  const processedComplaints = reports.filter(
    (r) => r.status === "processing",
  ).length;
  const resolvedComplaints = reports.filter((r) => r.status === "done").length;

  // Mengatur warna bodi kartu, ketebalan border, dan warna teks utama berdasarkan status
  const getCardStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "received":
      case "pending":
      case "diterima":
        // Latar belakang putih bersih, border abu-abu tebal & putus-putus
        return "bg-white border-2 border-dashed border-gray-400 hover:bg-gray-50 text-gray-900";

      case "processing":
      case "diproses":
        // Latar belakang Kuning/Amber tegas, teks teks hitam/gelap pekat untuk kontras maksimal
        return "bg-amber-400 border border-amber-500 hover:bg-amber-500 text-black";

      case "done":
      case "selesai":
        // Latar belakang Hijau solid, komponen teks di dalamnya otomatis putih bersih
        return "bg-[#51a750] border border-[#449144] hover:bg-[#459144] text-white";

      default:
        return "bg-white border-2 border-gray-200 hover:bg-gray-50 text-gray-900";
    }
  };

  // Mengatur warna badge kecil status agar kontras dengan warna bodi kartu di belakangnya
  // const getBadgeStyle = (status) => {
  //   switch (status?.toLowerCase()) {
  //     case "received":
  //     case "pending":
  //     case "diterima":
  //       // Badge abu-abu di atas bodi putih
  //       return "bg-gray-800 text-white";
  //     case "processing":
  //     case "diproses":
  //       // Badge hitam pekat di atas bodi kuning amber agar terbaca jelas
  //       return "bg-black text-white";
  //     case "done":
  //     // Badge putih transparan/solid di atas bodi hijau
  //     case "selesai":
  //       return "bg-white text-[#51a750]";
  //     default:
  //       return "bg-gray-200 text-gray-800";
  //   }
  // };

  // Mengatur warna teks & badge kecil status di dalam kartu
  const getBadgeStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "received":
      case "pending":
      case "diterima":
        return "bg-gray-100 text-gray-600";
      case "processing":
      case "diproses":
        return "bg-amber-100 text-amber-700";
      case "done":
      case "selesai":
        return "bg-[#eef9f0] text-[#51a750]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusLabel = (status) => {
    switch (status?.toLowerCase()) {
      case "received":
        return "Diterima";
      case "processing":
        return "Diproses";
      case "done":
        return "Selesai";
      default:
        return status;
    }
  };

  const DocChartIcon = () => (
    <svg
      className="w-5 h-5 text-[#51a750]"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M12 8v4l3 3"
      />
    </svg>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f6faf7] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#51a750] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-medium text-sm animate-pulse">
            Menghubungkan & sinkronisasi data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6faf7] text-gray-800 flex flex-col">
      <Navbar variant="dashboard" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-10 py-8">
        {/* HEADER TITLE */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-black text-black">
            Dashboard Kamu
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Pantau perkembangan status laporan keluhan yang sudah Anda kirimkan.
          </p>
        </div>

        {/* STATS KARTU RINGKASAN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
          {/* Card Total */}
          <div className="bg-white border border-[#edf3ee] rounded-[28px] p-6 shadow-sm">
            <div className="w-11 h-11 bg-[#eef9f0] rounded-2xl flex items-center justify-center mb-4">
              <DocChartIcon />
            </div>
            <p className="text-sm text-gray-500">Total Laporan Kamu</p>
            <h2 className="text-3xl font-black mt-1 text-black">
              {totalComplaints}
            </h2>
          </div>

          {/* Card Proses */}
          <div className="bg-white border border-[#edf3ee] rounded-[28px] p-6 shadow-sm">
            <div className="w-11 h-11 bg-amber-50 rounded-2xl flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 text-amber-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">Sedang Diproses</p>
            <h2 className="text-3xl font-black mt-1 text-amber-600">
              {processedComplaints}
            </h2>
          </div>

          {/* Card Selesai */}
          <div className="bg-white border border-[#edf3ee] rounded-[28px] p-6 sm:col-span-2 xl:col-span-1 shadow-sm">
            <div className="w-11 h-11 bg-[#eef9f0] rounded-2xl flex items-center justify-center mb-4">
              <svg
                className="w-5 h-5 text-[#51a750]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <p className="text-sm text-gray-500">Laporan Selesai</p>
            <h2 className="text-3xl font-black mt-1 text-green-600">
              {resolvedComplaints}
            </h2>
          </div>
        </div>

        {/* UTILITY BUTTONS ACCENT */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center mb-8">
          <Link
            to={"/reports/add"}
            state={{ from: "/dashboard" }}
            className="w-full sm:w-auto"
          >
            <button className="w-full bg-[#51a750] hover:bg-[#459144] text-white px-6 py-3 rounded-full text-sm font-semibold transition shadow-sm whitespace-nowrap">
              + Buat Laporan Baru
            </button>
          </Link>

          <Link to={"/map-report"} className="w-full sm:w-auto">
            <button className="w-full bg-white hover:bg-gray-50 text-gray-700 border border-gray-200 px-6 py-3 rounded-full text-sm font-semibold transition shadow-sm whitespace-nowrap">
              Lihat Peta Heatmap
            </button>
          </Link>
        </div>

        {/* CONTAINER UTAMALIST REPORTS */}
        <div className="bg-white rounded-[30px] border border-[#edf3ee] p-5 sm:p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-black">
              Daftar Keluhan Anda
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Riwayat berkas laporan keluhan yang tersinkronisasi di Kota Batam.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {reports.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm border border-dashed border-gray-200 rounded-[24px]">
                Belum ada laporan keluhan yang Anda buat saat ini.
              </div>
            ) : (
              reports.map((report) => {
                // 1. Ambil style dinamis bodi kartu & badge status dari fungsi helper kamu
                const cardStyle = getCardStyle(report.status);
                const badgeStyle = getBadgeStyle(report.status);

                // 2. Cek status laporan saat ini untuk menentukan warna teks sekunder & tombol
                const isDone =
                  report.status?.toLowerCase() === "done" ||
                  report.status?.toLowerCase() === "selesai";
                const isProcessing =
                  report.status?.toLowerCase() === "processing" ||
                  report.status?.toLowerCase() === "diproses";

                // 3. Atur warna teks deskripsi (ID & Tanggal) agar tidak tenggelam di background pekat
                const textMetaColor = isDone
                  ? "text-green-100/90"
                  : isProcessing
                    ? "text-amber-950/70"
                    : "text-gray-400";

                // 4. Atur warna teks judul laporan
                const textTitleColor = isDone
                  ? "text-white"
                  : isProcessing
                    ? "text-black"
                    : "text-black";

                return (
                  <div
                    key={report.id}
                    className={`rounded-[24px] p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition-all duration-200 shadow-sm ${cardStyle}`}
                  >
                    <div className="flex items-start gap-4">
                      {/* Indikator Pin Lokasi */}
                      <div className="w-12 h-12 rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-xl shrink-0 mt-0.5 shadow-sm">
                        📍
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1.5">
                          {/* ID Laporan */}
                          <span
                            className={`text-xs font-bold ${textMetaColor}`}
                          >
                            #{report.id}
                          </span>

                          {/* Kategori Laporan */}
                          <span
                            className={`text-[11px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-wider border shadow-sm ${
                              isDone
                                ? "bg-green-600/30 border-green-400/20 text-white"
                                : isProcessing
                                  ? "bg-amber-500/20 border-amber-600/20 text-amber-950"
                                  : "bg-white/80 text-gray-700 border-gray-100"
                            }`}
                          >
                            {report.category}
                          </span>

                          {/* Badge Status */}
                          <span
                            className={`text-[11px] px-2.5 py-0.5 rounded-full font-black uppercase tracking-wide shadow-sm ${badgeStyle}`}
                          >
                            {getStatusLabel(report.status)}
                          </span>
                        </div>

                        {/* Judul Laporan */}
                        <h4
                          className={`text-base font-black mb-1 line-clamp-1 sm:max-w-[400px] md:max-w-[550px] ${textTitleColor}`}
                        >
                          {report.title}
                        </h4>

                        {/* Tanggal Dikirim */}
                        <p className={`text-xs font-medium ${textMetaColor}`}>
                          Dikirim pada:{" "}
                          {new Date(report.time_report).toLocaleDateString(
                            "id-ID",
                            { day: "numeric", month: "long", year: "numeric" },
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Tombol Aksi yang dinamis mengikuti warna latar belakang bodi kartu */}
                    <div className="flex items-center sm:justify-end shrink-0 w-full sm:w-auto">
                      <Link
                        to={`/reports/${report.id}`}
                        className={`w-full sm:w-auto text-center px-5 py-2.5 rounded-full text-sm font-black transition-all shadow-md border ${
                          isDone
                            ? "bg-white hover:bg-gray-100 text-[#51a750] border-transparent"
                            : isProcessing
                              ? "bg-black hover:bg-gray-900 text-white border-transparent"
                              : "bg-white hover:bg-black hover:text-white text-black border-gray-200"
                        }`}
                      >
                        Lihat Detail Laporan
                      </Link>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
