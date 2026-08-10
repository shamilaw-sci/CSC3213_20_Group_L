import React from 'react'
import Image from "next/image";

function page() {
  return (
    <div className="relative min-h-screen overflow-hidden overflow-auto ">
            {/* Background Image */}
            <Image
              src="/Register_page/290d32d4-6a5e-4e19-b528-50360aa652f4.jpg"
              alt="background_Login_page"
              fill
              className="object-cover blur-sm scale-105"/>


            {/* Floating tab start*/}
            <div className="
                              absolute
                              right-130
                              top-24
                              w-[350px]
                              h-[1000px]
                              bg-white/90         {/* slightly transparent */}
                              backdrop-blur-md
                              rounded-3xl
                              border border-white/50
                              shadow-5xl
                              p-5
                              z-50">

                  <div className="relative w-20 h-20 mx-auto mb-4">
                      <Image
                          src="/Register_page/University_of_Peradeniya_crest.png"
                          alt="background_Login_page"
                          fill
                          className="w-2 h-2"/>  
                  </div>                    

                  <h2 className="text-2xl font-bold text-gray-900 text-center">
                      Medical Centre <br /> University Of Peradeniya 
                  </h2>

                  <p className="mt-3 text-gray-600 text-center">
                      Register
                  </p>

                  {/*form*/}
                      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center p-6">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-8">

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 text-center">
          Registration
        </h1>

        <p className="text-gray-500 text-center mt-2 mb-8">
          Enter your details to continue
        </p>

        <form className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>

            <input
              type="email"
              placeholder="Enter your email"
              className="
                w-full
                px-4 py-3
                bg-gray-50
                border border-gray-200
                rounded-xl
                text-gray-900
                placeholder-gray-400
                outline-none
                transition-all duration-300
                focus:bg-white
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
              "
            />
          </div>

          {/* Registration Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Registration Number
            </label>

            <input
              type="text"
              placeholder="Enter registration number"
              className="
                w-full
                px-4 py-3
                bg-gray-50
                border border-gray-200
                rounded-xl
                text-gray-900
                placeholder-gray-400
                outline-none
                transition-all duration-300
                focus:bg-white
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
              "
            />
          </div>

          {/* Mobile Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mobile Number
            </label>

            <input
              type="tel"
              placeholder="Enter mobile number"
              className="
                w-full
                px-4 py-3
                bg-gray-50
                border border-gray-200
                rounded-xl
                text-gray-900
                placeholder-gray-400
                outline-none
                transition-all duration-300
                focus:bg-white
                focus:border-blue-500
                focus:ring-4
                focus:ring-blue-100
              "
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="
              w-full
              py-3
              mt-3
              bg-blue-600
              hover:bg-blue-700
              active:scale-[0.98]
              text-white
              font-semibold
              rounded-xl
              shadow-md
              hover:shadow-lg
              transition-all duration-300
            "
          >
            Continue
          </button>

        </form>
      </div>
    </div>




            </div> {/* Floating tab end */}
    </div>
  )
}

export default page
