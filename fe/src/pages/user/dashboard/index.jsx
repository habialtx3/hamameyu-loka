export default function UserDashboardPage() {
  // SVG Icon untuk Dokumen/Chart di dalam Card
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

  return (
    <div className="min-h-screen bg-[#fafafa] text-gray-800 flex flex-col">
      <header className="border-b border-gray-200 bg-white px-8 py-5 flex items-center text-gray-600">
        <svg
          className="w-5 h-5 mr-3"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
          />
        </svg>
        <span className="font-medium text-gray-700">Home</span>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between h-40 shadow-sm">
            <div className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center mb-4">
              <DocChartIcon />
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-2">
                Total Complaints ( Weekly )
              </p>
              <div className="flex justify-between items-end">
                <h3 className="text-3xl font-semibold text-black">258</h3>
                <span className="border border-black rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
                  ↑ 20% More
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between h-40 shadow-sm">
            <div className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center mb-4">
              <DocChartIcon />
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-2">
                Complaints Resolved ( This Week )
              </p>
              <div className="flex justify-between items-end">
                <h3 className="text-3xl font-semibold text-black">157</h3>
                <span className="border border-black rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
                  ↑ 20% More
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl p-6 flex flex-col justify-between h-40 shadow-sm">
            <div className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center mb-4">
              <DocChartIcon />
            </div>
            <div>
              <p className="text-gray-600 text-sm mb-2">
                Total Complaints ( Monthly )
              </p>
              <div className="flex justify-between items-end">
                <h3 className="text-3xl font-semibold text-black">258</h3>
                <span className="border border-black rounded-full px-3 py-1 text-xs font-medium flex items-center gap-1">
                  ↑ 20% More
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 mb-2"></div>
        <div className="flex justify-between mb-8">
          <button className="border border-gray-400 text-gray-500 hover:text-black hover:border-black rounded-full px-8 py-3 text-base font-medium transition bg-white shadow-sm">
            Make New Report
          </button>
          <button className="border border-gray-400 text-gray-500 hover:text-black hover:border-black rounded-full px-6 py-3 text-sm font-medium transition bg-white shadow-sm">
            View Heatmap Overview
          </button>
        </div>

        <div>
          <h3 className="font-semibold text-black mb-4 px-2">Complaint No.</h3>

          <div className="bg-white border border-gray-200 rounded-[2rem] p-4 md:p-6 shadow-sm flex flex-col gap-4">
            <div className="rounded-2xl p-5 flex justify-between items-center transition hover:bg-gray-50 border border-transparent">
              <div>
                <p className="text-gray-600 text-sm mb-1">
                  #1B03032026 (Pengerjaan)
                </p>
                <h4 className="text-xl font-semibold text-black">03/03/2026</h4>
              </div>
              <button className="border border-black rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-1 hover:bg-gray-100 transition">
                <span className="text-lg leading-none mb-1">↑</span> View
              </button>
            </div>

            <div className="bg-[#facc15] rounded-2xl p-5 flex justify-between items-center shadow-sm">
              <div>
                <p className="text-gray-800 text-sm mb-1">
                  #2S08042026 (Ditinjau)
                </p>
                <h4 className="text-xl font-semibold text-black">08/04/2026</h4>
              </div>
              <button className="border border-black rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-1 hover:bg-yellow-500 transition text-black">
                <span className="text-lg leading-none mb-1">↑</span> View
              </button>
            </div>

            <div className="bg-[#22c55e] rounded-2xl p-5 flex justify-between items-center shadow-sm">
              <div>
                <p className="text-gray-900 text-sm mb-1">
                  #12F12022026 (Selesai)
                </p>
                <h4 className="text-xl font-semibold text-black">12/02/2026</h4>
              </div>
              <button className="border border-black rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-1 hover:bg-green-600 transition text-black">
                <span className="text-lg leading-none mb-1">↑</span> View
              </button>
            </div>

            <div className="rounded-2xl p-5 flex justify-between items-center transition hover:bg-gray-50 border border-transparent">
              <div>
                <p className="text-gray-600 text-sm mb-1">
                  #11A19012026 (Terkirim)
                </p>
                <h4 className="text-xl font-semibold text-black">19/01/2026</h4>
              </div>
              <button className="border border-black rounded-full px-4 py-1.5 text-sm font-medium flex items-center gap-1 hover:bg-gray-100 transition">
                <span className="text-lg leading-none mb-1">↑</span> view
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
