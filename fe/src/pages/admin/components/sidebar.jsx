import { Link } from "react-router-dom";

export default function Sidebar() {
  return (
    <>
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-[#e5f1e7] hidden lg:flex flex-col">
        <div className="px-8 pt-8 pb-6 border-b border-[#eef4ef]">
          <h1 className="text-2xl font-black text-[#51a750]">EnviroReport</h1>

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
                to="/admin/map_redzone"
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
    </>
  );
}
