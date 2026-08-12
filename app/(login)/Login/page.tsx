import React from 'react'
import Image from "next/image";

function page() {
  return (
    <div>
      <Image
              src="/Login_page/4cd0336b-2c06-4101-a1b5-b50b18dbc59c.jpg"
              alt="background_Login_page"
              fill
              className="object-cover blur-sm scale-105"/>

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
              
                        <p className="mt-3 text-center text-gray-600">Login</p>
              
                        <div className="mt-6 rounded-3xl bg-white p-4 sm:p-6">
              
                          <form className="space-y-5">
              
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
              

                            <div className="mb-4">
                                <label htmlFor="password"className="mb-2 block text-sm font-medium text-gray-700" >
                                    Password
                                </label>
                                 <input
                                    type="password"
                                    id="password"
                                    name="password"
                                    placeholder="Enter your password"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 outline-none transition-all duration-300 focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-100"
                                />
                            </div>

                            <button
                              type="submit"
                              className="mt-3 w-full rounded-xl bg-blue-600 py-3 font-semibold text-white shadow-md transition-all duration-300 hover:bg-blue-700 hover:shadow-lg active:scale-[0.98]">
                                    Login
                            </button>
                          </form>
                        </div>
                      </div>
                    </div>                    
                              
    </div>
  )
}

export default page
{/*University_of_Peradeniya_crest*/}