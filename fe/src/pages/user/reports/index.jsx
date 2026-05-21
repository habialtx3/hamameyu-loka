// export default function ReportPage() {
//   return (
//     <>
//     <div>Reports Page Coming Soon</div>
//     </>
//     )
// }

import { Link } from "react-router-dom";
import { useState } from "react";
import Navbar from "../../../components/navbar";

export default function UserReportsPage() {
  const [search, setSearch] = useState("");

  const reports = [
    {
      id: "1B03032026",
      title: "Drainase Batam Centre Meluap",
      status: "Pengerjaan",
      date: "03 Maret 2026",
      description:
        "Drainase di area Batam Centre sering meluap saat hujan deras dan menyebabkan banjir hingga kendaraan mogok.",
    },
    {
      id: "2S08042026",
      title: "Lampu Jalan Mati",
      status: "Ditinjau",
      date: "08 April 2026",
      description:
        "Beberapa lampu jalan di kawasan utama sudah mati selama beberapa hari dan cukup membahayakan pengendara malam.",
    },
    {
      id: "12F12022026",
      title: "Tumpukan Sampah Liar",
      status: "Selesai",
      date: "12 Februari 2026",
      description:
        "Terdapat tumpukan sampah liar di pinggir jalan yang menyebabkan bau menyengat dan mengganggu warga sekitar.",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Pengerjaan":
        return "bg-blue-100 text-blue-700";

      case "Ditinjau":
        return "bg-yellow-100 text-yellow-700";

      case "Selesai":
        return "bg-green-100 text-green-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // FILTER SEARCH
  const filteredReports = reports.filter((report) =>
    report.title.toLowerCase().includes(search.toLowerCase()) ||
    report.id.toLowerCase().includes(search.toLowerCase()) ||
    report.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f7f7f7]">
      <Navbar variant="dashboard" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 md:py-10">

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8 md:mb-10">
          
          {/* LEFT */}
          <div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black">
              My Reports
            </h1>

            <p className="text-sm sm:text-base text-gray-500 mt-2 max-w-2xl">
              View all reports and complaint history submitted by you.
            </p>
          </div>

          {/* SEARCH */}
          <div className="w-full lg:max-w-md">
            <div className="relative">
              
              {/* ICON */}
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

              {/* INPUT */}
              <input
                type="text"
                placeholder="Search report..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="
                  w-full
                  bg-white
                  border border-gray-200
                  rounded-2xl
                  py-3 sm:py-4
                  pl-12
                  pr-4
                  text-sm sm:text-base
                  outline-none
                  focus:ring-2
                  focus:ring-black/10
                  focus:border-black
                  transition
                "
              />
            </div>
          </div>
        </div>

        {/* REPORT LIST */}
        <div className="space-y-4 sm:space-y-5 md:space-y-6">
          
          {filteredReports.length > 0 ? (
            filteredReports.map((report) => (
              <div
                key={report.id}
                className="
                  bg-white
                  border border-gray-200
                  rounded-[24px]
                  sm:rounded-[28px]
                  p-4 sm:p-5 md:p-6
                  shadow-sm
                  hover:shadow-md
                  transition
                "
              >
                <div
                  className="
                    flex flex-col
                    lg:flex-row
                    lg:items-center
                    lg:justify-between
                    gap-5
                  "
                >

                  {/* LEFT CONTENT */}
                  <div className="flex-1 min-w-0">

                    {/* TOP INFO */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-3">
                      <span
                        className={`
                          px-3 sm:px-4
                          py-1
                          rounded-full
                          text-xs sm:text-sm
                          font-medium
                          ${getStatusColor(report.status)}
                        `}
                      >
                        {report.status}
                      </span>

                      <p className="text-xs sm:text-sm text-gray-400 break-all">
                        #{report.id}
                      </p>
                    </div>

                    {/* TITLE */}
                    <h2
                      className="
                        text-xl
                        sm:text-2xl
                        md:text-3xl
                        font-bold
                        text-black
                        leading-tight
                        mb-3
                      "
                    >
                      {report.title}
                    </h2>

                    {/* DESCRIPTION */}
                    <p
                      className="
                        text-sm
                        sm:text-base
                        text-gray-600
                        leading-relaxed
                        line-clamp-3
                      "
                    >
                      {report.description}
                    </p>

                    {/* DATE */}
                    <p
                      className="
                        text-xs
                        sm:text-sm
                        text-gray-400
                        mt-4
                      "
                    >
                      {report.date}
                    </p>
                  </div>

                  {/* BUTTON */}
                  <div
                    className="
                      w-full
                      lg:w-auto
                      flex
                      justify-end
                      items-center
                    "
                  >
                    <Link
  to={`/reports/${report.id}`}
  state={{ from: "/reports" }}

                      className="w-full sm:w-auto"
                    >
                      <button
                        className="
                          w-full sm:w-auto
                          rounded-full
                          border border-black
                          px-5 sm:px-6
                          py-3
                          text-sm sm:text-base
                          font-medium
                          hover:bg-black
                          hover:text-white
                          transition
                        "
                      >
                        See More <span>→</span>
                      </button>
                    </Link>
                  </div>

                </div>
              </div>
            ))
          ) : (
            // EMPTY STATE
            <div className="bg-white border border-gray-200 rounded-[28px] p-10 text-center">
              <h3 className="text-xl font-semibold text-black mb-2">
                No Reports Found
              </h3>

              <p className="text-gray-500 text-sm sm:text-base">
                Try searching with another keyword.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}