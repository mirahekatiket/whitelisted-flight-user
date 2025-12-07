"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/b2c/Header";
import { useBooking } from "@/context/BookingContext";

export default function ConfirmationPage() {
  const { selectedFlight, selectedFare, searchParams, user } = useBooking();
  const [bookingCode, setBookingCode] = useState("");

  useEffect(() => {
    // Generate random booking code
    const code = `TKT${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setBookingCode(code);
  }, []);

  const segment = selectedFlight?.segments[0];
  const origin = searchParams.origin || segment?.departure.airport;
  const destination = searchParams.destination || segment?.arrival.airport;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#E8F4FD] to-white">
      {/* Header */}
      <Header />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Pemesanan Berhasil! 🎉
          </h1>
          <p className="text-gray-600">
            E-tiket telah dikirim ke email {user?.email || "anda"}
          </p>
        </div>

        {/* Booking Details Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {/* Booking Code */}
          <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-cyan-50">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Kode Booking</p>
                <p className="text-2xl font-bold text-[#0194f3] font-mono">
                  {bookingCode}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 font-medium rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  Issued
                </span>
              </div>
            </div>
          </div>

          {/* Flight Details */}
          {selectedFlight && segment && (
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">
                    {origin?.code}
                  </p>
                  <p className="text-gray-500">{origin?.city}</p>
                </div>
                <div className="flex-1 px-6">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full border-2 border-[#0194f3]"></div>
                    <div className="flex-1 h-0.5 bg-[#0194f3]"></div>
                    <div className="w-8 h-8 bg-[#0194f3] rounded-full flex items-center justify-center">
                      <svg
                        className="w-4 h-4 text-white rotate-90"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                      </svg>
                    </div>
                    <div className="flex-1 h-0.5 bg-[#0194f3]"></div>
                    <div className="w-3 h-3 rounded-full bg-[#0194f3]"></div>
                  </div>
                  <p className="text-center text-sm text-gray-500 mt-2">
                    {segment.duration} • Langsung
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-3xl font-bold text-gray-900">
                    {destination?.code}
                  </p>
                  <p className="text-gray-500">{destination?.city}</p>
                </div>
              </div>

              {/* Flight Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm text-gray-500">Tanggal Keberangkatan</p>
                  <p className="font-semibold text-gray-900">
                    Minggu, 07 Des 2025
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Maskapai</p>
                  <p className="font-semibold text-gray-900">
                    {segment.airline.name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Waktu</p>
                  <p className="font-semibold text-gray-900">
                    {segment.departure.time} - {segment.arrival.time}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Nomor Penerbangan</p>
                  <p className="font-semibold text-gray-900">
                    {segment.flightNumber}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Passenger Info */}
          <div className="px-6 pb-6">
            <h3 className="font-semibold text-gray-900 mb-3">
              Detail Penumpang
            </h3>
            <div className="p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#0194f3] rounded-full flex items-center justify-center text-white font-semibold">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {user?.name || "Guest User"}
                  </p>
                  <p className="text-sm text-gray-500">Dewasa</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Summary */}
          {selectedFare && (
            <div className="px-6 pb-6">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                <span className="font-medium text-gray-900">
                  Total Pembayaran
                </span>
                <span className="text-xl font-bold text-[#0194f3]">
                  IDR {formatPrice(selectedFare.price)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button className="flex-1 py-3.5 border-2 border-[#0194f3] text-[#0194f3] font-semibold rounded-xl hover:bg-blue-50 transition-colors">
            Download E-Tiket
          </button>
          <Link
            href="/search"
            className="flex-1 py-3.5 bg-[#0194f3] hover:bg-[#0180d6] text-white font-semibold rounded-xl transition-colors text-center"
          >
            Booking Lagi
          </Link>
        </div>

        {/* Help Section */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            Butuh bantuan?{" "}
            <a href="#" className="text-[#0194f3] font-medium">
              Hubungi Customer Service
            </a>
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="flex items-center justify-center gap-1 mb-2">
            <span className="font-bold text-gray-800">blibli</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffc107]"></span>
            <span className="font-bold text-[#0194f3]">tiket</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2011-2025 PT. Global Tiket Network. All Rights Reserved
          </p>
        </div>
      </footer>
    </div>
  );
}

