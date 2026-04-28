
export default function ReportDetailPage() {
  return (
    <div className="min-h-screen bg-white text-gray-800 p-4 md:p-8 lg:p-12">
      
      {/* Header / Back Button */}
      <button className="flex items-center text-gray-500 hover:text-black transition mb-8">
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Back
      </button>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-0 lg:divide-x lg:divide-gray-300">
        
        {/* L E F T   C O L U M N   (Detailed Information) */}
        <div className="lg:pr-12 flex flex-col">
          
          <div className="bg-gray-100 rounded-full py-3 px-8 mb-8 mx-auto w-full max-w-sm text-center">
            <h2 className="text-2xl font-extrabold text-black">Detailed Information</h2>
          </div>

          <div className="space-y-4 mb-8 text-base">
            <p><span className=" text-black">Nama pelapor:</span> Jarvis</p>
            <p><span className=" text-black">Nomor Laporan:</span> #1B03032026</p>
            <p><span className=" text-black">Tanggal Laporan:</span> 3 maret 2026, 10:00 WIB</p>
            <p><span className=" text-black">Lokasi:</span> 4377+XHW, Belian, Batam Kota, Batam City, Riau Islands</p>
          </div>

          {/* Detail Keluhan Box */}
          <div className="relative bg-gray-50/50 border border-gray-300 rounded-2xl p-6 mb-8 mt-2">
            <span className="absolute -top-3 left-6 bg-white px-2 text-xs  text-gray-400">
              Detail Keluhan
            </span>
            <p className="text-black text-sm md:text-base leading-relaxed">
              saya mau lapor kondisi drainase di area sekitar Batam Centre yang setiap hujan deras sebentar saja pasti langsung meluap dan bikin banjir genangan setinggi betis orang dewasa. Airnya sampai masuk ke teras ruko dan bikin banyak kendaraan mogok karena nekat menerjang genangan, alhasil macetnya jadi panjang banget. Sepertinya gorong-gorong di sini tersumbat sampah plastik atau memang sudah terlalu sempit untuk menampung debit air yang makin tinggi belakangan ini. Mohon segera ditinjau ya tim teknisnya, karena ini bahaya banget buat keselamatan pengendara, apalagi kalau malam hari lubang jalannya jadi nggak kelihatan karena tertutup air. Makasih!
            </p>
          </div>

          {/* Foto Bukti */}
          <div>
            <h3 className=" text-black mb-4">Foto Bukti</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Image Placeholder 1 */}
              <div className="aspect-square bg-[#f0f2f5] rounded-3xl flex items-center justify-center">
                <svg className="w-16 h-16 text-[#a0abb8]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z" />
                  <path d="m10 14-1-1-3 4h12l-5-7z" />
                </svg>
              </div>
              {/* Image Placeholder 2 */}
              <div className="aspect-square bg-[#f0f2f5] rounded-3xl flex items-center justify-center">
                <svg className="w-16 h-16 text-[#a0abb8]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z" />
                  <path d="m10 14-1-1-3 4h12l-5-7z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* R I G H T   C O L U M N   (Timeline Progress) */}
        <div className="lg:pl-12 flex flex-col">
          
          <div className="bg-gray-100 rounded-full py-3 px-8 mb-8 mx-auto w-full max-w-sm text-center">
            <h2 className="text-2xl font-extrabold text-black">Timeline Progress</h2>
          </div>

          <div className="bg-[#f4f5f6] border border-gray-200 rounded-[2rem] p-8 md:p-10 flex-1">
            
            {/* Illustration Area */}
            <div className="flex flex-col items-center mb-10">
              <img 
                src="https://placehold.co/400x250/e2e8f0/64748b?text=Ilustrasi+Perbaikan" 
                alt="Ilustrasi Laporan Sedang Ditangani" 
                className="w-full max-w-sm object-contain mb-4 rounded-xl"
              />
              <p className="text-gray-500 text-sm  tracking-wide">Laporan Sedang Ditangani</p>
            </div>

            {/* Timeline Stepper */}
            <div className="relative border-l border-gray-300 ml-5 space-y-10">
              
              {/* Step 1: Completed */}
              <div className="relative pl-10">
                <div className="absolute -left-[18px] top-0 w-9 h-9 bg-[#4ca64c] rounded-full flex items-center justify-center ring-8 ring-[#f4f5f6]">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h4 className="font-bold text-black text-[15px]">Laporan Diterima</h4>
                <p className="text-[13px] text-gray-500 mt-1.5 leading-relaxed">
                  Sistem telah menerima laporanmu. Saat ini AI kami sedang memvalidasi keaslian foto dan mengecek apakah ada laporan serupa di lokasi yang sama.
                </p>
              </div>

              {/* Step 2: Completed */}
              <div className="relative pl-10">
                {/* Visual Connector for completed steps (green line) */}
                <div className="absolute -left-[1px] -top-10 w-[1px] h-10 bg-[#4ca64c]"></div>
                <div className="absolute -left-[18px] top-0 w-9 h-9 bg-[#4ca64c] rounded-full flex items-center justify-center ring-8 ring-[#f4f5f6]">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h4 className="font-bold text-black text-[15px]">Validasi & Verifikasi Admin</h4>
                <p className="text-[13px] text-gray-500 mt-1.5 leading-relaxed">
                  Laporanmu sudah lolos pengecekan AI dan sekarang sedang ditinjau oleh Admin untuk diteruskan ke dinas teknis terkait.
                </p>
              </div>

              {/* Step 3: In Progress (Active) */}
              <div className="relative pl-10">
                {/* Visual Connector for completed steps (green line) */}
                <div className="absolute -left-[1px] -top-10 w-[1px] h-10 bg-[#4ca64c]"></div>
                <div className="absolute -left-[18px] top-0 w-9 h-9 bg-[#fde047] border-2 border-[#eab308] rounded-full flex items-center justify-center ring-8 ring-[#f4f5f6]">
                  <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                </div>
                <h4 className="font-bold text-black text-[15px]">Investigasi & Survei Lapangan</h4>
                <p className="text-[13px] text-gray-500 mt-1.5 leading-relaxed">
                  Tim petugas lapangan sedang meluncur ke lokasi untuk melakukan pengecekan kondisi fisik dan merencanakan tindakan penanganan.
                </p>
              </div>

              {/* Step 4: Pending */}
              <div className="relative pl-10">
                <div className="absolute -left-[18px] top-0 w-9 h-9 bg-white border border-gray-300 rounded-full flex items-center justify-center ring-8 ring-[#f4f5f6]"></div>
                <h4 className="font-semibold text-gray-800 text-[15px]">Proses Eksekusi Penanganan</h4>
              </div>

              {/* Step 5: Pending */}
              <div className="relative pl-10">
                <div className="absolute -left-[18px] top-0 w-9 h-9 bg-white border border-gray-300 rounded-full flex items-center justify-center ring-8 ring-[#f4f5f6]"></div>
                <h4 className="font-semibold text-gray-800 text-[15px]">Selesai & Masalah Teratasi</h4>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}