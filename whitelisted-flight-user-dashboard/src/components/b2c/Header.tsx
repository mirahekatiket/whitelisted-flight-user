"use client";

import Link from "next/link";
import { useBooking } from "@/context/BookingContext";

export default function Header() {
  const { user, isLoggedIn } = useBooking();

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/search" className="flex items-center gap-1">
            <span className="text-2xl font-bold text-[#0194f3]">tiket</span>
            <span className="w-2 h-2 rounded-full bg-[#ffc107]"></span>
            <span className="text-2xl font-bold text-[#0194f3]">com</span>
          </Link>

          {/* Search Bar (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                placeholder="Staycation in Bandung"
                className="w-full pl-10 pr-4 py-2 rounded-full bg-gray-100 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0194f3]/20"
              />
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            <Link
              href="/search"
              className="text-sm font-medium text-gray-900 hover:text-[#0194f3]"
            >
              Flights
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-600 hover:text-[#0194f3]"
            >
              Hotels
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-600 hover:text-[#0194f3]"
            >
              Villas & Apt.
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-600 hover:text-[#0194f3]"
            >
              To Dos
            </Link>
            <Link
              href="#"
              className="text-sm font-medium text-gray-600 hover:text-[#0194f3]"
            >
              Trains
            </Link>
            <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-[#0194f3]">
              More
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#0194f3] flex items-center justify-center text-white text-sm font-medium">
                  {user?.name.charAt(0).toUpperCase()}
                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-[#0194f3] hover:bg-blue-50 rounded-lg transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

