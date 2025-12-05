"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/b2c/Header";
import { useBooking } from "@/context/BookingContext";
import { airports } from "@/data/airports";
import { Airport } from "@/types/flight";

export default function SearchPage() {
  const router = useRouter();
  const { searchParams, setSearchParams } = useBooking();
  const [origin, setOrigin] = useState<Airport | null>(
    airports.find((a) => a.code === "CGK") || null
  );
  const [destination, setDestination] = useState<Airport | null>(
    airports.find((a) => a.code === "DPS") || null
  );
  const [departureDate, setDepartureDate] = useState("2025-12-07");
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [passengers, setPassengers] = useState({ adults: 1, children: 0, infants: 0 });
  const [showOriginDropdown, setShowOriginDropdown] = useState(false);
  const [showDestDropdown, setShowDestDropdown] = useState(false);

  const handleSearch = () => {
    setSearchParams({
      origin,
      destination,
      departureDate,
      passengers,
      cabinClass: "economy",
      isRoundTrip,
    });
    router.push("/flights");
  };

  const swapLocations = () => {
    const temp = origin;
    setOrigin(destination);
    setDestination(temp);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      day: "numeric",
      month: "short",
    });
  };

  const totalPassengers = passengers.adults + passengers.children + passengers.infants;

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section */}
      <div className="relative h-[500px] overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&auto=format&fit=crop&w=2074&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/50"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 pt-16">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Book flight tickets and
            <br />
            flight schedules
          </h1>
        </div>

        {/* Search Card */}
        <div className="absolute bottom-0 right-0 left-0 md:left-auto md:right-8 md:bottom-8 md:w-[420px]">
          {/* Promo Banner */}
          <div className="hidden md:flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#00C9A7] to-[#845EC2] rounded-t-2xl text-white">
            <span className="text-2xl">🎉</span>
            <div className="flex-1">
              <p className="text-sm font-medium">
                Lowest Price Guarantee! Found cheaper domestic tickets? Claim 2x
                the price gap! (*)
              </p>
            </div>
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>

          {/* Search Form */}
          <div className="bg-white md:rounded-b-2xl md:rounded-tr-2xl shadow-xl p-5">
            {/* From */}
            <div className="relative mb-3">
              <label className="block text-xs text-gray-400 mb-1">From</label>
              <button
                onClick={() => {
                  setShowOriginDropdown(!showOriginDropdown);
                  setShowDestDropdown(false);
                }}
                className="w-full text-left"
              >
                <p className="text-lg font-semibold text-gray-900">
                  {origin?.city}{" "}
                  <span className="text-gray-400 font-normal">
                    {origin?.code}
                  </span>
                </p>
              </button>
              {showOriginDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-20">
                  {airports.map((airport) => (
                    <button
                      key={airport.code}
                      onClick={() => {
                        setOrigin(airport);
                        setShowOriginDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                      <p className="font-medium text-gray-900">
                        {airport.city}{" "}
                        <span className="text-gray-400">{airport.code}</span>
                      </p>
                      <p className="text-xs text-gray-500">{airport.name}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Swap Button */}
            <div className="flex justify-end -my-2 relative z-10">
              <button
                onClick={swapLocations}
                className="w-10 h-10 bg-white border border-gray-200 rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"
                  />
                </svg>
              </button>
            </div>

            {/* To */}
            <div className="relative mb-4 pt-2 border-t border-gray-100">
              <label className="block text-xs text-gray-400 mb-1">To</label>
              <button
                onClick={() => {
                  setShowDestDropdown(!showDestDropdown);
                  setShowOriginDropdown(false);
                }}
                className="w-full text-left"
              >
                <p className="text-lg font-semibold text-gray-900">
                  {destination?.city}{" "}
                  <span className="text-gray-400 font-normal">
                    {destination?.code}
                  </span>
                </p>
              </button>
              {showDestDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 max-h-60 overflow-y-auto z-20">
                  {airports.map((airport) => (
                    <button
                      key={airport.code}
                      onClick={() => {
                        setDestination(airport);
                        setShowDestDropdown(false);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-0"
                    >
                      <p className="font-medium text-gray-900">
                        {airport.city}{" "}
                        <span className="text-gray-400">{airport.code}</span>
                      </p>
                      <p className="text-xs text-gray-500">{airport.name}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Date & Round Trip */}
            <div className="flex items-center gap-4 mb-4 pt-3 border-t border-gray-100">
              <div className="flex-1">
                <label className="block text-xs text-gray-400 mb-1">
                  Departure
                </label>
                <input
                  type="date"
                  value={departureDate}
                  onChange={(e) => setDepartureDate(e.target.value)}
                  className="w-full text-gray-900 font-semibold bg-transparent focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">Roundtrip?</span>
                <button
                  onClick={() => setIsRoundTrip(!isRoundTrip)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    isRoundTrip ? "bg-[#0194f3]" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${
                      isRoundTrip ? "left-6" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Passengers */}
            <div className="mb-5 pt-3 border-t border-gray-100">
              <button className="w-full text-left">
                <p className="text-gray-900 font-semibold">
                  {totalPassengers} Passenger{totalPassengers > 1 ? "s" : ""}, Economy
                </p>
              </button>
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="w-full py-3.5 bg-[#0194f3] hover:bg-[#0180d6] text-white font-semibold rounded-xl transition-colors"
            >
              Let&apos;s Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

