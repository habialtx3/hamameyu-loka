export default function App() {
  return (
    <>
      <div className="bg-gradient-to-b from-[#e3fae8] to-[#edfcf0] min-h-screen flex flex-col relative overflow-hidden">
        <nav className="flex items-center justify-between px-6 py-4 lg:px-12">
          <div className="flex items-center gap-8">
            <a
              href="#"
              className="text-2xl font-extrabold text-black tracking-tight"
            >
              Enviro<span className="text-black">Report</span>
            </a>
            <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-700">
              <a href="#" className="hover:text-green-600 transition">
                FAQ
              </a>
              <a href="#" className="hover:text-green-600 transition">
                Report an Issue
              </a>
              <a
                href="#"
                className="bg-[#51a750] text-white px-4 py-2 rounded-md hover:bg-green-700 transition flex items-center gap-2"
              >
                Register Now <span>→</span>
              </a>
            </div>
          </div>
          <div>
            <button className="text-gray-700 hover:text-green-600 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0"
                />
              </svg>
            </button>
          </div>
        </nav>
        <main className="flex-grow flex flex-col items-center justify-start text-center pt-16 px-4 lg:px-8 relative overflow-hidden">
          {/* Background Image */}
          <div className="absolute top-50 left-1/2 -translate-x-1/2 w-full max-w-full z-0 opacity-90">
            <img
              src="/assets/illust/hero1.png"
              alt="Hero Illustration"
              className="w-full h-auto"
            />
          </div>

          {/* Content */}
          <div className="relative z-10">
            <span className="text-xs font-bold tracking-widest text-gray-600 uppercase mb-4">
              Lapor Lebih Mudah, Kota Lebih Bersih.
            </span>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-black leading-tight mb-4">
              Dari Kepedulian Warga, <br className="hidden md:block" />
              Untuk Kenyamanan Bersama.
            </h1>

            <p className="text-gray-700 max-w-2xl mx-auto mb-8 text-sm md:text-base leading-relaxed">
              Karena lingkungan kita butuh lebih dari sekadar komplain - butuh
              aksi nyata dan transparansi penanganan.
              <br className="hidden md:block" />
              Yuk, bantu jaga kota kita jadi tempat yang lebih baik buat
              ditinggali.
            </p>

            <button className="bg-[#51a750] text-white font-semibold px-8 py-3 rounded-full hover:bg-green-700 transition shadow-lg hover:shadow-xl">
              Buat Laporan Sekarang
            </button>
          </div>
        </main>
      </div>
      <section className="bg-white py-20 px-6 lg:px-12">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-gray-500 uppercase mb-4 block">
            Fitur Unggulan
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-4">
            Semua Alat Buat Jaga Batam, Ada di Sini
          </h2>
          <p className="text-gray-600 text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
            Dari sekadar lapor genangan air sampai mantau tumpukan sampah,
            <br className="hidden md:block" />
            fitur kita didesain biar kamu bisa ikut kontribusi tanpa ribet.
            <br className="hidden md:block" />
            Lapor gampang, pantau transparan.
          </p>
        </div>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="border border-gray-200 rounded-3xl p-6 hover:shadow-lg transition bg-white flex flex-col items-center text-center">
            <img
              src="https://placehold.co/300x200/f8fafc/94a3b8?text=Ilustrasi+1"
              alt="Lapor Semudah Update Status"
              className="w-full h-48 object-contain mb-6"
            />
            <h3 className="text-lg font-bold text-black mb-2 self-start">
              Lapor Semudah Update Status
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed text-left">
              Tinggal jepret (foto bukti), tandai lokasi pasti di peta, dan
              kasih cerita singkat. Masalah lingkungan langsung tercatat di
              sistem!
            </p>
          </div>
          <div className="border border-gray-200 rounded-3xl p-6 hover:shadow-lg transition bg-white flex flex-col items-center text-center">
            <img
              src="https://placehold.co/300x200/f8fafc/94a3b8?text=Ilustrasi+2"
              alt="Validasi AI Pintar"
              className="w-full h-48 object-contain mb-6"
            />
            <h3 className="text-lg font-bold text-black mb-2 self-start">
              Validasi AI Pintar
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed text-left">
              AI kita otomatis mendeteksi keaslian foto dan mengecek laporan
              duplikat, jadi kerja petugas penangan bisa jauh lebih cepat dan
              fokus.
            </p>
          </div>
          <div className="border border-gray-200 rounded-3xl p-6 hover:shadow-lg transition bg-white flex flex-col items-center text-center">
            <img
              src="https://placehold.co/300x200/f8fafc/94a3b8?text=Ilustrasi+3"
              alt="Peta Pantauan Area"
              className="w-full h-48 object-contain mb-6"
            />
            <h3 className="text-lg font-bold text-black mb-2 self-start">
              Peta Pantauan Area (Heatmap)
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed text-left">
              Lihat area mana saja yang lagi masuk status waspada (Redzone)
              lewat visualisasi peta warna interaktif.
            </p>
          </div>
          <div className="border border-gray-200 rounded-3xl p-6 hover:shadow-lg transition bg-white flex flex-col items-center text-center">
            <img
              src="https://placehold.co/300x200/f8fafc/94a3b8?text=Ilustrasi+4"
              alt="Lacak Progres Laporan"
              className="w-full h-48 object-contain mb-6"
            />
            <h3 className="text-lg font-bold text-black mb-2 self-start">
              Lacak Progres Laporan
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed text-left">
              Laporanmu nggak bakal cuma jadi pajangan. Pantau terus statusnya
              dari mulai ditangani sampai tuntas dieksekusi di lapangan.
            </p>
          </div>
          <div className="border border-gray-200 rounded-3xl p-6 hover:shadow-lg transition bg-white flex flex-col items-center text-center">
            <img
              src="https://placehold.co/300x200/f8fafc/94a3b8?text=Ilustrasi+5"
              alt="Forum & Dukungan Warga"
              className="w-full h-48 object-contain mb-6"
            />
            <h3 className="text-lg font-bold text-black mb-2 self-start">
              Forum &amp; Dukungan Warga
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed text-left">
              Ketemu masalah yang sama dengan warga lain? Nggak perlu lapor
              ulang, cukup berikan dukungan dan diskusi di kolom komentar
              laporannya.
            </p>
          </div>
          <div className="border border-gray-200 rounded-3xl p-6 hover:shadow-lg transition bg-white flex flex-col items-center text-center">
            <img
              src="https://placehold.co/300x200/f8fafc/94a3b8?text=Ilustrasi+6"
              alt="Terhubung ke Aksi Nyata"
              className="w-full h-48 object-contain mb-6"
            />
            <h3 className="text-lg font-bold text-black mb-2 self-start">
              Terhubung ke Aksi Nyata
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed text-left">
              Sistem kita menjembatani laporanmu langsung ke meja admin dan
              pihak terkait untuk memastikan masalah lingkungan benar-benar
              ditangani.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
