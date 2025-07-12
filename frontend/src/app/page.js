'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* Left - Company Name */}
      <div className="text-xl font-bold">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#01304C] to-[#1BEBC8]">
          APSN Skilling LLP
        </span>
      </div>

      {/* Center - Nav Links */}
      <div className="hidden md:flex space-x-8 text-gray-700 font-medium text-xl">
        <Link href="#" className="hover:text-[#1BEBC8] transition">
          About
        </Link>
        <Link href="#" className="hover:text-[#1BEBC8] transition">
          Contact Us
        </Link>
      </div>

      {/* Right - Auth Buttons */}
      <div className="space-x-4">
        <Link href="/signin">
          <button className="px-5 py-2 border border-[#1BEBC8] text-[#1BEBC8] font-medium rounded-full hover:bg-[#1BEBC8] hover:text-white hover:cursor-pointer transition duration-200">
            Login
          </button>
        </Link>
        <Link href="/signup">
          <button className="px-5 py-2 bg-[#1BEBC8] text-white font-medium rounded-full hover:bg-[#17C6AD] hover:cursor-pointer transition duration-200">
            Sign Up
          </button>
        </Link>
      </div>
    </nav>
  );
}
