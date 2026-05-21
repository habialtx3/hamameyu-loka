import { Link } from "react-router-dom";
import Navbar from "../../../components/navbar";
import { useEffect, useState } from "react";

export default function UserDashboardPage() {
const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 2. Tambahkan fungsi fetch untuk mengambil data
  useEffect(() => {
    fetch('http://localhost:5000/api/reports', {
      method: 'GET',
      headers: {
        'x-user-id': '1' // Menyertakan Mock User ID sesuai dokumentasi backend kamu
      }
    })
      .then((res) => res.json())
      .then((responseJson) => {
        if (responseJson.success) {
          // Kamu bisa filter hanya report milik user_id 1 jika ini dashboard personal resident
          const myReports = responseJson.data.filter(item => item.user_id === 1);
          setReports(myReports);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Gagal mengambil data:', error);
        setIsLoading(false);
      });
  }, []);

  // Hitung data statistik secara dinamis berdasarkan data backend
  const totalComplaints = reports.length;
  const resolvedComplaints = reports.filter(r => r.status === 'done').length;

  const DocChartIcon = () => (
    <svg
      className="w-5 h-5 text-gray-400"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
        d="M12 8v4l3 3"
      />
    </svg>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center">
        <p className="text-gray-500 font-medium animate-pulse">Memuat data laporan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-800 flex flex-col">

      <Navbar variant="dashboard" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 py-5 sm:py-6 md:py-8">

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* CARD 1 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[170px] shadow-sm">
            <div className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center mb-4">
              <DocChartIcon />
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-2">Total Laporan Kamu</p>
              <div className="flex justify-between items-end gap-3">
                <h3 className="text-2xl sm:text-3xl font-semibold text-black">
                  {totalComplaints} {/* Dinamis */}
                </h3>
              </div>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[170px] shadow-sm">
            <div className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center mb-4">
              <DocChartIcon />
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-2">Laporan Selesai</p>
              <div className="flex justify-between items-end gap-3">
                <h3 className="text-2xl sm:text-3xl font-semibold text-black">
                  {resolvedComplaints} {/* Dinamis */}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 mb-8">
          <Link to={"/reports/add"} state={{ from: "/dashboard" }} className="w-full sm:w-auto">
            <button className="w-full border border-gray-400 text-gray-500 hover:text-black hover:border-black rounded-full px-6 sm:px-8 py-3 text-sm sm:text-base font-medium transition bg-white shadow-sm">
              Make New Report
            </button>
          </Link>

          <Link to={"/map-report"} className="w-full sm:w-auto">
            <button className="w-full border border-gray-400 text-gray-500 hover:text-black hover:border-black rounded-full px-6 py-3 text-sm font-medium transition bg-white shadow-sm">
              View Heatmap Overview
            </button>
          </Link>
        </div>

        {/* LIST REPORTS */}
        <div>
          <h3 className="font-semibold text-black mb-4 px-1 sm:px-2">
            Daftar Keluhan ({reports.length})
          </h3>

          <div className="bg-white border border-gray-200 rounded-[2rem] p-3 sm:p-4 md:p-6 shadow-sm flex flex-col gap-4">
            
            {/* 3. Looping data menggunakan .map() */}
            {reports.length === 0 ? (
              <p className="text-gray-400 text-center py-6">Belum ada laporan yang dibuat.</p>
            ) : (
              reports.map((report) => {
                // Berikan warna background conditional sesuai status laporan
                const isProcessing = report.status === 'processing';
                const isDone = report.status === 'done';

                let bgClass = "bg-white hover:bg-gray-50 border border-gray-100";
                if (isProcessing) bgClass = "bg-yellow-200 border border-yellow-200";
                if (isDone) bgClass = "bg-green-300 border border-green-200";

                return (
                  <div key={report.id} className={`rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition shadow-sm ${bgClass}`}>
                    <div>
                      <p className="text-gray-600 text-xs sm:text-sm mb-1">
                        #{report.id} - {report.category.toUpperCase()} ({report.status})
                      </p>
                      <h4 className="text-lg sm:text-xl font-semibold text-black mb-1">
                        {report.title}
                      </h4>
                      <p className="text-xs text-gray-400">
                        {new Date(report.time_report).toLocaleDateString('id-ID')}
                      </p>
                    </div>

                    {/* Mengarah ke id report dinamis sesuai dengan database */}
                    <Link
                      to={`/reports/${report.id}`}
                      className="w-full sm:w-auto border border-black rounded-full px-4 py-2 text-sm font-medium flex items-center justify-center gap-1 hover:bg-black hover:text-white transition text-black"
                    >
                      <span className="text-lg leading-none mb-1">↑</span>
                      View
                    </Link>
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