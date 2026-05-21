import { useState } from "react";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function ReportSubmissionPage() {
  const { register, handleSubmit, setValue } = useForm();

  const [typeOpen, setTypeOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  const backPath = location.state?.from || "/";

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fafafa] text-gray-800">

      {/* HEADER */}
      <header className="border-b border-gray-200 bg-white px-4 sm:px-6 md:px-8 py-4 sm:py-5 flex items-center text-gray-600 shrink-0">
         <button
            onClick={() => navigate(backPath)}
            className="flex items-center hover:text-black transition font-medium text-sm sm:text-base"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back
          </button>
      </header>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 md:px-8 py-5 sm:py-6">

        <div className="max-w-7xl mx-auto flex flex-col xl:flex-row gap-6 lg:gap-8">

          {/* LEFT FORM */}
          <div className="flex-1 bg-white border border-gray-200 rounded-2xl p-4 sm:p-6 lg:p-8 shadow-sm">

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-5 sm:space-y-6"
            >

              {/* TITLE */}
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-2">
                  Title
                </label>

                <input
                  {...register("title")}
                  type="text"
                  placeholder="Problem / Issue."
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>

              {/* DETAIL */}
              <div>
                <label
                  htmlFor="detail"
                  className="block text-xs font-medium text-gray-600 mb-2"
                >
                  Detail
                </label>

                <div className="border border-gray-300 rounded-md overflow-hidden">

                  {/* TEXTAREA */}
                  <textarea
                    {...register("detail")}
                    id="detail"
                    rows="8"
                    placeholder="Describe the problem."
                    className="w-full px-4 py-3 text-sm focus:outline-none resize-y border-b border-gray-200"
                  />

                  {/* TOOLBAR */}
                  <div className="bg-[#fcfcfc] px-3 sm:px-4 py-2 flex items-center flex-wrap gap-3 sm:gap-4 text-gray-500">

                    <button
                      type="button"
                      className="font-bold hover:text-black"
                    >
                      B
                    </button>

                    <button
                      type="button"
                      className="italic hover:text-black"
                    >
                      I
                    </button>

                    <button
                      type="button"
                      className="line-through hover:text-black"
                    >
                      S
                    </button>

                    <div className="w-[1px] h-4 bg-gray-300"></div>

                    <button
                      type="button"
                      className="hover:text-black"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                      </svg>
                    </button>

                    <button
                      type="button"
                      className="hover:text-black"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z" />
                      </svg>
                    </button>

                    <div className="w-[1px] h-4 bg-gray-300"></div>

                    <button
                      type="button"
                      className="text-xl leading-none font-serif hover:text-black"
                    >
                      "
                    </button>

                    <button
                      type="button"
                      className="font-mono hover:text-black"
                    >
                      {"</>"}
                    </button>
                  </div>
                </div>
              </div>

              {/* DROPDOWN + DATE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 relative">

                {/* DROPDOWN */}
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-2">
                    Priority Level
                  </label>

                  <div className="relative">
                    <div
                      onClick={() => setTypeOpen(!typeOpen)}
                      className="w-full border border-gray-300 rounded-md px-4 py-3 flex justify-between items-center cursor-pointer text-sm"
                    >
                      <span>
                        {selectedType || "Select Type"}
                      </span>

                      <span>⌄</span>
                    </div>

                    {typeOpen && (
                      <div className="absolute w-full bg-white border border-gray-200 shadow-lg rounded-md z-10 mt-1 overflow-hidden">
                        {[
                          "Waste Issue",
                          "Facility Damage",
                          "Illegal Dumping",
                        ].map((item) => (
                          <div
                            key={item}
                            onClick={() => {
                              setSelectedType(item);
                              setValue("type", item);
                              setTypeOpen(false);
                            }}
                            className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-sm"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* DATE */}
                <div className="relative">
                  <div className="bg-gray-400 rounded-2xl p-4 sm:p-6 shadow-xl w-full">

                    <p className="text-white text-sm font-medium mb-4">
                      Select date
                    </p>

                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                        setValue("date", date);
                      }}
                      className="w-full border px-4 py-3 mb-3 rounded-md text-sm"
                    />

                    <div className="flex justify-end gap-4 text-white text-sm">
                      <button type="button">
                        Cancel
                      </button>

                      <button type="submit">
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* SUBMIT */}
              <div className="pt-4 sm:pt-6">
                <button className="w-full sm:w-auto bg-[#4ca64c] text-white px-8 py-3 rounded-full hover:bg-green-700 transition">
                  Submit
                </button>
              </div>
            </form>
          </div>

          {/* RIGHT SIDE */}
          <div className="w-full xl:w-80 grid grid-cols-2 xl:grid-cols-1 gap-4 sm:gap-6">

            {/* UPLOAD */}
            <div>
              <h3 className="text-sm sm:text-base font-bold text-black mb-3">
                Foto Bukti
              </h3>

              <div className="w-full aspect-[1/1] sm:aspect-square bg-[#f0f2f5] rounded-[2rem] flex flex-col items-center justify-center border-2 border-dashed border-transparent hover:border-gray-300 transition cursor-pointer relative">

                {/* ICON */}
                <div className="w-14 h-14 sm:w-20 sm:h-20 bg-[#a0abb8] rounded-xl mb-3 sm:mb-4 flex items-end justify-center overflow-hidden">
                  <svg
                    className="w-10 h-8 sm:w-16 sm:h-12 text-white/50"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z" />
                    <path d="m10 14-1-1-3 4h12l-5-7z" />
                  </svg>
                </div>

                {/* TEXT */}
                <div className="flex flex-col items-center text-gray-500 text-xs sm:text-sm">
                  <svg
                    className="w-4 h-4 sm:w-5 sm:h-5 mb-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>

                  <span className="text-center">
                    Upload / Drop
                    <br />
                    image
                  </span>
                </div>

                {/* INPUT */}
                <input
                  type="file"
                  accept="image/*"
                  {...register("image")}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
              </div>
            </div>

            {/* MAP */}
            <div>
              <h3 className="text-sm sm:text-base font-bold mb-3">
                Lokasi
              </h3>

              <div className="w-full aspect-[1/1] sm:aspect-square rounded-xl overflow-hidden border">
                <iframe
                  src="https://maps.google.com/maps?q=Batam%20Centre&t=&z=14&output=embed"
                  className="w-full h-full border-0"
                />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}