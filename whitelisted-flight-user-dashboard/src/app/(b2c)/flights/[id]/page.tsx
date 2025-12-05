"use client";

import { useRouter, useParams } from "next/navigation";
import Header from "@/components/b2c/Header";
import { useBooking } from "@/context/BookingContext";
import { mockFlights } from "@/data/mockFlights";
import { FareOption } from "@/types/flight";

export default function FlightDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { selectedFlight, setSelectedFlight, setSelectedFare, searchParams } = useBooking();

  // Find flight from mock data if not in context
  const flight = selectedFlight || mockFlights.find((f) => f.id === params.id);

  if (!flight) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p>Flight not found</p>
      </div>
    );
  }

  const segment = flight.segments[0];
  const origin = searchParams.origin || segment.departure.airport;
  const destination = searchParams.destination || segment.arrival.airport;

  const handleSelectFare = (fare: FareOption) => {
    setSelectedFlight(flight);
    setSelectedFare(fare);
    router.push("/booking");
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID").format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* Route Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center gap-3 text-gray-600">
            <span className="font-semibold text-gray-900">{origin.code}</span>
            <span>→</span>
            <span className="font-semibold text-gray-900">{destination.code}</span>
            <span>•</span>
            <span>1 Dewasa</span>
            <span>•</span>
            <span>Ekonomi</span>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Flight Details Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
          {/* Header */}
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-50 text-[#0194f3] text-sm font-medium rounded-lg">
                  Pergi
                </span>
                <span className="text-gray-900 font-medium">
                  Min, 07 Des 2025
                </span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600">{segment.duration}</span>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
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
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Flight Timeline */}
          <div className="p-5">
            <div className="flex items-start gap-4">
              {/* Timeline */}
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-[#0194f3]"></div>
                <div className="w-0.5 h-16 bg-gray-200 my-1"></div>
                <div className="w-3 h-3 rounded-full bg-[#0194f3]"></div>
              </div>

              {/* Details */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {segment.departure.time}
                    </p>
                    <p className="text-gray-600">
                      {segment.departure.airport.name} - {segment.departure.terminal}
                    </p>
                  </div>
                </div>

                {/* Airline Info */}
                <div className="flex items-center gap-3 py-4 border-y border-gray-100 my-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="font-bold text-gray-600 text-sm">
                      {segment.airline.code}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900">{segment.airline.name}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-400">🍽️</span>
                  </div>
                </div>

                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      {segment.arrival.time}
                    </p>
                    <p className="text-gray-600">
                      {segment.arrival.airport.name} - {segment.arrival.terminal}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Fare Options */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Pilih tarif tiketmu
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {flight.fareOptions.map((fare) => (
              <div
                key={fare.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <div className="p-5">
                  {/* Savings Badge */}
                  {fare.originalPrice && (
                    <div className="inline-block px-2 py-1 bg-red-50 text-red-600 text-xs font-medium rounded mb-3">
                      Hemat IDR {formatPrice(fare.originalPrice - fare.price)}
                    </div>
                  )}

                  {/* Price */}
                  <div className="flex items-baseline justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-orange-500">
                        IDR {formatPrice(fare.price)}
                      </p>
                      <p className="text-sm text-gray-400">/pax</p>
                    </div>
                    <button
                      onClick={() => handleSelectFare(fare)}
                      className="px-6 py-2.5 bg-[#0194f3] hover:bg-[#0180d6] text-white font-medium rounded-xl transition-colors"
                    >
                      Pilih
                    </button>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <span>🎒</span>
                      <span>{fare.features.cabinBaggage},</span>
                      <span>🧳</span>
                      <span>{fare.features.checkedBaggage},</span>
                      <span>🍽️</span>
                      <span>{fare.features.meal}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-gray-400 mt-0.5"
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
                      <span
                        className={`${
                          fare.features.refund.includes("Refundable")
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      >
                        {fare.features.refund}
                      </span>
                    </div>
                    <div className="flex items-start gap-2">
                      <svg
                        className={`w-4 h-4 mt-0.5 ${
                          fare.features.reschedule.includes("Bebas")
                            ? "text-green-500"
                            : "text-gray-400"
                        }`}
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
                      <span
                        className={`${
                          fare.features.reschedule.includes("Bebas")
                            ? "text-green-600"
                            : "text-gray-600"
                        }`}
                      >
                        Reschedule: {fare.features.reschedule}
                      </span>
                    </div>
                  </div>

                  {/* Exclusive Badge */}
                  {fare.isExclusive && (
                    <div className="mt-4 inline-flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded">
                      ⚡ Hanya di tiket.com
                    </div>
                  )}

                  {/* Fare Name */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-sm text-gray-500">{fare.name}</p>
                    <button className="text-[#0194f3] text-sm font-medium mt-1">
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-gray-500">
          <p>Menampilkan harga paling update dari tarif yang ada</p>
          <p>Terakhir diperbarui: 05 Des 2025, 15:29</p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <p className="text-sm text-gray-500">
            © 2011-2025 PT. Global Tiket Network. All Rights Reserved
          </p>
          <div className="flex items-center gap-1">
            <span className="font-bold text-gray-800">blibli</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#ffc107]"></span>
            <span className="font-bold text-[#0194f3]">tiket</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

