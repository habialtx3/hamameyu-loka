import { Link } from "react-router-dom";

export default function RegisterPage() {
  // SVG Ikon Google
  //   const GoogleIcon = () => (
  //     <svg className="w-5 h-5" viewBox="0 0 48 48">
  //       <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.954,4,4,12.954,4,24s8.954,20,20,20s20-8.954,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
  //       <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
  //       <path fill="#4CAF50" d="M24,44c4.074,0,7.753-1.294,10.748-3.485l-6.138-5.789C26.746,35.619,25.419,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
  //       <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.838C36.936,39.558,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
  //     </svg>
  //   );

  //   // SVG Ikon Apple
  //   const AppleIcon = () => (
  //     <svg className="w-5 h-5" viewBox="0 0 384 512">
  //       <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 126.7 27.8 0 29.9-18.5 63.8-18.5 31.4 0 34.6 18.5 61.8 18.5 50 0 91.5-103.5 107.2-126.7q14.4-41.9 14.4-81.2c-.3-.2-.3-.5-.3-.7zM176.7 100c11.9-14.7 19.3-33.8 19.3-51.4 0-4.1-.3-8.2-1.1-12.2-22.1 1.7-45.6 15.3-56.7 28.1-11.9 14.7-19.3 33.8-19.3 51.4 0 4.1.3 8.2 1.1 12.2 22.1-1.7 45.6-15.3 56.7-28.1z"/>
  //     </svg>
  //   );

  return (
    <div className="min-h-screen bg-white  text-gray-800 flex flex-col">
      <nav className="p-6 md:px-8 flex items-center justify-between">
        <Link to={"/"}>
          <button className="flex items-center text-gray-500 hover:text-black transition">
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
        </Link>

        <div className="text-sm font-medium text-black">
          <a href="#" className="hover:underline">
            Create an account
          </a>
        </div>
      </nav>

      <main className="flex-grow  flex flex-col md:flex-row">
        <div className="w-full flex items-center justify-center p-8 px-4 lg:p-12">
          <img
            src="/assets/illust/register.png"
            alt="Ilustrasi Transportasi Kota dalam Hati"
            className="lg:w-3/4 sm:w-1/3 h-auto object-contain"
          />
        </div>

        <div className="w-full md:w-1/2 flex items-center justify-center p-8 lg:p-12">
          <div className="bg-white border border-gray-100 p-12 rounded-[2rem] shadow-sm w-full max-w-lg">
            <div className="w-16 h-16 rounded-full bg-gray-200 mx-auto mb-6"></div>

            <h2 className="text-3xl font-extrabold text-black text-center mb-1">
              Create Account
            </h2>
            <p className="text-sm text-gray-600 text-center mb-8">
              Already have an account ? {" "}
              <Link to={'/login'}>
                <span className="text-blue-600 hover:underline">
                  Login
                </span>
              </Link>
            </p>

            <form className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-semibold text-gray-600 mb-2"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-semibold text-gray-600 mb-2 relative"
                >
                  Password
                  <button
                    type="button"
                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black flex items-center gap-1 text-[11px] font-medium"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zm0 12c-2.48 0-4.5-2.02-4.5-4.5S9.52 7.5 12 7.5 16.5 9.52 16.5 12 14.48 16.5 12 16.5zm0-8c-1.93 0-3.5 1.57-3.5 3.5S10.07 15.5 12 15.5 15.5 13.93 15.5 12 13.93 8.5 12 8.5z" />
                    </svg>
                    Hide
                  </button>
                </label>
                <input
                  type="password"
                  id="password"
                  className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>

              <div className="flex items-start mb-8 gap-3">
                <input
                  type="checkbox"
                  id="agree"
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500 mt-1"
                />
                <label htmlFor="agree" className="text-sm text-gray-600">
                  By creating an account, I agree to our{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Terms of use
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div>
                <button
                  type="button"
                  className="w-full bg-gray-300 text-white rounded-full py-3 text-sm font-semibold mb-6 shadow-sm"
                >
                  Sign Up
                </button>
              </div>
            </form>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex-grow h-[1px] bg-gray-200"></div>
              <span className="text-sm text-gray-400 font-medium">OR</span>
              <div className="flex-grow h-[1px] bg-gray-200"></div>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                className="w-full border border-gray-300 text-black rounded-full py-3 text-sm font-medium flex items-center justify-center gap-3 hover:bg-gray-50 transition shadow-sm"
              >
                Continue with Google
              </button>

              <button
                type="button"
                className="w-full border border-gray-300 text-black rounded-full py-3 text-sm font-medium flex items-center justify-center gap-3 hover:bg-gray-50 transition shadow-sm"
              >
                Continue with Apple
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
