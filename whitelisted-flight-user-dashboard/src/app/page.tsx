"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E8F4FD] via-white to-[#FFF9E6]">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-1">
            <span className="text-2xl font-bold text-[#0194f3]">tiket</span>
            <span className="w-2 h-2 rounded-full bg-[#ffc107]"></span>
            <span className="text-2xl font-bold text-[#0194f3]">com</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-6">
            <span>⚡</span>
            Innovation Day Prototype
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Flight Whitelist
            <br />
            <span className="text-[#0194f3]">QA Testing Solution</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A unified control mechanism to prevent accidental real bookings during
            QA testing on staging environment.
          </p>
        </div>

        {/* Problem Statement */}
        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-8 mb-12 border border-red-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-2xl">⚠️</span>
            Problem Statement
          </h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-red-500 mt-1">•</span>
              QA testers need to switch supplier APIs to production mode to validate booking flows
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500 mt-1">•</span>
              Manual switching & Slack announcements create high operational risk
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500 mt-1">•</span>
              Accidental real bookings cause financial loss and extra SOP workload
            </li>
            <li className="flex items-start gap-3">
              <span className="text-red-500 mt-1">•</span>
              No unified control mechanism or automated safeguards exist
            </li>
          </ul>
        </div>

        {/* Solution Cards */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Admin Dashboard Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-8">
              <div className="w-14 h-14 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-[#0194f3]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Admin Dashboard
              </h3>
              <p className="text-gray-600 mb-6">
                Whitelist user management system. Control which emails have access
                to specific airlines during testing.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-8">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  CRUD for email whitelist
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Toggle airline access per user
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Real-time permission management
                </li>
              </ul>
              <Link
                href="/admin-login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Admin Login
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* B2C Website Card */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow">
            <div className="p-8">
              <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mb-6">
                <svg
                  className="w-7 h-7 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                B2C Flight Booking
              </h3>
              <p className="text-gray-600 mb-6">
                Prototype of the customer-facing flight booking flow with staging
                environment safeguards.
              </p>
              <ul className="space-y-2 text-sm text-gray-600 mb-8">
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Login & search flights
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  View results & select fare
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Complete booking flow
                </li>
              </ul>
              <Link
                href="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-colors"
              >
                Try Booking Flow
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                step: "1",
                title: "Whitelist User",
                desc: "Admin adds QA tester email to whitelist",
                icon: "👤",
              },
              {
                step: "2",
                title: "Enable Airlines",
                desc: "Toggle which airlines the user can test",
                icon: "✈️",
              },
              {
                step: "3",
                title: "Safe Testing",
                desc: "User can only book on enabled airlines",
                icon: "🔒",
              },
              {
                step: "4",
                title: "Clear Warnings",
                desc: "Staging environment clearly indicated",
                icon: "⚠️",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  {item.icon}
                </div>
                <div className="w-8 h-8 bg-[#0194f3] text-white rounded-full flex items-center justify-center mx-auto mb-3 text-sm font-bold">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-1 mb-3">
            <span className="font-bold text-gray-800">blibli</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffc107]"></span>
            <span className="font-bold text-[#0194f3]">tiket</span>
          </div>
          <p className="text-sm text-gray-500">
            3 Amigos Innovation Day 2025 • QA Testing Solution Prototype
          </p>
        </div>
      </footer>
    </div>
  );
}
