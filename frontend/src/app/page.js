'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* Left - Company Name */}
      <div className="text-xl font-bold text-green-600">
        Company<span className="text-gray-800">Name</span>
      </div>

      {/* Right - Auth Buttons */}
      <div className="space-x-4">
        <Link href="/signin">
          <button className="px-5 py-2 border border-green-500 text-green-500 font-medium rounded-full hover:bg-green-500 hover:text-white transition duration-200">
            Login
          </button>
        </Link>
        <Link href="/signup">
          <button className="px-5 py-2 bg-green-500 text-white font-medium rounded-full hover:bg-green-600 transition duration-200">
            Sign Up
          </button>
        </Link>
      </div>
    </nav>
  );
}
