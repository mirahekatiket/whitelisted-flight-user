"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useBooking } from "@/context/BookingContext";
import { authService } from "@/services/auth.service";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useBooking();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please enter both email and password");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await authService.login({ email, password });
      
      // Check if user is admin (they should use admin login)
      if (response.user.role === "admin") {
        setError("Admin users should use the Admin Login page.");
        authService.logout();
        return;
      }
      
      setUser(response.user);
      router.push("/search");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-600 text-sm mb-6">Sign in to book your next flight</p>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm flex items-start gap-2">
              <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          {/* Email Form */}
          {!showEmailForm ? (
            <>
              {/* Quick Login Options */}
              <button
                onClick={() => setShowEmailForm(true)}
                className="w-full flex items-center justify-center gap-3 px-4 py-3 bg-[#0194f3] hover:bg-[#0180d6] rounded-xl text-white transition-colors mb-4"
              >
                <svg
                  className="w-5 h-5"
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
                <span className="font-medium text-sm">Login with Email</span>
              </button>
            </>
          ) : (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  disabled={isLoading}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0194f3]/20 focus:border-[#0194f3] disabled:opacity-50"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  disabled={isLoading}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0194f3]/20 focus:border-[#0194f3] disabled:opacity-50"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-[#0194f3] hover:bg-[#0180d6] text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Logging in..." : "Sign In"}
              </button>

              <button
                type="button"
                onClick={() => setShowEmailForm(false)}
                disabled={isLoading}
                className="w-full py-2 text-gray-600 hover:text-gray-900 text-sm transition-colors"
              >
                Cancel
              </button>
            </form>
          )}

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-gray-200"></div>
            <span className="text-sm text-gray-400">Or continue with</span>
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

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-[#0194f3] hover:text-[#0180d6] font-medium underline">
                Create Account
              </Link>
            </p>
          </div>

          {/* Admin Login Link */}
          <div className="mt-4 pt-4 border-t border-gray-200 text-center">
            <p className="text-sm text-gray-600">
              Are you an administrator?{" "}
              <Link href="/admin-login" className="text-[#0194f3] hover:text-[#0180d6] font-medium underline">
                Admin Login
              </Link>
            </p>
          </div>
        </div>

        {/* Terms */}
        <p className="mt-8 text-sm text-gray-600 text-center max-w-md">
          By logging in, you agree to{" "}
          <a href="#" className="text-[#0194f3] underline">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="#" className="text-[#0194f3] underline">
            Terms & Conditions
          </a>{" "}
          of Blibli Tiket.
        </p>
      </div>
    </div>
  );
}
