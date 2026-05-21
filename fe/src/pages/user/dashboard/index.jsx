import { Link } from "react-router-dom";
import Navbar from "../../../components/navbar";

export default function UserDashboardPage() {

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

      <Navbar variant="dashboard" />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 md:px-8 py-5 sm:py-6 md:py-8">

        {/* STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">

          {/* CARD */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[170px] shadow-sm">

            <div className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center mb-4">
              <DocChartIcon />
            </div>

            <div>
              <p className="text-gray-600 text-sm mb-2">
                Total Complaints ( Weekly )
              </p>

              <div className="flex justify-between items-end gap-3">
                <h3 className="text-2xl sm:text-3xl font-semibold text-black">
                  258
                </h3>

                <span className="border border-black rounded-full px-3 py-1 text-[10px] sm:text-xs font-medium flex items-center gap-1 whitespace-nowrap">
                  ↑ 20% More
                </span>
              </div>
            </div>
          </div>

          {/* CARD */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[170px] shadow-sm">

            <div className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center mb-4">
              <DocChartIcon />
            </div>

            <div>
              <p className="text-gray-600 text-sm mb-2">
                Complaints Resolved ( This Week )
              </p>

              <div className="flex justify-between items-end gap-3">
                <h3 className="text-2xl sm:text-3xl font-semibold text-black">
                  157
                </h3>

                <span className="border border-black rounded-full px-3 py-1 text-[10px] sm:text-xs font-medium flex items-center gap-1 whitespace-nowrap">
                  ↑ 20% More
                </span>
              </div>
            </div>
          </div>

          {/* CARD */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6 flex flex-col justify-between min-h-[170px] shadow-sm sm:col-span-2 xl:col-span-1">

            <div className="w-10 h-10 border border-gray-200 rounded-lg flex items-center justify-center mb-4">
              <DocChartIcon />
            </div>

            <div>
              <p className="text-gray-600 text-sm mb-2">
                Total Complaints ( Monthly )
              </p>

              <div className="flex justify-between items-end gap-3">
                <h3 className="text-2xl sm:text-3xl font-semibold text-black">
                  258
                </h3>

                <span className="border border-black rounded-full px-3 py-1 text-[10px] sm:text-xs font-medium flex items-center gap-1 whitespace-nowrap">
                  ↑ 20% More
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* BUTTONS */}
        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6 mb-8">

          <Link
            to={"/reports/add"}
            state={{ from: "/dashboard" }}
            className="w-full sm:w-auto"
          >
            <button className="w-full border border-gray-400 text-gray-500 hover:text-black hover:border-black rounded-full px-6 sm:px-8 py-3 text-sm sm:text-base font-medium transition bg-white shadow-sm">
              Make New Report
            </button>
          </Link>

          <Link
            to={"/map-report"}
            className="w-full sm:w-auto"
          >
            <button className="w-full border border-gray-400 text-gray-500 hover:text-black hover:border-black rounded-full px-6 py-3 text-sm font-medium transition bg-white shadow-sm">
              View Heatmap Overview
            </button>
          </Link>
        </div>

        {/* LIST */}
        <div>

          <h3 className="font-semibold text-black mb-4 px-1 sm:px-2">
            Complaint No.
          </h3>

          <div className="bg-white border border-gray-200 rounded-[2rem] p-3 sm:p-4 md:p-6 shadow-sm flex flex-col gap-4">

            {/* ITEM */}
            <div className="rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition hover:bg-gray-50 border border-transparent">

              <div>
                <p className="text-gray-600 text-xs sm:text-sm mb-1">
                  #1B03032026 (Pengerjaan)
                </p>

                <h4 className="text-lg sm:text-xl font-semibold text-black">
                  03/03/2026
                </h4>
              </div>

              <Link
                to="/reports/1B03032026"
                className="w-full sm:w-auto border border-black rounded-full px-4 py-2 text-sm font-medium flex items-center justify-center gap-1 hover:bg-gray-100 transition"
              >
                <span className="text-lg leading-none mb-1">↑</span>
                View
              </Link>
            </div>

            {/* ITEM */}
            <div className="bg-[#facc15] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm">

              <div>
                <p className="text-gray-800 text-xs sm:text-sm mb-1">
                  #2S08042026 (Ditinjau)
                </p>

                <h4 className="text-lg sm:text-xl font-semibold text-black">
                  08/04/2026
                </h4>
              </div>

              <Link
                to="/reports/2S08042026"
                className="w-full sm:w-auto border border-black rounded-full px-4 py-2 text-sm font-medium flex items-center justify-center gap-1 hover:bg-yellow-500 transition text-black"
              >
                <span className="text-lg leading-none mb-1">↑</span>
                View
              </Link>
            </div>

            {/* ITEM */}
            <div className="bg-[#22c55e] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm">

              <div>
                <p className="text-gray-900 text-xs sm:text-sm mb-1">
                  #12F12022026 (Selesai)
                </p>

                <h4 className="text-lg sm:text-xl font-semibold text-black">
                  12/02/2026
                </h4>
              </div>

              <Link
                to="/reports/12F12022026"
                className="w-full sm:w-auto border border-black rounded-full px-4 py-2 text-sm font-medium flex items-center justify-center gap-1 hover:bg-green-600 transition text-black"
              >
                <span className="text-lg leading-none mb-1">↑</span>
                View
              </Link>
            </div>

            {/* ITEM */}
            <div className="rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row justify-between sm:items-center gap-4 transition hover:bg-gray-50 border border-transparent">

              <div>
                <p className="text-gray-600 text-xs sm:text-sm mb-1">
                  #11A19012026 (Terkirim)
                </p>

                <h4 className="text-lg sm:text-xl font-semibold text-black">
                  19/01/2026
                </h4>
              </div>

              <Link
                to="/reports/11A19012026"
                className="w-full sm:w-auto border border-black rounded-full px-4 py-2 text-sm font-medium flex items-center justify-center gap-1 hover:bg-gray-100 transition"
              >
                <span className="text-lg leading-none mb-1">↑</span>
                View
              </Link>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}