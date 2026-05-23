import { useEffect, useState } from "react";
import { reportService } from "../../../services/api";

// 1. WAJIB IMPORT KELOMPOK UTAMA DARI REACT-LEAFLET & LEAFLET MURNI
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet"; 
import "leaflet/dist/leaflet.css";

// Import aset gambar penanda (marker) default Leaflet
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix bug ikon Leaflet default yang sering hilang/error saat di-build oleh Vite/Webpack
let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function AdminRedzonePage() {
  const [reports, setReports] = useState([]);
  const [redzones, setRedzones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State Filter Waktu (Mock filter lokal berdasarkan data API)
  const [timeFilter, setTimeFilter] = useState("7 Hari Terakhir");

  // 2. DEKLARASI VARIABEL KOORDINAT YANG DIBUTUHKAN PETA
  const batamCenterCoordinates = [1.1278, 104.0526];

  const areaCoordinates = {
    "Bengkong": [1.1414, 104.0284],
    "Batam Centre": [1.1278, 104.0526],
    "Sekupang": [1.1224, 103.9482],
    "Tiban": [1.1112, 103.9712],
    "Batu Ampar": [1.1512, 104.0012],
    "Nongsa": [1.1611, 104.1012],
  };

  // --- 1. UTILITY: MEMETAKAN KOORDINAT API KE WILAYAH BATAM ---
  const getAreaFromCoordinates = (lat, lng) => {
    if (!lat || !lng) return "Batam Centre"; 

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);

    const areas = [
      { name: "Bengkong", lat: 1.1414, lng: 104.0284 },
      { name: "Batam Centre", lat: 1.1278, lng: 104.0526 },
      { name: "Sekupang", lat: 1.1224, lng: 103.9482 },
      { name: "Tiban", lat: 1.1112, lng: 103.9712 },
      { name: "Batu Ampar", lat: 1.1512, lng: 104.0012 },
      { name: "Nongsa", lat: 1.1611, lng: 104.1012 },
    ];

    let closestArea = areas[0];
    let minDistance = Infinity;

    areas.forEach((area) => {
      const distance = Math.sqrt(
        Math.pow(latitude - area.lat, 2) + Math.pow(longitude - area.lng, 2),
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestArea = area;
      }
    });

    return closestArea.name;
  };

  // --- 2. PEMETAAN KATEGORI KE BAHASA INDONESIA ---
  const getCategoryLabel = (category) => {
    if (!category) return "Laporan Umum";
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
        return "Pohon & Ruang Terbuka";
      default:
        return category
          .toLowerCase()
          .replace(/_/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
    }
  };

  // --- 3. AMBIL DATA DAN PROSES AGREGASI REDZONE ---
  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        setLoading(true);
        const response = await reportService.getAllReports();

        if (response && response.success) {
          const rawReports = response.data || [];
          setReports(rawReports);

          const groups = {};

          rawReports.forEach((report) => {
            const areaName = getAreaFromCoordinates(
              report.location?.latitude,
              report.location?.longitude,
            );

            if (!groups[areaName]) {
              groups[areaName] = {
                area: areaName,
                reportsCount: 0,
                categories: {},
              };
            }

            groups[areaName].reportsCount += 1;

            const catLabel = getCategoryLabel(report.category);
            groups[areaName].categories[catLabel] =
              (groups[areaName].categories[catLabel] || 0) + 1;
          });

          const processedZones = Object.values(groups).map((zone) => {
            let dominantIssue = "Umum";
            let maxCount = 0;
            Object.entries(zone.categories).forEach(([cat, count]) => {
              if (count > maxCount) {
                maxCount = count;
                dominantIssue = cat;
              }
            });

            let riskLevel = "Low";
            if (zone.reportsCount > 10) riskLevel = "High";
            else if (zone.reportsCount > 4) riskLevel = "Medium";

            return {
              area: zone.area,
              level: riskLevel,
              reports: zone.reportsCount,
              issue: dominantIssue,
            };
          });

          processedZones.sort((a, b) => b.reports - a.reports);
          setRedzones(processedZones);
        } else {
          throw new Error(response.message || "Gagal mengambil data laporan");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);

  // --- 4. KALKULASI RINGKASAN DINAMIS ---
  const totalAreaRedzone = redzones.length;
  const highRiskAreas = redzones.filter((z) => z.level === "High").length;
  const totalReportsCount = reports.length;

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
              Pantau area dengan tingkat laporan tertinggi di Kota Batam secara real-time.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full xl:w-auto">
            <div className="relative w-full sm:w-auto">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-full px-5 py-3 pr-12 text-sm focus:outline-none w-full sm:w-auto"
              >
                <option>7 Hari Terakhir</option>
                <option>30 Hari Terakhir</option>
                <option>1 Tahun</option>
              </select>
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
              <p className="text-sm text-gray-500">Total Area Terdeteksi</p>
              <h2 className="text-3xl font-black mt-2 text-black">
                {loading ? "..." : `${totalAreaRedzone} Area`}
              </h2>
            </div>

            <div className="bg-white rounded-[28px] border border-[#edf3ee] p-6">
              <p className="text-sm text-gray-500">Area Risiko Tinggi</p>
              <h2 className="text-3xl font-black mt-2 text-red-600">
                {loading ? "..." : `${highRiskAreas} Area`}
              </h2>
            </div>

            <div className="bg-white rounded-[28px] border border-[#edf3ee] p-6 sm:col-span-2 xl:col-span-1">
              <p className="text-sm text-gray-500">Total Semua Laporan</p>
              <h2 className="text-3xl font-black mt-2 text-[#51a750]">
                {loading ? "..." : totalReportsCount.toLocaleString("id-ID")}
              </h2>
            </div>
          </div>

          {/* MAP */}
          <div className="bg-white rounded-[30px] border border-[#edf3ee] p-4 sm:p-6 mb-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
              <div>
                <h2 className="text-lg font-bold text-black">
                  Peta Distribusi Redzone Interaktif
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Klik titik marker untuk melihat statistik masalah dominan di wilayah tersebut.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs">
                <div className="flex items-center gap-2 text-black">
                  <div className="w-3 h-3 rounded-full bg-red-500" /> High (&gt;10 Laporan)
                </div>
                <div className="flex items-center gap-2 text-black">
                  <div className="w-3 h-3 rounded-full bg-yellow-400" /> Medium (5-10 Laporan)
                </div>
                <div className="flex items-center gap-2 text-black">
                  <div className="w-3 h-3 rounded-full bg-green-500" /> Low (&lt;5 Laporan)
                </div>
              </div>
            </div>

            {/* === IMPLEMENTASI REACT LEAFLET MAP === */}
            <div className="h-[300px] sm:h-[400px] lg:h-[500px] rounded-[28px] overflow-hidden border border-[#e5f1e7] relative z-10">
              <MapContainer
                center={batamCenterCoordinates}
                zoom={12}
                scrollWheelZoom={true}
                className="w-full h-full"
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {!loading && !error && redzones.map((zone, idx) => {
                  const coords = areaCoordinates[zone.area] || batamCenterCoordinates;

                  return (
                    <Marker key={idx} position={coords}>
                      <Popup>
                        <div className="p-1 font-sans text-black">
                          <h4 className="font-bold text-sm border-b pb-1 mb-1">
                            {zone.area}
                          </h4>
                          <p className="text-xs text-gray-600 m-0">
                            Tingkat Risiko: <span className="font-semibold">{zone.level}</span>
                          </p>
                          <p className="text-xs text-gray-600 m-0">
                            Total Laporan: <span className="font-semibold text-green-600">{zone.reports}</span>
                          </p>
                          <p className="text-xs text-gray-600 m-0">
                            Masalah Utama: <span className="font-semibold text-red-500">{zone.issue}</span>
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  );
                })}
              </MapContainer>
            </div>
          </div>

          {/* LOGIKA LOADING & ERROR UTILITY */}
          {loading && (
            <div className="text-center py-10 text-gray-500 text-sm animate-pulse">
              Mengambil statistik geospasial database...
            </div>
          )}

          {error && (
            <div className="text-center py-6 text-red-500 text-sm bg-red-50 border border-red-100 rounded-2xl">
              ⚠️ Gagal sinkronisasi peta: {error}
            </div>
          )}

          {/* MOBILE CARD VIEW */}
          {!loading && !error && (
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
                        Masalah: {item.issue}
                      </p>
                    </div>

                    <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${getLevelStyle(item.level)}`}>
                      {item.level === "High" ? "Risiko Tinggi" : item.level === "Medium" ? "Risiko Sedang" : "Risiko Rendah"}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Jumlah Laporan</p>
                      <h4 className="text-xl font-black text-black mt-1">
                        {item.reports} Laporan
                      </h4>
                    </div>

                    <button className="bg-[#eef9f0] text-[#51a750] text-sm px-5 py-3 rounded-full font-semibold">
                      Detail
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* DESKTOP TABLE VIEW */}
          {!loading && !error && (
            <div className="hidden lg:block bg-white rounded-[30px] border border-[#edf3ee] p-6 overflow-hidden">
              <div className="mb-6">
                <h2 className="text-lg font-bold text-black">
                  Detail Area Redzone
                </h2>
                <p className="text-sm text-gray-500 mt-1">
                  Statistik akumulasi laporan aktif berdasarkan wilayah administratif terdekat.
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[800px]">
                  <thead>
                    <tr className="text-left text-sm text-gray-400 border-b border-gray-100">
                      <th className="pb-4 font-medium">Wilayah</th>
                      <th className="pb-4 font-medium">Tingkat Risiko</th>
                      <th className="pb-4 font-medium">Jumlah Laporan</th>
                      <th className="pb-4 font-medium">Masalah Dominan</th>
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
                          <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ${getLevelStyle(item.level)}`}>
                            {item.level === "High" ? "Risiko Tinggi" : item.level === "Medium" ? "Risiko Sedang" : "Risiko Rendah"}
                          </span>
                        </td>

                        <td className="text-sm text-gray-600">
                          {item.reports} laporan aktif
                        </td>

                        <td className="text-sm text-gray-600">{item.issue}</td>

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
          )}
        </div>
      </main>
    </div>
  );
}