

export default function AdminRedzonePage() {
  const redzones = [
    {
      area: "Bengkong",
      level: "High",
      reports: 124,
      issue: "Drainase & Sampah",
    },
    {
      area: "Batam Centre",
      level: "Medium",
      reports: 82,
      issue: "Sampah",
    },
    {
      area: "Sekupang",
      level: "Low",
      reports: 31,
      issue: "Jalan Rusak",
    },
    {
      area: "Tiban",
      level: "High",
      reports: 97,
      issue: "Genangan Air",
    },
  ];

  const getLevelStyle = (level) => {
    switch (level) {
      case "High":
        return "bg-red-100 text-red-700";

      case "Medium":
        return "bg-yellow-100 text-yellow-700";

      case "Low":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-[#f6faf7] min-h-screen lg:flex">
      {/* SIDEBAR */}

      {/* MAIN */}
      <main className="flex-1 overflow-y-auto">
        {/* TOPBAR */}
        <header className="px-4 sm:px-6 lg:px-10 py-5 flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-black">
              Peta Redzone
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Pantau area dengan tingkat laporan tertinggi di Kota Batam.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            {/* CUSTOM SELECT */}
            <div className="relative w-full sm:w-auto">
              <select
                className="appearance-none bg-white border border-gray-200 rounded-full px-5 py-3 pr-12 text-sm focus:outline-none w-full sm:w-auto">
                <option>7 Hari Terakhir</option>
                <option>30 Hari Terakhir</option>
                <option>1 Tahun</option>
              </select>

              {/* CUSTOM ARROW */}
              <span className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 text-xs">
                ▼
              </span>
            </div>

            <button className="bg-[#51a750] hover:bg-[#459144] text-white px-6 py-3 rounded-full text-sm font-semibold transition whitespace-nowrap">
              Export Map
            </button>
          </div>
        </header>

        <div className="px-4 sm:px-6 lg:px-10 pb-10">
          {/* SUMMARY */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
            <div className="bg-white rounded-[28px] border border-[#edf3ee] p-6">
              <p className="text-sm text-gray-500">
                Total Area Redzone
              </p>

              <h2 className="text-3xl font-black mt-2 text-black">
                12 Area
              </h2>
            </div>

            <div className="bg-white rounded-[28px] border border-[#edf3ee] p-6">
              <p className="text-sm text-gray-500">
                Area Risiko Tinggi
              </p>

              <h2 className="text-3xl font-black mt-2 text-red-600">
                4 Area
              </h2>
            </div>

            <div className="bg-white rounded-[28px] border border-[#edf3ee] p-6 sm:col-span-2 xl:col-span-1">
              <p className="text-sm text-gray-500">
                Total Laporan
              </p>

              <h2 className="text-3xl font-black mt-2 text-[#51a750]">
                2,318
              </h2>
            </div>
          </div>

          {/* MAP */}
          <div className="bg-white rounded-[30px] border border-[#edf3ee] p-4 sm:p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-black">
                  Heatmap Area Laporan
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Visualisasi area rawan laporan warga.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  High
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  Medium
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  Low
                </div>
              </div>
            </div>

            {/* MAP PLACEHOLDER */}
            <div className="relative h-[300px] sm:h-[400px] lg:h-[500px] rounded-[28px] overflow-hidden bg-gradient-to-br from-[#dff5e3] to-[#eef9f0] border border-[#e5f1e7]">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=1600&auto=format&fit=crop"
                alt="Map"
                className="w-full h-full object-cover opacity-40"
              />

              {/* HOTSPOTS */}
              <div className="absolute top-[25%] left-[40%]">
                <div className="w-8 h-8 rounded-full bg-red-500 animate-ping absolute" />

                <div className="relative w-8 h-8 rounded-full bg-red-600 border-4 border-white shadow-lg" />
              </div>

              <div className="absolute top-[45%] left-[60%]">
                <div className="w-6 h-6 rounded-full bg-yellow-400 animate-ping absolute" />

                <div className="relative w-6 h-6 rounded-full bg-yellow-500 border-4 border-white shadow-lg" />
              </div>

              <div className="absolute top-[60%] left-[30%]">
                <div className="w-5 h-5 rounded-full bg-green-500 animate-ping absolute" />

                <div className="relative w-5 h-5 rounded-full bg-green-600 border-4 border-white shadow-lg" />
              </div>

              {/* LABELS */}
              <div className="absolute top-[22%] left-[45%] bg-white px-3 py-2 rounded-xl shadow text-xs font-semibold">
                Bengkong
              </div>

              <div className="absolute top-[43%] left-[65%] bg-white px-3 py-2 rounded-xl shadow text-xs font-semibold">
                Batam Centre
              </div>

              <div className="absolute top-[58%] left-[35%] bg-white px-3 py-2 rounded-xl shadow text-xs font-semibold">
                Sekupang
              </div>
            </div>
          </div>

          {/* MOBILE CARD */}
          <div className="grid grid-cols-1 gap-4 lg:hidden mb-8">
            {redzones.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-[#edf3ee] rounded-[24px] p-5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-black text-base">
                      {item.area}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {item.issue}
                    </p>
                  </div>

                  <span
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold ${getLevelStyle(
                      item.level
                    )}`}
                  >
                    {item.level}
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">
                      Jumlah Laporan
                    </p>

                    <h4 className="text-xl font-black text-black mt-1">
                      {item.reports}
                    </h4>
                  </div>

                  <button className="bg-[#eef9f0] text-[#51a750] text-sm px-5 py-3 rounded-full font-semibold">
                    Detail
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden lg:block bg-white rounded-[30px] border border-[#edf3ee] p-6 overflow-hidden">
            <div className="mb-6">
              <h2 className="text-lg font-bold text-black">
                Detail Area Redzone
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Statistik laporan berdasarkan wilayah.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="text-left text-sm text-gray-400 border-b border-gray-100">
                    <th className="pb-4 font-medium">Wilayah</th>
                    <th className="pb-4 font-medium">
                      Tingkat Risiko
                    </th>
                    <th className="pb-4 font-medium">
                      Jumlah Laporan
                    </th>
                    <th className="pb-4 font-medium">
                      Masalah Dominan
                    </th>
                    <th className="pb-4 font-medium">Aksi</th>
                  </tr>
                </thead>

                <tbody>
                  {redzones.map((item, index) => (
                    <tr
                      key={index}
                      className="border-b border-gray-50 hover:bg-[#f8fcf8] transition"
                    >
                      <td className="py-5 font-semibold text-sm text-black">
                        {item.area}
                      </td>

                      <td>
                        <span
                          className={`text-xs px-3 py-1.5 rounded-full font-semibold ${getLevelStyle(
                            item.level
                          )}`}
                        >
                          {item.level}
                        </span>
                      </td>

                      <td className="text-sm text-gray-600">
                        {item.reports} laporan
                      </td>

                      <td className="text-sm text-gray-600">
                        {item.issue}
                      </td>

                      <td>
                        <button className="bg-[#eef9f0] text-[#51a750] text-xs px-4 py-2 rounded-full font-semibold hover:scale-105 transition">
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}