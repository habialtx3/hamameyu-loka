import { Link } from "react-router-dom";

export default function AdminDashboardPageCoba() {
  const stats = [
    {
      title: "Total Laporan",
      value: "7,265",
      growth: "+11.01%",
      icon: "📄",
      bg: "bg-[#eef9f0]",
      border: "border-[#d8f0dc]",
      text: "text-green-700",
    },
    {
      title: "Menunggu Verifikasi",
      value: "3,671",
      growth: "+4.02%",
      icon: "⏳",
      bg: "bg-[#fff8e8]",
      border: "border-[#f7e3a1]",
      text: "text-yellow-700",
    },
    {
      title: "Sedang Diproses",
      value: "156",
      growth: "-1.12%",
      icon: "🛠",
      bg: "bg-[#eef5ff]",
      border: "border-[#d8e7ff]",
      text: "text-blue-700",
    },
    {
      title: "Selesai",
      value: "2,318",
      growth: "+6.08%",
      icon: "✅",
      bg: "bg-[#edfdf1]",
      border: "border-[#c9f3d3]",
      text: "text-green-700",
    },
  ];

  const reports = [
    {
      name: "Tumpukan Sampah",
      location: "Batam Centre",
      category: "Waste",
      status: "Diterima",
    },
    {
      name: "Drainase Tersumbat",
      location: "Bengkong",
      category: "Drainage",
      status: "Diproses",
    },
    {
      name: "Jalan Rusak",
      location: "Sekupang",
      category: "Facility",
      status: "Selesai",
    },
    {
      name: "Genangan Air",
      location: "Tiban",
      category: "Flood",
      status: "Diproses",
    },
  ];

  const getStatusStyle = (status) => {
    switch (status) {
      case "Diterima":
        return "bg-gray-100 text-gray-600";
      case "Diproses":
        return "bg-yellow-100 text-yellow-700";
      case "Selesai":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-[#f6faf7] min-h-screen flex overflow-hidden">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-[#e5f1e7] hidden lg:flex flex-col">
        <div className="px-8 pt-8 pb-6 border-b border-[#eef4ef]">
          <h1 className="text-2xl font-black text-[#51a750]">
            EnviroReport
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Smart Environmental Monitoring
          </p>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="mb-8">
            <p className="text-xs font-bold text-gray-400 uppercase px-4 mb-3">
              Dashboard
            </p>

            <div className="space-y-2">
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#eef9f0] text-[#51a750] font-semibold"
              >
                <span>📊</span>
                Overview
              </Link>

              <Link
                to="/admin/reports"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-[#f5faf6] transition"
              >
                <span>📄</span>
                Semua Laporan
              </Link>

              <Link
                to="/admin/redzone"
                className="flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-[#f5faf6] transition"
              >
                <span>🗺</span>
                Peta Redzone
              </Link>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold text-gray-400 uppercase px-4 mb-3">
              Management
            </p>

            <div className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-[#f5faf6] transition text-left">
                <span>👥</span>
                Kelola Warga
              </button>

              <button className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-600 hover:bg-[#f5faf6] transition text-left">
                <span>🤖</span>
                Pengaturan AI
              </button>
            </div>
          </div>
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto">
        {/* TOPBAR */}
        <header className="px-6 lg:px-10 py-5 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-black text-black">
              Dashboard Overview
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Monitor laporan lingkungan Kota Batam secara real-time.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Cari laporan..."
                className="w-72 bg-white border border-gray-200 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#51a750]/20"
              />
            </div>

            <img
              src="https://placehold.co/44x44/e2f5e8/51a750?text=A"
              alt="Admin"
              className="w-11 h-11 rounded-full"
            />
          </div>
        </header>

        <div className="px-6 lg:px-10 pb-10">
          {/* HERO */}
          <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-r from-[#51a750] to-[#7bc96f] p-8 lg:p-10 text-white mb-8">
            <div className="max-w-2xl relative z-10">
              <span className="uppercase tracking-widest text-xs font-semibold text-white/80">
                Admin Insight
              </span>

              <h2 className="text-3xl lg:text-4xl font-black leading-tight mt-3 mb-4">
                124 laporan baru masuk hari ini.
              </h2>

              <p className="text-sm lg:text-base text-white/90 leading-relaxed">
                Area Bengkong dan Batam Centre mengalami peningkatan
                laporan drainase dan sampah dalam 24 jam terakhir.
              </p>

              <button className="mt-6 bg-white text-[#51a750] font-semibold px-6 py-3 rounded-full hover:scale-105 transition">
                Lihat Detail Laporan
              </button>
            </div>

            <div className="absolute right-0 bottom-0 opacity-10 text-[220px] font-black">
              🌱
            </div>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
            {stats.map((item, index) => (
              <div
                key={index}
                className={`${item.bg} ${item.border} border rounded-[28px] p-6 shadow-sm hover:shadow-md transition`}
              >
                <div className="flex justify-between items-start mb-5">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-xl shadow-sm">
                    {item.icon}
                  </div>

                  <span className={`text-xs font-semibold ${item.text}`}>
                    {item.growth}
                  </span>
                </div>

                <h3 className="text-3xl font-black text-black mb-1">
                  {item.value}
                </h3>

                <p className="text-sm text-gray-600">{item.title}</p>
              </div>
            ))}
          </div>

          {/* CHARTS */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
            {/* MAIN CHART */}
            <div className="xl:col-span-2 bg-white rounded-[30px] border border-[#edf3ee] p-6">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-lg font-bold text-black">
                    Tren Laporan Warga
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Statistik laporan 7 hari terakhir
                  </p>
                </div>

                <button className="text-sm bg-[#f5faf6] px-4 py-2 rounded-full text-gray-600">
                  Monthly
                </button>
              </div>

              <div className="h-72 flex items-end gap-4">
                {[40, 70, 55, 90, 65, 110, 85].map((height, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center gap-3"
                  >
                    <div
                      className="w-full bg-gradient-to-t from-[#51a750] to-[#9ddc9b] rounded-t-3xl"
                      style={{ height: `${height * 2}px` }}
                    />

                    <span className="text-xs text-gray-400">
                      {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"][index]}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* CATEGORY */}
            <div className="bg-white rounded-[30px] border border-[#edf3ee] p-6">
              <h2 className="text-lg font-bold text-black mb-6">
                Kategori Laporan
              </h2>

              <div className="space-y-5">
                {[
                  ["Waste", "75%"],
                  ["Flood", "56%"],
                  ["Drainage", "40%"],
                  ["Facility", "82%"],
                  ["Water", "30%"],
                ].map((item, index) => (
                  <div key={index}>
                    <div className="flex justify-between mb-2 text-sm">
                      <span className="font-medium text-gray-700">
                        {item[0]}
                      </span>

                      <span className="text-gray-500">{item[1]}</span>
                    </div>

                    <div className="h-3 bg-[#edf5ef] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#51a750] to-[#7bc96f] rounded-full"
                        style={{ width: item[1] }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* TABLE + NOTIFICATION */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* TABLE */}
            <div className="xl:col-span-2 bg-white rounded-[30px] border border-[#edf3ee] p-6 overflow-hidden">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-lg font-bold text-black">
                    Recent Reports
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Laporan terbaru warga
                  </p>
                </div>

                <Link
                  to="/admin/reports"
                  className="text-sm text-[#51a750] font-semibold"
                >
                  Lihat Semua
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="text-left text-sm text-gray-400 border-b border-gray-100">
                      <th className="pb-4 font-medium">Laporan</th>
                      <th className="pb-4 font-medium">Lokasi</th>
                      <th className="pb-4 font-medium">Kategori</th>
                      <th className="pb-4 font-medium">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {reports.map((item, index) => (
                      <tr
                        key={index}
                        className="border-b border-gray-50 hover:bg-[#f8fcf8] transition"
                      >
                        <td className="py-5">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-11 rounded-2xl bg-[#eef9f0] flex items-center justify-center">
                              📍
                            </div>

                            <div>
                              <p className="font-semibold text-sm text-black">
                                {item.name}
                              </p>

                              <span className="text-xs text-gray-400">
                                #ER-2026-{index + 100}
                              </span>
                            </div>
                          </div>
                        </td>

                        <td className="text-sm text-gray-600">
                          {item.location}
                        </td>

                        <td>
                          <span className="bg-[#eef9f0] text-[#51a750] text-xs px-3 py-1 rounded-full font-medium">
                            {item.category}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`text-xs px-3 py-1.5 rounded-full font-semibold ${getStatusStyle(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* NOTIFICATION */}
            <div className="bg-white rounded-[30px] border border-[#edf3ee] p-6">
              <h2 className="text-lg font-bold text-black mb-6">
                Aktivitas Terbaru
              </h2>

              <div className="space-y-5">
                {[
                  "Laporan sampah baru di Batam Centre",
                  "Drainase Bengkong sedang diproses",
                  "Laporan jalan rusak berhasil diselesaikan",
                  "AI mendeteksi 2 laporan duplikat",
                ].map((item, index) => (
                  <div
                    key={index}
                    className="flex gap-4 items-start pb-5 border-b border-gray-50 last:border-none"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-[#eef9f0] flex items-center justify-center">
                      🔔
                    </div>

                    <div className="flex-1">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {item}
                      </p>

                      <span className="text-xs text-gray-400 mt-1 block">
                        Just now
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}