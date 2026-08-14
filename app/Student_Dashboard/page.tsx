import React from 'react'
import Image from "next/image";
import Link from "next/link";


function page() {
  return (
    <div className="bg-[#F7F9FC] min-h-screen">
      <nav className="sticky h-[50px] top-2 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6 ml-45">
        <Image
                      src="/Student_dashboard/1911b074-8dd6-42c9-af32-7f22b6b89c6e.jpg"
                      alt="Logo"
                      width={60}
                      height={60}
                      className="rounded-full"  /> 
        </div>
        <div className="ml-3 -mt-15 "><h1 className=" text-4xl font-bold text-[#B91C1C] [text-shadow:0_2px_4px_rgba(0,0,0,0.2)]">Dashboard</h1></div>
        <div className="ml-200 -mt-9 "><h3 className="text-2xl text-[#B91C1C] ">Hi, Student</h3></div>
      </nav>

      {/*large two buttons*/}
      
       <div className="mt-18 ml-10 flex items-start gap-6">
        <div className=" h-[80px] w-[400px] inline-block  px-8 py-4 rounded-2xl border border-[#E5E7EB]  shadow-[0_8px_25px_rgba(220,38,38,0.25)]  hover:shadow-[0_12px_30px_rgba(220,38,38,0.35)]  hover:-translate-y-1  transition-all duration-300  cursor-pointer rounded-xl  bg-[#B91C1C]  px-6 py-3 text-base font-medium text-white shadow-[0_6px_18px_rgba(185,28,28,0.25)]  transition-all duration-300  hover:bg-[#991B1B] hover:-translate-y-0.5">
            <h2 className="text-xl font-bold">Apply Medical Certificate</h2>
        </div>
        <div className=" h-[80px] w-[400px] inline-block  px-8 py-4 rounded-2xl border border-[#E5E7EB]  shadow-[0_8px_25px_rgba(220,38,38,0.25)]  hover:shadow-[0_12px_30px_rgba(220,38,38,0.35)]  hover:-translate-y-1  transition-all duration-300  cursor-pointer rounded-xl  bg-[#B91C1C]  px-6 py-3 text-base font-medium text-white shadow-[0_6px_18px_rgba(185,28,28,0.25)]  transition-all duration-300  hover:bg-[#991B1B] hover:-translate-y-0.5">
            <h2 className="text-xl ">Blood Checkup</h2>
        </div>
       </div>

       <div className="mt-10 ml-10 ">
        <h3 className="text-lg font-semibold text-[#6B7280] text-[#991B1B] underline decoration-[#B91C1C] decoration-2 underline-offset-4">Current Situation</h3>
       </div>

       <div className=" ml-10 mt-10 h-[50px] w-[300px] rounded-xl bg-[#3B82C4] px-7 py-3 text-base font-semibold text-white shadow-[0_6px_0_#2563A6,0_10px_20px_rgba(59,130,196,0.25)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_0_#2563A6,0_15px_25px_rgba(59,130,196,0.3)] active:translate-y-1 active:shadow-[0_3px_0_#2563A6,0_5px_10px_rgba(59,130,196,0.2)]">
        <h3 className="text-white">Applied Medical certificates</h3>
       </div>

       <div className=" ml-10 mt-11 h-[50px] w-[300px] rounded-xl bg-[#3B82C4] px-7 py-3 text-base font-semibold text-white shadow-[0_6px_0_#2563A6,0_10px_20px_rgba(59,130,196,0.25)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_0_#2563A6,0_15px_25px_rgba(59,130,196,0.3)] active:translate-y-1 active:shadow-[0_3px_0_#2563A6,0_5px_10px_rgba(59,130,196,0.2)]">
        <h3 className="text-white">Blood checking History</h3>
       </div>
      
    </div>
  )
}

export default page


  

     