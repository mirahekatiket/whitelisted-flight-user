"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/b2c/Header";
import { useBooking } from "@/context/BookingContext";
import { mockFlights, dateOptions } from "@/data/mockFlights";
import { Flight } from "@/types/flight";

export default function FlightsPage() {
  const router = useRouter();
  const { searchParams, setSelectedFlight } = useBooking();
  const [selectedDate, setSelectedDate] = useState(2);

  const origin = searchParams.origin || { code: "CGK", city: "Jakarta" };
  const destination = searchParams.destination || { code: "DPS", city: "Denpasar-Bali" };

  const handleSelectFlight = (flight: Flight) => {
    setSelectedFlight(flight);
    router.push(`/flights/${flight.id}`);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  return (
    <div className="min-h-screen bg-[#E8F4FD]">
      <Header />

      {/* Search Summary Bar */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-400"
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
                <span className="font-semibold text-gray-900">
                  {origin.city}, {origin.code}
                </span>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                  />
                </svg>
                <span className="font-semibold text-gray-900">
                  {destination.city}, {destination.code}
                </span>
              </div>
              <span className="text-gray-600">
                Min, 7 Des 25 (Sekali Jalan)
              </span>
              <span className="text-gray-600">1 penumpang, Ekonomi</span>
            </div>
            <button className="px-6 py-2 border-2 border-[#0194f3] text-[#0194f3] font-medium rounded-full hover:bg-blue-50 transition-colors">
              Cari
            </button>
          </div>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto py-3 gap-2 scrollbar-hide">
            {dateOptions.map((option, index) => (
              <button
                key={index}
                onClick={() => setSelectedDate(index)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-center transition-colors ${
                  selectedDate === index
                    ? "bg-[#0194f3] text-white"
                    : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                }`}
              >
                <p className="text-xs whitespace-nowrap">{option.date}</p>
                <p
                  className={`font-semibold ${
                    selectedDate === index ? "text-white" : "text-[#0194f3]"
                  }`}
                >
                  IDR {formatPrice(option.price)}
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center gap-3 overflow-x-auto">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap">
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
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              Filter
            </button>
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap">
              Urutkan
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
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap">
              Transit
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
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap">
              ✈️ Maskapai
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
            <button className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap">
              Tiket 100% Refund
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap">
              Penerbangan Langsung
            </button>
            <button className="px-4 py-2 border border-gray-300 rounded-full text-sm text-gray-700 hover:bg-gray-50 whitespace-nowrap">
              Harga Gledek
            </button>
          </div>
        </div>
      </div>

      {/* Promo Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <div className="bg-gradient-to-r from-[#00C9A7] to-[#845EC2] rounded-2xl p-4 flex items-center gap-4">
          <span className="text-3xl">🎉</span>
          <p className="flex-1 text-white">
            Wah, ada <strong>Jaminan Harga Termurah</strong> untuk tujuan
            penerbangan yang kamu cari! (*)
          </p>
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>

      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⚡</span>
            <h2 className="text-xl font-bold text-gray-900">Harga Gledek</h2>
          </div>
          <div className="flex items-center gap-1">
            <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
              23
            </span>
            <span className="text-gray-400">:</span>
            <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
              59
            </span>
            <span className="text-gray-400">:</span>
            <span className="bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
              53
            </span>
          </div>
        </div>
      </div>

      {/* Flight List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-4 pb-8">
        <div className="space-y-4">
          {mockFlights.map((flight) => (
            <div
              key={flight.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden"
            >
              {/* Flight Card */}
              <div className="p-5">
                <div className="flex items-start justify-between">
                  {/* Airline & Flight Info */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-lg font-bold text-gray-600">
                        {flight.segments[0].airline.code}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900">
                          {flight.segments[0].airline.name}
                        </span>
                        <span className="text-gray-400">🧳</span>
                        <span className="text-gray-400">🍽️</span>
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        {flight.tags.map((tag, index) => (
                          <span
                            key={index}
                            className={`text-xs px-2 py-0.5 rounded ${
                              tag === "Bisa 100% Refund"
                                ? "bg-green-100 text-green-700"
                                : "text-[#0194f3]"
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Time & Duration */}
                  <div className="flex items-center gap-6 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {flight.segments[0].departure.time}
                      </p>
                      <p className="text-sm text-gray-500">
                        {flight.segments[0].departure.airport.code}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">
                        {flight.segments[0].duration}
                      </p>
                      <div className="w-24 h-px bg-gray-300 my-1 relative">
                        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                      </div>
                      <p className="text-xs text-gray-500">Langsung</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {flight.segments[0].arrival.time}
                      </p>
                      <p className="text-sm text-gray-500">
                        {flight.segments[0].arrival.airport.code}
                      </p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    {flight.fareOptions[0].originalPrice && (
                      <div className="inline-block px-2 py-0.5 bg-yellow-100 text-yellow-800 text-xs rounded mb-1">
                        ⚡ Harga Gledek tasting
                      </div>
                    )}
                    <p className="text-2xl font-bold text-orange-500">
                      IDR {formatPrice(flight.lowestPrice)}
                      <span className="text-sm font-normal text-gray-500">
                        /pax
                      </span>
                    </p>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <span>Fast Track</span>
                    <span>•</span>
                    <span>Jaminan Harga Termurah</span>
                  </div>
                  <button
                    onClick={() => handleSelectFlight(flight)}
                    className="text-[#0194f3] font-medium text-sm hover:underline flex items-center gap-1"
                  >
                    Tampilkan detail
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
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

