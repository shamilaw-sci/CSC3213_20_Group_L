import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans } from 'next/font/google';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['800', "800"],
  display: 'swap',
});







export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFF] ">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200 ">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">

        {/* Logo */}
          <Image
              src="/home_page/navbar/6a704893-5036-4d21-b86c-e01b44cc3bb0.png"
              alt="Logo"
              width={250}
              height={250}
              className="rounded-full"  />

        {/* Right Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="http://localhost:3000/Login"
              className="px-5 py-2 rounded-lg text-blue-600 border border-blue-600 hover:bg-blue-50 transition-all duration-300">Login</Link>

            <Link
              href="http://localhost:3000/Register"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-md">Register</Link>
          </div>
      </div>
      </nav>
      <section>
          <h1 className={`${jakarta.className} mt-10 text-center text-4xl font-black tracking-tighter text-black sm:text-6xl md:text-7xl`}>
              Better Health <span className="text-[#8000FF]">Start</span>
          </h1>
      </section>
      <div className="flex flex-col items-center justify-center mt-8">
          <h1>Your Health, Our Passion. Exceptional Care Starts Here.</h1>
      </div>

    {/*image section relative*/}
      <div className=" relative w-[1350px] h-[400px]">
        <Image
          src="/home_page/cover_photo/290d32d4-6a5e-4e19-b528-50360aa652f4.jpg"
          alt="senet_building"
          fill
          className=" mt-10  flex items-center justify-center "/>
      </div>
    
    </div>
    
  );
}
