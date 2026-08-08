import Image from "next/image";
import Link from "next/link";


export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-16 px-6">

        {/* Logo */}
          <Image
              src="/navbar/6a704893-5036-4d21-b86c-e01b44cc3bb0.png"
              alt="Logo"
              width={250}
              height={250}
              className="rounded-full"
  />

        {/* Right Buttons */}
        <div className="flex items-center gap-3">

          <Link
            href="/login"
            className="px-5 py-2 rounded-lg text-blue-600 border border-blue-600 hover:bg-blue-50 transition-all duration-300"
          >
            Login
          </Link>

          <Link
            href="/register"
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-all duration-300 shadow-md"
          >
            Register
          </Link>

        </div>

      </div>
    </nav>
    </div>
  );
}
