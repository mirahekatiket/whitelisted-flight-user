"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/context/BookingContext";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useBooking();
  const [email, setEmail] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);

  const handleGoogleLogin = () => {
    // Simulate Google login
    setUser({
      email: "ni.darmayanti@tiket.com",
      name: "Ni Darmayanti",
    });
    router.push("/search");
  };

  const handleEmailLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setUser({
        email: email,
        name: email.split("@")[0],
      });
      router.push("/search");
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Gradient Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #87CEEB 0%, #E0F4FF 25%, #FFF9E6 50%, #FFEB99 75%, #FFD700 100%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4">
        {/* Logo */}
        <div className="mb-2 flex items-center gap-1">
          <span className="text-4xl font-bold text-[#0194f3]">tiket</span>
          <span className="w-3 h-3 rounded-full bg-[#ffc107]"></span>
          <span className="text-4xl font-bold text-[#0194f3]">com</span>
        </div>
        <p className="text-gray-600 mb-8 flex items-center gap-2">
          Part of{" "}
          <span className="font-bold text-gray-800">blibli</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#ffc107]"></span>
          <span className="font-bold text-[#0194f3]">tiket</span>
        </p>

        {/* Login Card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center gap-3 px-4 py-3 bg-[#0194f3] hover:bg-[#0180d6] rounded-xl text-white transition-colors mb-4"
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
            <div className="text-left flex-1">
              <p className="font-medium text-sm">Continue as Ni</p>
              <p className="text-xs text-white/80">ni.darmayanti@tiket.com</p>
            </div>
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            </div>
          </button>

          {/* Email/Phone Login Button */}
          <button
            onClick={() => setShowEmailForm(!showEmailForm)}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="text-sm">Lanjut dengan nomor HP atau email</span>
          </button>

          {/* Email Form */}
          {showEmailForm && (
            <form onSubmit={handleEmailLogin} className="mt-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Masukkan email"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0194f3]/20 focus:border-[#0194f3] mb-3"
              />
              <button
                type="submit"
                className="w-full py-3 bg-[#0194f3] hover:bg-[#0180d6] text-white rounded-xl font-medium transition-colors"
              >
                Login
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-400">Atau lanjut dengan</span>
            <div className="flex-1 h-px bg-gray-200"></div>
          </div>

          {/* Social Login Options */}
          <div className="flex justify-center gap-4">
            <button className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
              </svg>
            </button>
            <button className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
              </svg>
            </button>
            <button className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <svg className="w-6 h-6" viewBox="0 0 24 24">
                <path fill="#F25022" d="M1 1h10v10H1z" />
                <path fill="#00A4EF" d="M1 13h10v10H1z" />
                <path fill="#7FBA00" d="M13 1h10v10H13z" />
                <path fill="#FFB900" d="M13 13h10v10H13z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Terms */}
        <p className="mt-8 text-sm text-gray-600 text-center max-w-md">
          Dengan log in, kamu menyetujui{" "}
          <a href="#" className="text-[#0194f3] underline">
            Kebijakan Privasi
          </a>{" "}
          dan{" "}
          <a href="#" className="text-[#0194f3] underline">
            Syarat & Ketentuan
          </a>{" "}
          Blibli Tiket.
        </p>
      </div>
    </div>
  );
}

