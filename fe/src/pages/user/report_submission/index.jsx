import { useState } from "react";
import DatePicker from "react-datepicker";
import { useForm } from "react-hook-form";

export default function ReportSubmissionPage() {
  const { register, handleSubmit, setValue } = useForm();
  const [typeOpen, setTypeOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("");
  const [selectedDate, setSelectedDate] = useState(null);

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="min-h-screen bg-[#fafafa]  text-gray-800 p-4 md:p-8">
      {/* Back Button */}
      <button className="flex items-center text-gray-500 hover:text-black transition mb-6">
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

      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* L E F T   C O L U M N   (Form Inputs) */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl p-6 lg:p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="block text-xs font-medium text-gray-600 mb-2"
              >
                Title
              </label>
              <input
                {...register("title")}
                type="text"
                id="title"
                placeholder="Rich text editor."
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
              />
            </div>

            {/* Detail Textarea (Fake Rich Text) */}
            <div>
              <label
                htmlFor="detail"
                className="block text-xs font-medium text-gray-600 mb-2"
              >
                detail
              </label>
              <div className="border border-gray-300 rounded-md overflow-hidden">
                <textarea
                  {...register("detail")}
                  id="detail"
                  rows="8"
                  placeholder="Rich text editor."
                  className="w-full px-4 py-3 text-sm focus:outline-none resize-y border-b border-gray-200"
                ></textarea>

                {/* Fake Toolbar */}
                <div className="bg-[#fcfcfc] px-4 py-2 flex items-center gap-4 text-gray-500">
                  <button type="button" className="font-bold hover:text-black">
                    B
                  </button>
                  <button type="button" className="italic hover:text-black">
                    I
                  </button>
                  <button
                    type="button"
                    className="line-through hover:text-black"
                  >
                    S
                  </button>
                  <div className="w-[1px] h-4 bg-gray-300"></div>
                  <button type="button" className="hover:text-black">
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z" />
                    </svg>
                  </button>
                  <button type="button" className="hover:text-black">
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
                  <button type="button" className="font-mono hover:text-black">
                    &lt;/&gt;
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
              <div className="space-y-6">
                {/* Priority Level Dropdown */}
                <div>
                  <label
                    htmlFor="priority"
                    className="block text-xs font-medium text-gray-600 mb-2"
                  >
                    Priority Level
                  </label>
                  <div className="relative">
                    <div
                      onClick={() => setTypeOpen(!typeOpen)}
                      className="w-full border px-4 py-3 flex justify-between cursor-pointer"
                    >
                      <span>{selectedType || "Select Type"}</span>
                    </div>

                    {typeOpen && (
                      <div className="absolute w-full bg-white border shadow">
                        {[
                          "Waste Issue",
                          "Facility Damage",
                          "Illegal Dumping",
                        ].map((item) => (
                          <div
                            key={item}
                            onClick={() => {
                              setSelectedType(item);
                              setValue("type", item); // masuk ke form
                              setTypeOpen(false);
                            }}
                            className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                          >
                            {item}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

               
              </div>

              {/* Fake Date Picker Modal (Hovering over the right side) */}
              <div className="hidden md:block relative">
                <div className="absolute top-6 left-0 bg-gray-400 rounded-2xl p-6 shadow-xl w-72 z-20">
                  <p className="text-white text-sm font-medium mb-4">
                    Select date
                  </p>
                  <div className="relative">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                        setValue("date", date);
                      }}
                      className="w-full border px-4 py-3 mb-3  rounded-md"
                    />
                    
                  </div>
                  <div className="flex justify-end gap-4 text-white text-sm font-medium">
                    <button type="button" className="hover:text-gray-200">
                      Cancel
                    </button>
                    <button type="submit" className="hover:text-gray-200">
                      OK
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-8">
              <button
                type="button"
                className="bg-[#4ca64c] hover:bg-green-700 text-white px-8 py-2.5 rounded-full text-sm font-medium transition shadow-sm"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* R I G H T   C O L U M N   (Media & Location) */}
        <div className="w-full lg:w-80 flex flex-col gap-8">
          {/* Foto Bukti Upload Area */}
          <div>
            <h3 className="text-base font-bold text-black mb-3">Foto Bukti</h3>
            <div className="w-full aspect-square bg-[#f0f2f5] rounded-[2rem] flex flex-col items-center justify-center border-2 border-dashed border-transparent hover:border-gray-300 transition cursor-pointer">
              {/* Fake Image Icon */}
              <div className="w-20 h-20 bg-[#a0abb8] rounded-xl mb-4 relative overflow-hidden flex items-end justify-center">
                <svg
                  className="w-16 h-12 text-white/50"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 3H5c-1.103 0-2 .897-2 2v14c0 1.103.897 2 2 2h14c1.103 0 2-.897 2-2V5c0-1.103-.897-2-2-2zM5 19V5h14l.002 14H5z" />
                  <path d="m10 14-1-1-3 4h12l-5-7z" />
                </svg>
              </div>
              <div className="flex flex-col items-center text-gray-500 text-sm">
                <svg
                  className="w-5 h-5 mb-1"
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
                <span className="text-center text-xs">
                  Upload / Drop
                  <br />
                  image
                </span>
                <input type="file" accept="image/*" {...register("image")} />
              </div>
            </div>
          </div>

          {/* Lokasi (Google Maps Embed) */}
          <div>
            <h3 className="text-base font-bold text-black mb-3">lokasi</h3>
            <div className="w-full aspect-square rounded-xl overflow-hidden border border-gray-300 bg-gray-100">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15956.241517032733!2d104.03045435!3d1.1278144!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31d9891eaac0d80b%3A0xc6cb5a6200257e!2sBatam%20Centre%2C%20Batam%20City%2C%20Riau%20Islands!5e0!3m2!1sen!2sid!4v1714310822000!5m2!1sen!2sid"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Location Map"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
