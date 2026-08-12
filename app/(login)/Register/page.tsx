import React from 'react'
import Image from "next/image";

export default function Page() {
  return (
    <div className="relative min-h-screen h-[800px] bg-slate-900">
      <Image
        src="/Register_page/290d32d4-6a5e-4e19-b528-50360aa652f4.jpg"
        alt="background_Login_page"
        fill
        className="object-cover blur-sm scale-105"
      />

      {/*floating window*/}
      <div className="relative z-10 flex min-h-screen items-start justify-center px-4 py-8 sm:py-12">
        <div className="w-full max-w-[350px] max-h-[calc(100vh-4rem)]  rounded-3xl border border-white/50 bg-white/90 p-5 shadow-5xl backdrop-blur-md">
          <div className="relative mx-auto mb-4 h-20 w-20">
            {/*logo*/}
            <Image
              src="/Register_page/University_of_Peradeniya_crest.png"
              alt="Peradeniya crest"
              fill
              className="object-contain"
            />
          </div>

          <h2 className="text-center text-2xl font-bold text-gray-900">
            Health Centre <br /> University Of Peradeniya
          </h2>

          <p className="mt-3 text-center text-gray-600">Register</p>

          <div className="mt-6 rounded-3xl bg-white p-4 sm:p-6">
            

            <p className="mt-2 mb-8 text-center text-gray-500">
              Enter Student's details to continue
            </p>

            <form className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Registration Number
                </label>

                <input
                  type="text"
                  placeholder="Enter registration number"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>

                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                className="mt-3 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]"
              >
                Continue
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}


